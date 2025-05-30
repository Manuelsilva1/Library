import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { OrderService } from '../../../services/order.service'; // Corrected: Only OrderService
import { OrderResponse } from '../../../models/order-response.model'; // Corrected: Import from models
import { MaterialModule } from '../../../material.module'; // Para UI
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule]
})
export class OrderListComponent implements OnInit {
  orders$: Observable<OrderResponse[]>;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    // TODO: this.orderService.getUserOrders() does not exist.
    // This component needs a way to fetch a list of orders for the current user.
    // For now, commenting out the service call to fix imports.
    // this.orders$ = this.orderService.getUserOrders().pipe(
    console.warn('OrderService.getUserOrders does not exist. Mocking with empty list.');
    this.errorMessage = 'Funcionalidad para ver lista de pedidos no implementada completamente.';
    this.orders$ = of([]).pipe( // Temporarily return empty list
      catchError(err => {
        this.errorMessage = err.message || 'Error al cargar los pedidos.';
        console.error('Error fetching orders (mocked path):', err);
        return of([]); // Devuelve un array vacío en caso de error para que el pipe async no falle
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  viewOrderDetails(orderId: number): void {
    this.router.navigate(['/my-orders', orderId]);
  }
}
