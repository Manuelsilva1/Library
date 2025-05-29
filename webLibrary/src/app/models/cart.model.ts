import { Book } from './book.model';

export interface CartItem {
  bookId: string; // o number, según tu modelo Book
  title: string;
  author: string;
  coverImageUrl: string;
  unitPrice: number;
  quantity: number;
  // Considera añadir la URL del producto para fácil navegación desde el carrito
  productUrl?: string; 
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  // Podrías añadir descuentos, impuestos, total final, etc. más adelante
}
