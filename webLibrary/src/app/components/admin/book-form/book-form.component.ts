import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, CommonModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../../services/book.service'; // Ajusta la ruta si es necesario
import { Book } from '../../../models/book.model'; // Ajusta la ruta si es necesario
import { MaterialModule } from '../../../material.module'; // Para UI
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, TablerIconsModule]
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  isEditMode = false;
  bookId: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      shortDescription: [''],
      coverImageUrl: [''],
      publisher: [''],
      publishDate: [''], // Se manejará como string yyyy-MM-dd
      pages: [0, Validators.min(0)],
      isbn: [''],
      language: [''],
      additionalImageUrls: [''], // String separado por comas
      stock: [0, [Validators.required, Validators.min(0)]] // Añadir control de stock
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.bookId = +id;
        this.loadBookData();
      }
    });
  }

  loadBookData(): void {
    if (!this.bookId) return;
    this.isLoading = true;
    this.bookService.getBookById(this.bookId).subscribe({
      next: (book) => {
        if (book) {
          // Convertir array de additionalImageUrls a string separado por comas
          const bookDataForForm = {
            ...book,
            additionalImageUrls: book.additionalImageUrls ? book.additionalImageUrls.join(', ') : '',
            publishDate: book.publishDate ? book.publishDate.toString().split('T')[0] : '' // Formato yyyy-MM-dd
          };
          this.bookForm.patchValue(bookDataForForm);
        } else {
          this.errorMessage = 'Libro no encontrado.';
          // Opcional: Redirigir si el libro no se encuentra en modo edición
          // this.router.navigate(['/admin/books']); 
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar los datos del libro.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched(); // Marcar campos para mostrar errores
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const formValue = this.bookForm.value;
    const bookData: Partial<Book> = {
      ...formValue,
      // Convertir string de additionalImageUrls a array
      additionalImageUrls: formValue.additionalImageUrls ? formValue.additionalImageUrls.split(',').map((s: string) => s.trim()).filter((s: string) => s) : [],
      // Asegurar que el precio, las páginas y el stock sean números
      price: parseFloat(formValue.price),
      pages: parseInt(formValue.pages, 10),
      stock: parseInt(formValue.stock, 10),
      // publishDate ya está como string, el backend lo espera así (según BookDto) o necesita parseo allí.
      // Si el backend espera LocalDate, el servicio backend ya maneja la conversión de string yyyy-MM-dd.
    };

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, bookData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Libro actualizado con éxito.';
          // Opcional: Redirigir o resetear form
          // this.router.navigate(['/admin/books']);
           setTimeout(() => this.router.navigate(['/admin/books']), 2000); // Placeholder redirect
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Error al actualizar el libro.';
        }
      });
    } else {
      this.bookService.createBook(bookData).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Libro creado con éxito.';
          this.bookForm.reset();
          // Opcional: Redirigir
          // this.router.navigate(['/admin/books']);
           setTimeout(() => this.router.navigate(['/admin/books']), 2000); // Placeholder redirect
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Error al crear el libro.';
        }
      });
    }
  }
}
