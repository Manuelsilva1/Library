import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service'; // Ajusta ruta
import { Cart, CartItem } from '../../models/cart.model'; // Ajusta ruta
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/material.module'; // Para UI
import { TablerIconsModule } from 'angular-tabler-icons'; // Para iconos

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule]
})
export class ShoppingCartComponent implements OnInit {
  cart$: Observable<Cart>;

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void { }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0) {
      this.cartService.updateItemQuantity(item.bookId, newQuantity);
    }
  }

  incrementQuantity(item: CartItem): void {
     this.updateQuantity(item, item.quantity + 1);
  }

  decrementQuantity(item: CartItem): void {
     if (item.quantity > 1) {
         this.updateQuantity(item, item.quantity - 1);
     } else {
         this.removeItem(item.bookId); // O mostrar confirmación
     }
  }

  removeItem(bookId: string): void {
    // Podrías añadir una confirmación aquí
    this.cartService.removeItem(bookId);
  }

  clearCart(): void {
    // Podrías añadir una confirmación aquí
    this.cartService.clearCart();
  }
  
  // Generar array para el selector de cantidad (ej. 1 a 10)
  getQuantityOptions(currentQuantity: number = 0): number[] {
    const maxQuantity = Math.max(10, currentQuantity + 5); // Mostrar hasta 10 o la cantidad actual + 5
    return Array.from({ length: maxQuantity }, (_, i) => i + 1);
  }
}
