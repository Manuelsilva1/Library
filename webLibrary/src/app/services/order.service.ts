import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Import new models
import { OrderRequest } from '../models/order-request.model';
import { OrderResponse } from '../models/order-response.model';
// Potentially import ApiError model for error handling if needed directly
// import { ApiError } from '../models/api-error.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`; // Base URL for orders

  constructor(private http: HttpClient) { }

  createOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData).pipe(
      catchError(this.handleError)
    );
  }

  // Removed getUserOrders() and getOrderDetails() as they are not currently supported by backend.

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred in OrderService!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      // Try to use the message from backend's ApiErrorDTO if available
      if (error.error && (error.error.message || error.error.errorMessage)) { // Check for backend's ApiErrorDTO structure
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message || error.error.errorMessage}`;
        if (error.error.errors && Array.isArray(error.error.errors)) {
          errorMessage += `\nDetails: ${error.error.errors.join(', ')}`;
        }
      } else if (typeof error.error === 'string') {
        // If the error.error is just a string
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nDetails: ${error.error}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('API Error in OrderService:', error);
    console.error('Formatted Error Message:', errorMessage);
    // Return an observable with a user-facing error message
    return throwError(() => new Error('Order operation failed. Please try again later. Backend error: ' + errorMessage));
  }
}
