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
  private routeSub: Subscription | undefined;

  // Stock simulado
  stockStatus = 'Disponible'; // Podría ser 'Pocos disponibles', 'Agotado'
  stockQuantity = Math.floor(Math.random() * 20) + 1; // Cantidad aleatoria entre 1 y 20

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService // Inyectar CartService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.isLoading = true;
        if (id) {
          return this.bookService.getBookById(id);
        }
        return []; // o of(undefined) o throwError si prefieres manejarlo así
      })
    ).subscribe(bookData => {
      this.book = bookData;
      this.isLoading = false;
      if (bookData) {
         // Simular estado de stock basado en cantidad (ejemplo)
         if (this.stockQuantity < 5 && this.stockQuantity > 0) this.stockStatus = 'Pocos disponibles';
         else if (this.stockQuantity === 0) this.stockStatus = 'Agotado';
         else this.stockStatus = 'Disponible';
      }
    }, error => {
      console.error('Error fetching book details:', error);
      this.isLoading = false;
      // Aquí podrías redirigir a una página de 'no encontrado' o mostrar un mensaje.
    });
  }

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
