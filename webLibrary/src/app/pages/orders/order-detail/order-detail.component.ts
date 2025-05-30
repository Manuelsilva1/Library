import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // Import DatePipe
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { OrderService } from '../../../services/order.service'; // Corrected: Only OrderService
import { OrderResponse } from '../../../models/order-response.model'; // Corrected: Import from models
import { OrderItem } from '../../../models/order-item.model'; // Corrected: Use OrderItem
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
  order$: Observable<OrderResponse | null>; // This will hold the order details
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
          // TODO: this.orderService.getOrderDetails(this.orderId) does not exist.
          // This component needs a way to fetch a single order's details.
          // For now, commenting out the service call to fix imports.
          // return this.orderService.getOrderDetails(this.orderId).pipe(
          console.warn('OrderService.getOrderDetails does not exist. Mocking with null.');
          this.errorMessage = 'Funcionalidad para ver detalles del pedido no implementada completamente.';
          return of(null).pipe( // Temporarily return null
            catchError(err => {
              this.errorMessage = err.message || 'Error al cargar el detalle del pedido.';
              console.error('Error fetching order details (mocked path):', err);
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
  // item: OrderItem now only has bookId and quantity. priceAtPurchase and bookTitle are missing.
  // This function will cause errors or need significant changes if OrderItem is used directly.
  // For now, returning 0 or commenting out.
  calculateItemTotal(item: OrderItem): number {
    // return item.quantity * item.priceAtPurchase; // priceAtPurchase does not exist on OrderItem
    console.warn("calculateItemTotal: priceAtPurchase not available on OrderItem. Returning 0.");
    return 0; 
  }
}
