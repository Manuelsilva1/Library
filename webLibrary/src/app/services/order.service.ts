import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Step 2: Define Interfaces/Tipos

export interface OrderItemRequest {
  bookId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  bookId: number;
  bookTitle: string;
  quantity: number;
  priceAtPurchase: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  orderDate: string; // o Date, pero string es más simple para la deserialización inicial
  totalAmount: number;
  status: string; // Podría ser un enum OrderStatus si se define en el frontend
  shippingAddressLine1: string;
  shippingAddressLine2?: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  items: OrderItemResponse[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`; // Base URL para los pedidos

  constructor(private http: HttpClient) { }

  // Step 3: Implementar Métodos del Servicio

  createOrder(orderData: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, orderData).pipe(
      catchError(this.handleError)
    );
  }

  getUserOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOrderDetails(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${orderId}`).pipe(
      catchError(this.handleError)
    );
  }

  // Step 4: Manejo de Errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      // El backend podría enviar mensajes de error estructurados o simples strings
      if (error.error && error.error.message) {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
      } else if (typeof error.error === 'string' && error.statusText) {
         errorMessage = `Error Code: ${error.status}\nMessage: ${error.statusText}\nDetails: ${error.error}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    console.error('API Error in OrderService:', error);
    console.error('Formatted Error Message:', errorMessage);
    // Devolver un observable con un error que el componente pueda manejar
    return throwError(() => new Error('Something bad happened with the order operation; please try again later. Details: ' + errorMessage));
  }
}
