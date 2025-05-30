import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { BookService } from '../../services/book.service';
import { SaleService } from '../../services/sale.service';
import { AuthService } from '../../services/auth.service';
import { Book } from '../../models/book.model';
import { SaleItem, SaleRequest } from '../../models';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap, map, takeUntil } from 'rxjs/operators'; // Added takeUntil
import { Observable, of, Subject, Subscription } from 'rxjs';

// Interface for items displayed in the current sale list
interface DisplaySaleItem { 
  bookId: number;    
  quantity: number;  
  title: string;
  price: number;
  currentStock?: number; // Optional, to align with book.stock being optional
}

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.scss'], // Will create this file
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, TablerIconsModule]
})
export class PosComponent implements OnInit, OnDestroy {
  bookSearchForm: FormGroup;
  customerForm: FormGroup;
  
  searchResults$: Observable<Book[]> = of([]);
  private searchTerms = new Subject<string>();
  private componentDestroyed$ = new Subject<void>();

  currentSaleItems: DisplaySaleItem[] = [];
  currentSaleTotal: number = 0;
  
  isLoadingSearch = false;
  isLoadingSale = false;
  saleSuccessMessage: string | null = null;
  saleErrorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private saleService: SaleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.bookSearchForm = this.fb.group({
      searchTerm: [''],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.customerForm = this.fb.group({
      customerName: [''] // Optional customer name
    });

    this.searchResults$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoadingSearch = true),
      switchMap((term: string) => {
        if (!term.trim()) {
          this.isLoadingSearch = false;
          return of([]);
        }
        return this.bookService.getBooks({ title: term }, 0, 5).pipe(
          map(page => page.content),
          catchError(() => {
            this.isLoadingSearch = false;
            return of([]);
          }),
          tap(() => this.isLoadingSearch = false)
        );
      }),
      takeUntil(this.componentDestroyed$)
    );
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }

  searchBooks(event: Event): void {
     const term = (event.target as HTMLInputElement).value;
     this.searchTerms.next(term);
  }

  addBookToSale(book: Book): void {
    const quantityToAdd = this.bookSearchForm.get('quantity')?.value || 1;
    if (quantityToAdd <= 0) return;

    const existingItem = this.currentSaleItems.find(item => item.bookId === book.id);
    const stockForBook = book.stock; // This is number | undefined

    if (existingItem) {
      const currentItemQuantityInCart = existingItem.quantity;
      // Max quantity user can set for this item = its original stock (if defined)
      // If stock is undefined, no upper limit from stock perspective.
      const maxAllowedBasedOnStock = stockForBook !== undefined ? stockForBook : Infinity;
      const newQuantity = currentItemQuantityInCart + quantityToAdd;
      existingItem.quantity = Math.min(newQuantity, maxAllowedBasedOnStock);

    } else {
      this.currentSaleItems.push({
        bookId: book.id,
        quantity: Math.min(quantityToAdd, stockForBook !== undefined ? stockForBook : Infinity),
        title: book.title,
        price: book.price,
        currentStock: stockForBook // Store the initial stock (number | undefined)
      });
    }
    this.bookSearchForm.patchValue({ searchTerm: '', quantity: 1 });
    this.searchTerms.next(''); // Clear results by emitting empty search term
    this.calculateSaleTotal();
  }

  updateSaleItemQuantity(bookId: number, event: Event): void {
    const newQuantity = parseInt((event.target as HTMLInputElement).value, 10);
    const item = this.currentSaleItems.find(i => i.bookId === bookId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeSaleItem(bookId);
      } else {
        // Use currentStock (initial stock of the book when added) for validation
        const maxQuantity = item.currentStock !== undefined ? item.currentStock : Infinity;
        item.quantity = Math.min(newQuantity, maxQuantity); 
        (event.target as HTMLInputElement).value = item.quantity.toString(); // Reflect actual quantity set
        this.calculateSaleTotal();
      }
    }
  }

  removeSaleItem(bookId: number): void {
    this.currentSaleItems = this.currentSaleItems.filter(item => item.bookId !== bookId);
    this.calculateSaleTotal();
  }

  private calculateSaleTotal(): void {
    this.currentSaleTotal = this.currentSaleItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  finalizeSale(): void {
    if (this.currentSaleItems.length === 0) {
      this.saleErrorMessage = "No hay artículos en la venta.";
      return;
    }
    const currentUser = this.authService.currentUserValue;
    // Assuming User model has 'id' which is the seller's ID
    if (!currentUser || currentUser.id === undefined || currentUser.id === null) { 
      this.saleErrorMessage = "Vendedor no autenticado correctamente. Se requiere ID del vendedor.";
      // Potentially logout or redirect if user state is invalid
      // this.authService.logout(); 
      // this.router.navigate(['/login']);
      return;
    }

    this.isLoadingSale = true;
    this.saleSuccessMessage = null;
    this.saleErrorMessage = null;

    const saleRequest: SaleRequest = {
      sellerId: currentUser.id,
      customerName: this.customerForm.get('customerName')?.value || undefined,
      items: this.currentSaleItems.map(displayItem => ({ // Map DisplaySaleItem back to SaleItem for request
        bookId: displayItem.bookId,
        quantity: displayItem.quantity
      }))
    };

    this.saleService.createSale(saleRequest).subscribe({
      next: (response) => {
        this.isLoadingSale = false;
        this.saleSuccessMessage = `Venta #${response.saleId} registrada. Total: ${response.totalAmount.toFixed(2)}`;
        this.currentSaleItems = [];
        this.calculateSaleTotal();
        this.customerForm.reset();
        this.bookSearchForm.patchValue({ searchTerm: '', quantity: 1 });
        this.searchTerms.next('');
      },
      error: (err) => {
        this.isLoadingSale = false;
        this.saleErrorMessage = err.message || 'Error al registrar la venta.';
      }
    });
  }
}
