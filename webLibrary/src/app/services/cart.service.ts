import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { Cart, CartItem } from '../models/cart.model';

const CART_STORAGE_KEY = 'libreria33_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>(this.loadInitialCart());
  public cart$: Observable<Cart> = this.cartSubject.asObservable();

  constructor() { }

  private loadInitialCart(): Cart {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart) as Cart;
        // Validar estructura básica
        if (parsedCart && Array.isArray(parsedCart.items)) {
           return parsedCart;
        }
      } catch (e) {
        console.error("Error parsing cart from localStorage", e);
        localStorage.removeItem(CART_STORAGE_KEY); // Limpiar si está corrupto
      }
    }
    return { items: [], totalItems: 0, subtotal: 0 };
  }

  private saveCart(cart: Cart): void {
    this.cartSubject.next(cart);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  private calculateCartTotals(items: CartItem[]): { totalItems: number; subtotal: number } {
    let totalItems = 0;
    let subtotal = 0;
    for (const item of items) {
      totalItems += item.quantity;
      subtotal += item.quantity * item.unitPrice;
    }
    return { totalItems, subtotal: parseFloat(subtotal.toFixed(2)) };
  }

  addItem(book: Book, quantity: number = 1): void {
    const currentCart = this.cartSubject.getValue();
    const existingItemIndex = currentCart.items.findIndex(item => item.bookId === book.id);

    let updatedItems: CartItem[];

    if (existingItemIndex > -1) {
      // Actualizar cantidad si el item ya existe
      updatedItems = currentCart.items.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
      );
    } else {
      // Añadir nuevo item
      const newItem: CartItem = {
        bookId: book.id,
        title: book.title,
        author: book.author,
        coverImageUrl: book.coverImageUrl,
        unitPrice: book.price,
        quantity: quantity,
        productUrl: `/libro/${book.id}` // Enlace al detalle del libro
      };
      updatedItems = [...currentCart.items, newItem];
    }
    
    const { totalItems, subtotal } = this.calculateCartTotals(updatedItems);
    this.saveCart({ items: updatedItems, totalItems, subtotal });
  }

  updateItemQuantity(bookId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(bookId);
      return;
    }
    const currentCart = this.cartSubject.getValue();
    const updatedItems = currentCart.items.map(item =>
      item.bookId === bookId ? { ...item, quantity: newQuantity } : item
    );
    const { totalItems, subtotal } = this.calculateCartTotals(updatedItems);
    this.saveCart({ items: updatedItems, totalItems, subtotal });
  }

  removeItem(bookId: string): void {
    const currentCart = this.cartSubject.getValue();
    const updatedItems = currentCart.items.filter(item => item.bookId !== bookId);
    const { totalItems, subtotal } = this.calculateCartTotals(updatedItems);
    this.saveCart({ items: updatedItems, totalItems, subtotal });
  }

  clearCart(): void {
    this.saveCart({ items: [], totalItems: 0, subtotal: 0 });
  }

  // Selector para el número total de ítems (para el badge del header)
  getTotalItems(): Observable<number> {
     return this.cart$.pipe(map(cart => cart.totalItems));
  }
}
