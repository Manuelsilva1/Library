import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BrandingComponent } from '../sidebar/branding.component';
import { CartService } from 'src/app/services/cart.service'; // Ajusta ruta
import { AuthService } from 'src/app/services/auth.service'; // Ajusta ruta
import { User } from 'src/app/models/user.model'; // Ajusta ruta
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    CommonModule,
    NgScrollbarModule,
    TablerIconsModule,
    MaterialModule,
    BrandingComponent
  ],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit { // Implementar OnInit
  @Input() showToggle = false;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();

  totalCartItems$: Observable<number>;
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>; // Añadir isAuthenticated$

  constructor(
    private cartService: CartService,
    public authService: AuthService // Hacerlo público para usar en template o obtener currentUser$
    // private router: Router // Router no es necesario aquí si AuthService maneja la redirección
  ) {
    this.totalCartItems$ = this.cartService.totalItems$; // Use the new totalItems$ observable
    this.currentUser$ = this.authService.currentUser$;
    this.isAuthenticated$ = this.authService.isAuthenticated$; // Inicializar isAuthenticated$
  }

  ngOnInit(): void {
    // No es necesario reasignar aquí si se hace en el constructor
  }

  logout(): void {
    this.authService.logout();
  }
}