import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para los filtros
import { MaterialModule } from 'src/app/material.module'; // Para UI de filtros y paginador
import { BookCardComponent } from '../../components/book-card/book-card.component'; // Ajusta ruta
import { BookService, Filters } from '../../services/book.service'; // Ajusta ruta
import { Book } from '../../models/book.model'; // Ajusta ruta
import { PageEvent } from '@angular/material/paginator'; // Para el paginador
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TablerIconsModule } from 'angular-tabler-icons';


@Component({
  selector: 'app-book-catalog',
  templateUrl: './book-catalog.component.html',
  styleUrls: ['./book-catalog.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, ReactiveFormsModule, // Necesarios para ngModel y form reactivo si se usa
    MaterialModule, 
    BookCardComponent,
    TablerIconsModule // Para iconos en filtros
  ]
})
export class BookCatalogComponent implements OnInit {
  books: Book[] = [];
  categories: string[] = [];
  
  // Filtros
  filters: Filters = {};
  authorSearch$ = new Subject<string>();
  searchTerm$ = new Subject<string>();

  // Paginación
  totalBooks = 0;
  pageSize = 8;
  currentPage = 1;
  pageSizeOptions = [4, 8, 12, 24];

  // Para el slider de precio (opcional, si se implementa)
  priceMinFilter: number = 0;
  priceMaxFilter: number = 200; // Un máximo inicial alto

  constructor(private bookService: BookService) { }

  ngOnInit(): void {
    this.loadBooks();
    this.loadCategories();

    this.authorSearch$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(authorName => {
      this.filters.author = authorName || undefined; // Set to undefined if empty
      this.applyFiltersAndLoadBooks();
    });

    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.filters.searchTerm = searchTerm || undefined; // Set to undefined if empty
      this.applyFiltersAndLoadBooks();
    });
  }

  loadBooks(): void {
    this.bookService.getBooks(this.filters, this.currentPage, this.pageSize)
      .subscribe(response => {
        this.books = response.books;
        this.totalBooks = response.total;
      });
  }

  loadCategories(): void {
    this.bookService.getCategories().subscribe(cats => this.categories = cats);
  }

  onAuthorInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.authorSearch$.next(inputElement.value);
  }
 
  onSearchTermInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm$.next(inputElement.value);
  }

  applyCategoryFilter(category?: string): void {
    this.filters.category = category || undefined; // Set to undefined if '' (Todas)
    this.applyFiltersAndLoadBooks();
  }

  applyPriceFilter(): void {
     // Validar que min no sea mayor que max, etc.
     this.filters.priceMin = this.priceMinFilter > 0 ? this.priceMinFilter : undefined;
     this.filters.priceMax = this.priceMaxFilter > 0 && this.priceMaxFilter > (this.filters.priceMin || 0) ? this.priceMaxFilter : undefined;
     this.applyFiltersAndLoadBooks();
  }
 
  clearPriceFilter(): void {
     this.priceMinFilter = 0;
     this.priceMaxFilter = 200;
     this.filters.priceMin = undefined;
     this.filters.priceMax = undefined;
     this.applyFiltersAndLoadBooks();
  }

  applyFiltersAndLoadBooks(): void {
    this.currentPage = 1; // Resetear a la primera página con nuevos filtros
    this.loadBooks();
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadBooks();
  }
}
