import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { OrderService, OrderResponse, OrderItemResponse } from '../../../services/order.service'; // Ajusta la ruta
import { MaterialModule } from '../../../material.module'; // Para UI
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, MaterialModule, TablerIconsModule, DatePipe] // Add DatePipe here
})
export class OrderDetailComponent implements OnInit {
  order$: Observable<OrderResponse | null>;
  isLoading: boolean = true;
  errorMessage: string | null = null;
  orderId: number | null = null;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.order$ = this.route.paramMap.pipe(
      switchMap(params => {
        const idParam = params.get('orderId');
        if (idParam) {
          this.orderId = +idParam;
          if (isNaN(this.orderId)) {
            this.errorMessage = 'ID de pedido inválido.';
            this.isLoading = false;
            return of(null); // Return null or EMPTY for invalid ID
          }
          return this.orderService.getOrderDetails(this.orderId).pipe(
            catchError(err => {
              this.errorMessage = err.message || 'Error al cargar el detalle del pedido.';
              console.error('Error fetching order details:', err);
              if (err.status === 403 || err.status === 404) { // Specific handling for forbidden/not found
                this.router.navigate(['/my-orders']); // Or a dedicated access-denied page
              }
              return of(null); // Devuelve null en caso de error para que el pipe async no falle
            })
          );
        } else {
          this.errorMessage = 'No se proporcionó ID de pedido.';
          this.isLoading = false;
          return of(null); // No ID, return null
        }
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  goBackToOrders(): void {
    this.router.navigate(['/my-orders']);
  }

  // Helper to calculate total for an item, can be in template too
  calculateItemTotal(item: OrderItemResponse): number {
    return item.quantity * item.priceAtPurchase;
  }
}
