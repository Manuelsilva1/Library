import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Book } from '../models/book.model'; // Ajusta la ruta si es necesario
import { environment } from '../../environments/environment'; // Importar environment

export interface Filters {
  category?: string;
  author?: string; // Note: Backend might not support all these filters yet
  priceMin?: number; // Backend might not support all these filters yet
  priceMax?: number; // Backend might not support all these filters yet
  searchTerm?: string; // Backend might not support all these filters yet
  // Add other filters as supported by the backend API
}

// Interface for Spring Pageable response
export interface Page<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Current page number (0-indexed)
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = environment.apiUrl; // Usar environment.apiUrl

  constructor(private http: HttpClient) { }

  getBooks(filters: Filters = {}, page: number = 1, pageSize: number = 8): Observable<{ books: Book[], total: number }> {
    let params = new HttpParams()
      .set('page', (page - 1).toString()) // Spring Pageable is 0-indexed
      .set('size', pageSize.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value).trim() !== '') {
          // Ensure all values are converted to string for HttpParams
          params = params.append(key, String(value));
        }
      });
    }

    return this.http.get<Page<Book>>(`${this.apiUrl}/books`, { params }).pipe(
      map(response => {
        return {
          books: response.content,
          total: response.totalElements
        };
      }),
      catchError(this.handleError)
    );
  }

  // CRUD Operations

  createBook(bookData: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(`${this.apiUrl}/books`, bookData).pipe(
      catchError(this.handleError)
    );
  }

  updateBook(id: number, bookData: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/books/${id}`, bookData).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<void> { // Changed to Observable<void> for NO_CONTENT
    return this.http.delete<void>(`${this.apiUrl}/books/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getBookById(id: number): Observable<Book | undefined> { // Changed id type to number
    return this.http.get<Book>(`${this.apiUrl}/books/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && typeof error.error === 'object' && error.error.message) {
        errorMessage += `\nDetails: ${error.error.message}`;
      } else if (typeof error.error === 'string') {
         errorMessage += `\nDetails: ${error.error}`;
      }
    }
    console.error('API Error:', error);
    console.error('Error Message:', errorMessage);
    return throwError(() => new Error('Something bad happened; please try again later. Backend error: ' + errorMessage));
  }
}
