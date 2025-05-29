import { Component, OnInit, OnDestroy } from '@angular/core'; // Import OnDestroy
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import Router
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service'; // Use new CartItem
import { OrderService, CreateOrderRequest, OrderItemRequest } from '../../services/order.service'; // Import OrderService and DTOs
import { Observable, Subscription } from 'rxjs'; // Import Subscription
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
// import { Cart } from '../../models/cart.model'; // Old Cart model likely not needed

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialModule,
    TablerIconsModule
  ]
})
export class CheckoutComponent implements OnInit, OnDestroy {
  checkoutForm: FormGroup;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  private cartSubscription: Subscription | undefined;

  // Mocked shipping/payment methods removed for brevity, can be added back if needed for UI
  // For this task, focus is on order creation with shipping address from form.

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.checkoutForm = this.fb.group({
      // Fields matching CreateOrderRequestDto
      shippingAddressLine1: ['', Validators.required],
      shippingAddressLine2: [''], // Optional
      shippingCity: ['', Validators.required],
      shippingPostalCode: ['', Validators.required],
      shippingCountry: ['', Validators.required],
      // Other fields like fullName, phone, stateProvince from old form can be added if backend DTO supports them
    });
  }

  ngOnInit(): void {
    this.cartSubscription = new Subscription();

    this.cartSubscription.add(
      this.cartService.items$.subscribe(items => {
        this.cartItems = items;
        if (items.length === 0 && !this.isLoading) { // Don't redirect if an order is in progress
          // Consider showing a message on page instead of immediate redirect,
          // or redirecting only if form hasn't been touched.
          // For now, simple redirect if cart becomes empty.
          // this.router.navigate(['/catalogo']); 
          console.log("Cart is empty, consider redirecting or showing message.");
        }
      })
    );

    this.cartSubscription.add(
      this.cartService.totalPrice$.subscribe(price => {
        this.totalPrice = price;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.errorMessage = "Por favor, completa todos los campos de envío requeridos.";
      return;
    }
    if (this.cartItems.length === 0) {
      this.errorMessage = "Tu carrito está vacío. Añade algunos productos antes de proceder.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const orderItemsRequest: OrderItemRequest[] = this.cartItems.map(item => ({
      bookId: item.book.id,
      quantity: item.quantity
    }));

    const orderRequest: CreateOrderRequest = {
      ...this.checkoutForm.value,
      items: orderItemsRequest
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (createdOrder) => {
        this.isLoading = false;
        this.cartService.clearCart();
        // Navigate to an order confirmation page or user's order list
        // For now, navigating to a placeholder route or home
        this.router.navigate(['/order-confirmation', createdOrder.id]); // Assuming an order confirmation page
        console.log('Order created successfully:', createdOrder);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Hubo un error al procesar tu pedido. Inténtalo de nuevo.';
        console.error('Order creation error:', err);
      }
    });
  }
}
