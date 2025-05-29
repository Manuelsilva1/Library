import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs'; // Import 'delay'
import { map } from 'rxjs/operators';
import { Book } from '../models/book.model'; // Ajusta la ruta si es necesario

export interface Filters {
  category?: string;
  author?: string;
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string; // Para búsqueda general
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private mockBooks: Book[] = [
    // Novedades (ya definidos en starter, podemos copiarlos o crear nuevos)
    { 
      id: '101', title: 'El Misterio del Tiempo Perdido', author: 'Elena Autora', price: 19.99, 
      coverImageUrl: 'assets/images/covers/cover1.jpg', shortDescription: 'Un emocionante thriller sobre viajes en el tiempo. Perfecto para los amantes de la intriga y la ciencia ficción.', 
      category: 'Ciencia Ficción', publisher: 'Ediciones Cronos', publishDate: '2023-03-15', pages: 320, isbn: '978-1234567890', language: 'Español',
      additionalImageUrls: ['assets/images/covers/cover2.jpg', 'assets/images/covers/cover3.jpg']
    },
    { 
      id: '102', title: 'Crónicas de un Futuro Imaginado', author: 'Marcos Escritor', price: 22.50, 
      coverImageUrl: 'assets/images/covers/cover2.jpg', shortDescription: 'Visiones de la sociedad del mañana, explorando tecnologías emergentes y sus impactos.', 
      category: 'Ciencia Ficción', publisher: 'FuturoPress', publishDate: '2022-11-01', pages: 280, isbn: '978-0987654321', language: 'Español' 
    },
    { id: '103', title: 'Recetas para el Alma Curiosa', author: 'Sofía Chef', price: 15.75, coverImageUrl: 'assets/images/covers/cover3.jpg', shortDescription: 'Deliciosas recetas para experimentar.', category: 'Cocina' },
    { id: '104', title: 'Aventuras en la Montaña Nublada', author: 'Carlos Viajero', price: 18.00, coverImageUrl: 'assets/images/covers/cover1.jpg', shortDescription: 'Un viaje épico lleno de peligros.', category: 'Aventura' },
    // Más Vendidos (ya definidos, podemos copiarlos o crear nuevos)
    { 
      id: '201', title: 'El Secreto Mejor Guardado', author: 'Laura BestSeller', price: 25.00, 
      coverImageUrl: 'assets/images/covers/cover2.jpg', shortDescription: 'Un secreto que cambiará todo. Un bestseller internacional.', 
      category: 'Misterio', publisher: 'Misterios S.A.', publishDate: '2021-07-20', pages: 450, isbn: '978-1122334455', language: 'Inglés',
      additionalImageUrls: ['assets/images/covers/cover1.jpg']
    },
    { id: '202', title: 'La Red Invisible que Nos Une', author: 'Pedro Popular', price: 20.99, coverImageUrl: 'assets/images/covers/cover3.jpg', shortDescription: 'Conexiones humanas en la era digital.', category: 'Ensayo' },
    { id: '203', title: 'Guía Práctica para Soñadores', author: 'Ana Soñadora', price: 17.50, coverImageUrl: 'assets/images/covers/cover1.jpg', shortDescription: 'Alcanza tus metas más ambiciosas.', category: 'Autoayuda' },
    { id: '204', title: 'El Jardín de las Palabras Olvidadas', author: 'Luis Lector', price: 21.20, coverImageUrl: 'assets/images/covers/cover2.jpg', shortDescription: 'Un homenaje a la literatura clásica.', category: 'Ficción Literaria' },
    // Libros adicionales para el catálogo
    { id: '301', title: 'Historia Antigua: De Sumeria a Roma', author: 'Dr. Historiador', price: 29.99, coverImageUrl: 'assets/images/covers/cover3.jpg', shortDescription: 'Un recorrido completo por las civilizaciones antiguas.', category: 'Historia' },
    { id: '302', title: 'El Principito Programador', author: 'Antoñita Dev', price: 12.50, coverImageUrl: 'assets/images/covers/cover1.jpg', shortDescription: 'Aprende a programar con el Principito.', category: 'Infantil' },
    { id: '303', title: 'Novela de Amor en Tiempos Modernos', author: 'Romántica Empedernida', price: 16.00, coverImageUrl: 'assets/images/covers/cover2.jpg', shortDescription: 'El amor en el siglo XXI.', category: 'Novela Romántica' },
    { id: '304', title: 'Manual de Supervivencia Zombie', author: 'Max Sobreviviente', price: 13.49, coverImageUrl: 'assets/images/covers/cover3.jpg', shortDescription: 'Todo lo que necesitas saber.', category: 'Humor' },
    { id: '305', title: 'El Arte de la Guerra (Edición Comentada)', author: 'Sun Tzu', price: 10.00, coverImageUrl: 'assets/images/covers/cover1.jpg', shortDescription: 'Estrategia clásica para todos los tiempos.', category: 'Ensayo' },
    { id: '306', title: 'Cuentos para Niños Valientes', author: 'Infantila Autora', price: 9.99, coverImageUrl: 'assets/images/covers/cover2.jpg', shortDescription: 'Historias para inspirar coraje.', category: 'Infantil' },
    { id: '307', title: 'La Conquista del Espacio Profundo', author: 'Astronauta X', price: 24.00, coverImageUrl: 'assets/images/covers/cover3.jpg', shortDescription: 'El futuro de la exploración espacial.', category: 'Ciencia Ficción' },
    { id: '308', title: 'Mitos y Leyendas del Mundo', author: 'Mitólogo Conocido', price: 18.50, coverImageUrl: 'assets/images/covers/cover1.jpg', shortDescription: 'Un compendio de historias fascinantes.', category: 'Historia' }
  ];

  // Simular categorías obtenidas de los libros
  private mockCategories: string[] = [];

  constructor() {
    this.mockCategories = [...new Set(this.mockBooks.map(book => book.category || 'Sin Categoría'))].sort();
  }

  getBooks(filters: Filters = {}, page: number = 1, pageSize: number = 8): Observable<{ books: Book[], total: number }> {
    let filteredBooks = this.mockBooks;

    // Aplicar filtros
    if (filters.category) {
      filteredBooks = filteredBooks.filter(b => b.category === filters.category);
    }
    if (filters.author) {
      filteredBooks = filteredBooks.filter(b => b.author.toLowerCase().includes(filters.author!.toLowerCase()));
    }
    if (filters.priceMin !== undefined) {
      filteredBooks = filteredBooks.filter(b => b.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      filteredBooks = filteredBooks.filter(b => b.price <= filters.priceMax!);
    }
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredBooks = filteredBooks.filter(b => 
        b.title.toLowerCase().includes(term) || 
        b.author.toLowerCase().includes(term) ||
        (b.shortDescription && b.shortDescription.toLowerCase().includes(term))
      );
    }
    
    const total = filteredBooks.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + pageSize);

    return of({ books: paginatedBooks, total }).pipe(delay(300)); // Simular retraso de API
  }

  getBookById(id: string): Observable<Book | undefined> {
    return of(this.mockBooks.find(book => book.id === id)).pipe(delay(100));
  }
  
  getCategories(): Observable<string[]> {
    return of(this.mockCategories).pipe(delay(100));
  }
}
