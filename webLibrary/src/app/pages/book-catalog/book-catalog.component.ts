import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormBuilder, FormGroup
import { MaterialModule } from 'src/app/material.module';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BookService, Filters } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Subscription } from 'rxjs'; // Import Subscription
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
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
  filterForm: FormGroup;
  // filters: Filters = {}; // Reemplazado por filterForm
  // authorSearch$ = new Subject<string>(); // Reemplazado por filterForm
  // searchTerm$ = new Subject<string>(); // Reemplazado por filterForm

  // Paginación
  totalBooks = 0;
  pageSize = 8;
  currentPage = 1; // BookService espera 1-indexed
  pageSizeOptions = [4, 8, 12, 24];

  // Estado de carga y errores
  isLoadingBooks = false;
  isLoadingCategories = false;
  booksError: string | null = null;
  categoriesError: string | null = null;
  
  private destroy$ = new Subject<void>(); // Para desuscripciones

  constructor(
    private bookService: BookService,
    private fb: FormBuilder // Inyectar FormBuilder
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      author: [''],
      priceMin: [null],
      priceMax: [null],
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Cargar categorías para el select
    this.applyFilters(); // Cargar libros con filtros iniciales (vacíos)

    // Escuchar cambios en el formulario para aplicar filtros automáticamente (con debounce)
    this.filterForm.valueChanges.pipe(
      debounceTime(500), // Esperar 500ms después del último cambio
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)), // Solo emitir si el valor realmente cambió
      takeUntil(this.destroy$) // Desuscribirse cuando el componente se destruya
    ).subscribe(values => {
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBooks(filters: any): void { // Changed Filters to any for flexibility, or define a proper interface
    this.isLoadingBooks = true;
    this.booksError = null;
    // BookService.getBooks expects 0-indexed page
    this.bookService.getBooks(filters, this.currentPage - 1, this.pageSize) 
      .subscribe({
        next: response => { // response is BookPage
          this.books = response.content;
          this.totalBooks = response.totalElements;
          this.isLoadingBooks = false;
        },
        error: err => {
          this.booksError = err.message || 'Error al cargar los libros.';
          this.isLoadingBooks = false;
          this.books = []; // Clear books on error
          this.totalBooks = 0; // Reset total on error
        }
      });
  }

  loadCategories(): void {
    this.isLoadingCategories = true;
    this.categoriesError = null;
    this.bookService.getCategories().subscribe({
      next: cats => {
        this.categories = cats;
        this.isLoadingCategories = false;
      },
      error: err => {
        this.categoriesError = err.message || 'Error al cargar las categorías.';
        this.isLoadingCategories = false;
        this.categories = [];
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1; // Reset page to 1 when filters change
    const rawFilters = this.filterForm.value;
    
    const activeFilters: any = {}; // Using 'any' for flexibility
    Object.entries(rawFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value).trim() !== '') {
        if (key === 'searchTerm') {
          activeFilters['title'] = String(value).trim(); // Map searchTerm to title
        } else {
          activeFilters[key] = value;
        }
      }
    });

    this.loadBooks(activeFilters);
  }

  clearFilters(): void {
    this.filterForm.reset({
      category: '',
      author: '',
      priceMin: null,
      priceMax: null,
      searchTerm: ''
    });
    // applyFilters() will be triggered by valueChanges if form is dirty,
    // or call it explicitly if needed after reset if valueChanges isn't triggered.
    // this.applyFilters(); // Explicitly call if reset doesn't trigger valueChanges or for immediate effect
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator pageIndex is 0-indexed, this.currentPage becomes 1-indexed
    this.pageSize = event.pageSize;
    // Filters are taken from the form (which should have 'title' if searchTerm was used)
    // Need to re-apply the mapping from form's searchTerm to filter's title if not already done
    const rawFilters = this.filterForm.value;
    const activeFilters: any = {};
    Object.entries(rawFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value).trim() !== '') {
        if (key === 'searchTerm') {
          activeFilters['title'] = String(value).trim();
        } else {
          activeFilters[key] = value;
        }
      }
    });
    this.loadBooks(activeFilters);
  }
}
