import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import Router
import { CartService, CartItem } from '../../services/cart.service'; // Import new CartItem from service
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
// import { Cart } from '../../models/cart.model'; // Old Cart model likely not needed directly

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule]
})
export class ShoppingCartComponent implements OnInit {
  items$: Observable<CartItem[]>;
  totalPrice$: Observable<number>;
  totalItems$: Observable<number>;

  constructor(
    private cartService: CartService,
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    this.items$ = this.cartService.items$;
    this.totalPrice$ = this.cartService.totalPrice$;
    this.totalItems$ = this.cartService.totalItems$;
  }

  updateQuantity(item: CartItem, newQuantityString: string): void {
    const newQuantity = parseInt(newQuantityString, 10);
    if (!isNaN(newQuantity)) { // Basic validation for input type="number"
        // newQuantity can be 0 or less, service handles removal
        this.cartService.updateItemQuantity(item.book.id, newQuantity);
    }
  }

  incrementQuantity(item: CartItem): void {
    // Consider book.stock if available: item.book.stock
    const currentStock = item.book.stock !== undefined ? item.book.stock : Infinity;
    if (item.quantity < currentStock) {
        this.cartService.updateItemQuantity(item.book.id, item.quantity + 1);
    }
  }

  decrementQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(item.book.id, item.quantity - 1);
    // cartService.updateItemQuantity will handle removal if quantity becomes <= 0
  }

  removeFromCart(item: CartItem): void {
    // Podrías añadir una confirmación aquí
    this.cartService.removeItem(item.book.id);
  }

  clearAllCart(): void { // Renamed to avoid potential template issues if old name was used
    // Podrías añadir una confirmación aquí
    this.cartService.clearCart();
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
    // console.log('Proceeding to checkout...'); // Placeholder
  }

  // getQuantityOptions no es necesario si se usan botones +/- y input numérico directo
}
