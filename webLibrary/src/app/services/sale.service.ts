import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { SaleRequest } from '../models/sale-request.model';
import { SaleResponse } from '../models/sale-response.model';
// Potentially import ApiError model for error handling if needed directly
// import { ApiError } from '../models/api-error.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) { }

  createSale(saleData: SaleRequest): Observable<SaleResponse> {
    return this.http.post<SaleResponse>(this.apiUrl, saleData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred in SaleService!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      if (error.error && (error.error.message || error.error.errorMessage)) { // Check for backend's ApiErrorDTO structure
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message || error.error.errorMessage}`;
        if (error.error.errors && Array.isArray(error.error.errors)) {
          errorMessage += `\nDetails: ${error.error.errors.join(', ')}`;
        }
      } else if (typeof error.error === 'string') {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nDetails: ${error.error}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('API Error in SaleService:', error);
    console.error('Formatted Error Message:', errorMessage);
    return throwError(() => new Error('Sale operation failed. Please try again later. Backend error: ' + errorMessage));
  }
}
