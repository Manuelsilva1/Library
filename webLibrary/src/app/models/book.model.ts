export interface Book {
  id: number; // Changed from string to number to match backend Long
  title: string;
  author: string;
  coverImageUrl: string;
  price: number;
  currency?: string; // ej. 'USD', 'EUR'
  shortDescription?: string;
  category?: string; 
  publisher?: string;
  publishDate?: string; // o Date
  pages?: number;
  isbn?: string;
  language?: string;
  additionalImageUrls?: string[];
  stock?: number; // Campo para el stock
  // Podrías añadir más campos como rating, ISBN, etc.
}
