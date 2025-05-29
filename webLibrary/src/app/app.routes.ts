import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      {
        path: 'extra',
        loadChildren: () =>
          import('./pages/extra/extra.routes').then((m) => m.ExtraRoutes),
      },
      {
        path: 'catalogo',
        loadComponent: () => 
          import('./pages/book-catalog/book-catalog.component').then(m => m.BookCatalogComponent),
        data: { title: 'Catálogo' }
      },
      {
        path: 'libro/:id', // :id es un parámetro de ruta
        loadComponent: () => 
          import('./pages/book-detail/book-detail.component').then(m => m.BookDetailComponent),
        data: { title: 'Detalles del Libro' }
      },
      {
        path: 'carrito',
        loadComponent: () => 
          import('./pages/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent),
        data: { title: 'Carrito de Compras' }
      },
      {
        path: 'checkout',
        loadComponent: () => 
          import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
        data: { title: 'Finalizar Compra' }
        // Considerar añadir un `CanActivate` guard si el carrito está vacío o el usuario no está logueado (futuro)
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => 
      import('./pages/authentication/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Iniciar Sesión' }
  },
  {
    path: 'registro',
    loadComponent: () => 
      import('./pages/authentication/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'Crear Cuenta' }
  },
  // Mantener el BlankComponent para otras rutas si es necesario, o eliminar si ya no se usa.
  // Por ahora lo comentaré para evitar conflictos si 'authentication/error' se elimina.
  // {
  //   path: '',
  //   component: BlankComponent,
  //   children: [
  //     // Aquí podrían ir otras rutas que usen BlankComponent, como 'forgot-password', etc.
  //   ],
  // },
  {
    path: '**', // Redirigir rutas no encontradas al dashboard o a una página de error general
    redirectTo: '/dashboard', // O crea una página de error genérica si prefieres
  },
];
