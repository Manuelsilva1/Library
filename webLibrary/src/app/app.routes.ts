import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './guards/auth.guard'; // Importar el authGuard

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
        data: { title: 'Finalizar Compra' },
        canActivate: [authGuard] // Proteger ruta de checkout
      },
      // User Order Routes
      {
        path: 'my-orders',
        loadComponent: () =>
          import('./pages/orders/order-list/order-list.component').then(m => m.OrderListComponent),
        canActivate: [authGuard],
        data: { title: 'Mis Pedidos' }
      },
      {
        path: 'my-orders/:orderId',
        loadComponent: () =>
          import('./pages/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
        canActivate: [authGuard],
        data: { title: 'Detalle del Pedido' }
      },
      {
        path: 'order-confirmation/:orderId', // Placeholder route for now
        loadComponent: () =>
          import('./pages/orders/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent),
        canActivate: [authGuard],
        data: { title: 'Confirmación de Pedido' }
      },
      // Admin Book Routes
      {
        path: 'admin/books',
        loadComponent: () =>
          import('./components/admin/admin-book-list/admin-book-list.component').then(m => m.AdminBookListComponent),
        canActivate: [authGuard], // Aplicar guardia aquí
        data: { title: 'Administrar Libros' }
      },
      {
        path: 'admin/books/new',
        loadComponent: () =>
          import('./components/admin/book-form/book-form.component').then(m => m.BookFormComponent),
        canActivate: [authGuard], // Aplicar guardia aquí
        data: { title: 'Crear Libro' }
      },
      {
        path: 'admin/books/edit/:id',
        loadComponent: () =>
          import('./components/admin/book-form/book-form.component').then(m => m.BookFormComponent),
        canActivate: [authGuard], // Aplicar guardia aquí
        data: { title: 'Editar Libro' }
      }
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
