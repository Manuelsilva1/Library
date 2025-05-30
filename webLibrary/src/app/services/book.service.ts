import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs'; // Added of
import { catchError } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { BookPage } from '../models/book-page.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/books`; // Base URL for books endpoint

  constructor(private http: HttpClient) { }

  getBooks(filters: any = {}, page: number = 0, size: number = 20): Observable<BookPage> {
    let params = new HttpParams()
      .set('page', page.toString()) // page is 0-indexed
      .set('size', size.toString());

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value).trim() !== '') {
          if (['title', 'author', 'category', 'minPrice', 'maxPrice'].includes(key)) {
            params = params.append(key, String(value));
          }
        }
      });
    }

    return this.http.get<BookPage>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createBook(bookData: Partial<Book>): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, bookData).pipe(
      catchError(this.handleError)
    );
  }

  updateBook(id: number, bookData: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, bookData).pipe(
      catchError(this.handleError)
    );
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
  
  getCategories(): Observable<string[]> {
    // Original line (backend endpoint doesn't exist yet):
    // return this.http.get<string[]>(`${environment.apiUrl}/categories`).pipe(catchError(this.handleError));
    console.warn('BookService.getCategories: Mocking with empty array as backend endpoint is not implemented.');
    return of([]); // Return empty array for now
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.error && error.error.message) {
        errorMessage = `Error ${error.status}: ${error.error.message}`;
        if (error.error.errors && Array.isArray(error.error.errors)) {
          errorMessage += ` Details: ${error.error.errors.join(', ')}`;
        }
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('API Error:', error);
    console.error('Error Message:', errorMessage);
    return throwError(() => new Error('Something bad happened; please try again later. Details: ' + errorMessage));
  }
}
