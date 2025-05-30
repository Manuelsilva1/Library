import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router'; // RouterModule para routerLink si es necesario
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BookService } from '../../services/book.service'; // Ajusta ruta
import { CartService } from '../../services/cart.service'; // Importar CartService
import { Book } from '../../models/book.model'; // Ajusta ruta
import { MaterialModule } from 'src/app/material.module'; // Para botones, cards, chips, etc.
import { TablerIconsModule } from 'angular-tabler-icons'; // Para iconos

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule]
})
export class BookDetailComponent implements OnInit, OnDestroy {
  book: Book | undefined;
  isLoading = true;
  errorMessage: string | null = null;
  private routeSub: Subscription | undefined;

  // Las propiedades stockStatus y stockQuantity se eliminan, ya que usaremos book.stock directamente.

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService // Inyectar CartService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('id');
        this.isLoading = true;
        this.errorMessage = null;
        if (idParam) {
          const idAsNumber = +idParam; // Convert string ID to number
          if (isNaN(idAsNumber)) {
            this.isLoading = false;
            this.errorMessage = 'ID de libro inválido.';
            return []; // Or throwError, or of(undefined)
          }
          return this.bookService.getBookById(idAsNumber);
        }
        this.isLoading = false;
        this.errorMessage = 'No se proporcionó ID de libro.';
        return []; // o of(undefined) o throwError si prefieres manejarlo así
      })
    ).subscribe({
      next: bookData => {
        this.book = bookData;
        this.isLoading = false;
        if (!bookData) {
          // This case might happen if getBookById returns undefined for a 404,
          // or if the observable stream was empty due to invalid ID above.
          this.errorMessage = 'Libro no encontrado.';
        }
        // Ya no se necesita la lógica de stockStatus/stockQuantity aquí
      },
      error: err => {
        console.error('Error fetching book details:', err);
        this.isLoading = false;
        this.errorMessage = err.message || 'Error al cargar los detalles del libro.';
        // Aquí podrías redirigir a una página de 'no encontrado' o mostrar un mensaje.
      }
    });
  }
  // Se eliminó el bloque duplicado y erróneo que estaba aquí.

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  addToCart(): void {
    if (this.book) {
      this.cartService.addItem(this.book);
      // Opcional: Mostrar una notificación/snackbar
      console.log(this.book.title + ' añadido al carrito.');
      // Considerar añadir MatSnackBar para feedback visual
    }
  }
  
  // Helper para mostrar array como string (ej. additionalImageUrls)
  arrayToString(arr: string[] | undefined): string {
     return arr ? arr.join(', ') : '';
  }
}
