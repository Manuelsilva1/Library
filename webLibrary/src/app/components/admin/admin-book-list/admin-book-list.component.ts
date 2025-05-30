import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BookService } from '../../../services/book.service'; // Ajusta la ruta si es necesario
import { Book } from '../../../models/book.model'; // Ajusta la ruta si es necesario
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module'; // Para UI
import { TablerIconsModule } from 'angular-tabler-icons';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-admin-book-list',
  templateUrl: './admin-book-list.component.html',
  styleUrls: ['./admin-book-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule]
})
export class AdminBookListComponent implements OnInit {
  books: Book[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  // Paginación
  currentPage: number = 1; // MatPaginator es 0-indexed, pero BookService espera 1-indexed
  pageSize: number = 10;
  totalBooks: number = 0;
  pageSizeOptions = [5, 10, 25, 100];


  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.errorMessage = null;
    // BookService.getBooks espera página 1-indexed, MatPaginator devuelve 0-indexed
    this.bookService.getBooks({}, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.books = response.books;
        this.totalBooks = response.total;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Error al cargar la lista de libros.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  addBook(): void {
    this.router.navigate(['/admin/books/new']);
  }

  editBook(bookId: number): void {
    this.router.navigate(['/admin/books/edit', bookId]);
  }

  deleteBook(bookId: number): void {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      this.isLoading = true; // Podría ser un loading específico para la fila
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.isLoading = false;
          // Recargar la lista o eliminar localmente
          // Si la página actual queda vacía después de eliminar, ajustar currentPage
          if (this.books.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.loadBooks();
          // Opcional: mostrar mensaje de éxito con un snackbar
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Error al eliminar el libro.';
          // Opcional: mostrar mensaje de error con un snackbar
        }
      });
    }
  }

  handlePageEvent(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1; // Convert 0-indexed to 1-indexed for service
    this.pageSize = event.pageSize;
    this.loadBooks();
  }
}
