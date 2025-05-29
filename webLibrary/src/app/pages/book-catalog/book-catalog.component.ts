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

  loadBooks(filters: Filters): void {
    this.isLoadingBooks = true;
    this.booksError = null;
    // BookService espera página 1-indexed
    this.bookService.getBooks(filters, this.currentPage, this.pageSize)
      .subscribe({
        next: response => {
          this.books = response.books;
          this.totalBooks = response.total;
          this.isLoadingBooks = false;
        },
        error: err => {
          this.booksError = err.message || 'Error al cargar los libros.';
          this.isLoadingBooks = false;
          this.books = [];
          this.totalBooks = 0;
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
    
    // Clean up filters: remove null, undefined, or empty string values
    const activeFilters: Filters = {};
    Object.entries(rawFilters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && String(value).trim() !== '') {
        activeFilters[key as keyof Filters] = value as any;
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
    this.currentPage = event.pageIndex + 1; // MatPaginator is 0-indexed
    this.pageSize = event.pageSize;
    // Filters are taken from the form, so just load books for the new page
    this.loadBooks(this.filterForm.value as Filters);
  }
}
