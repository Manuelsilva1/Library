import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service'; // OrderService import
import { Subscription } from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

// Import new centralized models
import { OrderRequest, OrderItem } from '../../models'; 
// OrderResponse might be used by OrderService, but component handles its output (e.g. navigating)

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    // Updated form to collect customerName and customerEmail
    this.checkoutForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.cartSubscription = new Subscription();

    this.cartSubscription.add(
      this.cartService.items$.subscribe(items => {
        this.cartItems = items;
        if (items.length === 0 && !this.isLoading) {
          console.log("Cart is empty, consider redirecting or showing message.");
          // Optionally redirect if cart is empty and form not touched/submitted
          // this.router.navigate(['/catalogo']); 
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
      // Updated error message for the new form fields
      this.errorMessage = "Por favor, completa tu nombre y correo electrónico.";
      return;
    }
    if (this.cartItems.length === 0) {
      this.errorMessage = "Tu carrito está vacío. Añade algunos productos antes de proceder.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    // Map cart items to OrderItem[]
    const orderItems: OrderItem[] = this.cartItems.map(item => ({
      bookId: item.book.id, // item.book.id should be a number
      quantity: item.quantity
    }));

    // Get customer details from the form
    const orderDataFromForm = this.checkoutForm.value;

    // Construct the final OrderRequest object
    const finalOrderRequest: OrderRequest = {
      customerName: orderDataFromForm.customerName,
      customerEmail: orderDataFromForm.customerEmail,
      items: orderItems
    };

    this.orderService.createOrder(finalOrderRequest).subscribe({
      next: (createdOrderResponse) => { // OrderService returns OrderResponse
        this.isLoading = false;
        this.cartService.clearCart();
        // Navigate to an order confirmation page or user's order list
        this.router.navigate(['/order-confirmation', createdOrderResponse.orderId]);
        console.log('Order created successfully:', createdOrderResponse);
      },
      error: (err) => {
        this.isLoading = false;
        // Assuming err.message is from the structured ApiError or a fallback
        this.errorMessage = err.message || 'Hubo un error al procesar tu pedido. Inténtalo de nuevo.';
        console.error('Order creation error:', err);
      }
    });
  }
}
