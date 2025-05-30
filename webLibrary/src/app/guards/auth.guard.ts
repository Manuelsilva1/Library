import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ajusta la ruta si es necesario
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1), // Tomar el primer valor emitido y completar
    map(isAuthenticated => {
      if (isAuthenticated) {
        if (authService.hasRole('ROLE_ADMIN')) {
          return true;
        } else {
          // Usuario autenticado pero no es ADMIN.
          // Redirigir a una página principal o a una de acceso denegado.
          console.warn('AuthGuard: User is authenticated but does not have ROLE_ADMIN.');
          router.navigate(['/']); // Redirigir a la página principal
          return false;
        }
      } else {
        // Usuario no autenticado. Redirigir a la página de login.
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};
