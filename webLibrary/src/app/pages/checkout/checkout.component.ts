import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Para formularios reactivos
import { CartService } from '../../services/cart.service'; // Ajusta ruta
import { Cart } from '../../models/cart.model'; // Ajusta ruta
import { Observable } from 'rxjs';
import { MaterialModule } from 'src/app/material.module'; // Para UI (stepper, form-fields, etc.)
import { TablerIconsModule } from 'angular-tabler-icons'; // Para iconos

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule, // Importante para FormGroup
    MaterialModule, 
    TablerIconsModule
  ]
})
export class CheckoutComponent implements OnInit {
  cart$: Observable<Cart>;
  
  shippingForm: FormGroup;
  // paymentForm: FormGroup; // Se podría añadir más adelante para detalles de pago

  // Ejemplo de métodos de envío y pago (solo para UI)
  shippingMethods = [
    { id: 'standard', name: 'Envío Estándar (5-7 días)', price: 5.00 },
    { id: 'express', name: 'Envío Express (1-2 días)', price: 15.00 }
  ];
  selectedShippingMethod = this.shippingMethods[0];

  paymentMethods = [
    { id: 'creditcard', name: 'Tarjeta de Crédito/Débito' },
    { id: 'paypal', name: 'PayPal' },
    // { id: 'transfer', name: 'Transferencia Bancaria' }
  ];
  selectedPaymentMethod = this.paymentMethods[0];

  constructor(
    private cartService: CartService,
    private fb: FormBuilder
  ) {
    this.cart$ = this.cartService.cart$;

    this.shippingForm = this.fb.group({
      fullName: ['', Validators.required],
      addressLine1: ['', Validators.required],
      addressLine2: [''],
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]], // Ejemplo USA, ajustar
      country: ['España', Validators.required], // Valor por defecto
      phone: ['', Validators.required]
    });

    // Inicializar paymentForm si se usa para más detalles
    // this.paymentForm = this.fb.group({
    //   // campos para tarjeta de crédito, etc.
    // });
  }

  ngOnInit(): void { }

  getGrandTotal(cartSubtotal: number): number {
    return cartSubtotal + (this.selectedShippingMethod ? this.selectedShippingMethod.price : 0);
  }

  // Placeholder para la lógica de envío del pedido
  placeOrder(cart: Cart): void {
    if (this.shippingForm.valid) {
      console.log('Pedido realizado (placeholder)');
      console.log('Información de envío:', this.shippingForm.value);
      console.log('Método de envío:', this.selectedShippingMethod);
      console.log('Método de pago:', this.selectedPaymentMethod);
      console.log('Carrito:', cart);
      // Aquí iría la lógica para enviar el pedido al backend
      // y luego, por ejemplo, limpiar el carrito y redirigir a una página de confirmación.
      // this.cartService.clearCart();
      // this.router.navigate(['/confirmacion-pedido']); // Necesitaría inyectar Router
    } else {
      console.log('Formulario de envío no válido');
      this.shippingForm.markAllAsTouched(); // Mostrar errores de validación
    }
  }
}
