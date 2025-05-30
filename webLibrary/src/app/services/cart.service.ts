import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// map operator is not used directly in this refactored version for public observables,
// but could be useful for derived observables if needed later.
// import { map } from 'rxjs/operators';
import { Book } from '../models/book.model';

// Define Interfaces as per Step 2
export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Cart { // This interface is for internal consistency if needed, but not directly exposed.
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartKey = 'libreria33_cart'; // Step 3

  // Step 3: BehaviorSubjects
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);
  private totalPriceSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);

  // Step 3: Public Observables
  public items$: Observable<CartItem[]> = this.itemsSubject.asObservable();
  public totalPrice$: Observable<number> = this.totalPriceSubject.asObservable();
  public totalItems$: Observable<number> = this.totalItemsSubject.asObservable();

  constructor() { // Step 4
    this.loadCartFromStorage();
  }

  // Step 5: Method loadCartFromStorage()
  private loadCartFromStorage(): void {
    const storedCartItems = localStorage.getItem(this.cartKey);
    if (storedCartItems) {
      try {
        const items = JSON.parse(storedCartItems) as CartItem[];
        // Basic validation: ensure it's an array, and items have book and quantity
        if (Array.isArray(items) && items.every(item => item.book && typeof item.quantity === 'number')) {
          this.itemsSubject.next(items);
          this.updateCartState(); // Calculate totals based on loaded items
        } else {
          localStorage.removeItem(this.cartKey); // Clear corrupted data
        }
      } catch (e) {
        console.error("Error parsing cart items from localStorage", e);
        localStorage.removeItem(this.cartKey); // Clear if corrupted
      }
    }
  }

  // Step 6: Method saveCartToStorage()
  private saveCartToStorage(): void {
    localStorage.setItem(this.cartKey, JSON.stringify(this.itemsSubject.value));
  }

  // Step 7: Method updateCartState() (private)
  private updateCartState(): void {
    const currentItems = this.itemsSubject.value;
    let totalItems = 0;
    let totalPrice = 0;

    for (const item of currentItems) {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.book.price; // Assuming book.price exists
    }

    this.totalItemsSubject.next(totalItems);
    this.totalPriceSubject.next(parseFloat(totalPrice.toFixed(2)));
    this.saveCartToStorage();
  }

  // Step 8: Method addItem(book: Book, quantity: number = 1)
  public addItem(book: Book, quantity: number = 1): void {
    if (!book || quantity <= 0) return;

    const currentItems = [...this.itemsSubject.value];
    const existingItemIndex = currentItems.findIndex(item => item.book.id === book.id);
    const stock = book.stock !== undefined ? book.stock : Infinity; // Assume infinite stock if not defined

    if (existingItemIndex > -1) {
      const existingItem = currentItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      // Do not add more than available stock
      currentItems[existingItemIndex].quantity = Math.min(newQuantity, stock);
    } else {
       // Add new item, ensuring quantity does not exceed stock
      currentItems.push({ book, quantity: Math.min(quantity, stock) });
    }
    this.itemsSubject.next(currentItems);
    this.updateCartState();
  }

  // Step 9: Method updateItemQuantity(bookId: number, newQuantity: number)
  public updateItemQuantity(bookId: number, newQuantity: number): void {
    const currentItems = [...this.itemsSubject.value];
    const itemIndex = currentItems.findIndex(item => item.book.id === bookId);

    if (itemIndex === -1) return; // Item not found

    if (newQuantity <= 0) {
      this.removeItem(bookId);
    } else {
      const item = currentItems[itemIndex];
      const stock = item.book.stock !== undefined ? item.book.stock : Infinity;
      // Update quantity, ensuring it does not exceed stock
      currentItems[itemIndex] = { ...item, quantity: Math.min(newQuantity, stock) };
      this.itemsSubject.next(currentItems);
      this.updateCartState();
    }
  }

  // Step 10: Method removeItem(bookId: number)
  public removeItem(bookId: number): void {
    const currentItems = this.itemsSubject.value;
    const filteredItems = currentItems.filter(item => item.book.id !== bookId);
    this.itemsSubject.next(filteredItems);
    this.updateCartState();
  }

  // Step 11: Method clearCart()
  public clearCart(): void {
    this.itemsSubject.next([]);
    this.updateCartState(); // This will also save the empty cart to storage
  }

  // Step 12: (Optional) Method getItem(bookId: number)
  public getItem(bookId: number): CartItem | undefined {
    return this.itemsSubject.value.find(item => item.book.id === bookId);
  }
}
