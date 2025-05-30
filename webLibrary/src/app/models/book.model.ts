export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  price: number;
  stock?: number;
  category?: string;
  
  // Existing UI-specific fields (can remain optional)
  coverImageUrl?: string;
  currency?: string; 
  shortDescription?: string;
  publisher?: string;
  publishDate?: string; // or Date
  pages?: number;
  language?: string;
  additionalImageUrls?: string[];
}
