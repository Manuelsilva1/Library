export interface Book {
  id: string; // o number
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
  // Podrías añadir más campos como rating, ISBN, etc.
}
