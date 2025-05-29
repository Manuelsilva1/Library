import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Para el enlace al detalle del libro
import { MaterialModule } from 'src/app/material.module'; // Para mat-card, mat-button
import { Book } from '../../models/book.model'; // Ajusta la ruta si es necesario
import { CartService } from '../../services/cart.service'; // Importar CartService
import { TablerIconsModule } from 'angular-tabler-icons'; // Importar TablerIconsModule

@Component({
  selector: 'app-book-card',
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule] // Añadir TablerIconsModule
})
export class BookCardComponent implements OnInit {
  @Input() book!: Book; // Recibe un objeto Book como entrada

  constructor(private cartService: CartService) { } // Inyectar CartService

  ngOnInit(): void {
    if (!this.book) {
      console.error("BookCardComponent: 'book' input is required.");
    }
  }

  addToCart(event: MouseEvent): void {
    event.stopPropagation();
    if (this.book) {
      this.cartService.addItem(this.book);
      // Opcional: Mostrar una notificación/snackbar
      console.log(this.book.title + ' añadido al carrito desde la tarjeta.');
    }
  }
}
