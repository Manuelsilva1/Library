import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { OrderService, OrderResponse } from '../../../services/order.service'; // Ajusta la ruta si es necesario
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
    this.orders$ = this.orderService.getUserOrders().pipe(
      catchError(err => {
        this.errorMessage = err.message || 'Error al cargar los pedidos.';
        console.error('Error fetching orders:', err);
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
