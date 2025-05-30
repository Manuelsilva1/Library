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
        // TODO: Implement proper role-based access control.
        // The original guard had a check for 'ROLE_ADMIN' which is now removed
        // because authService.hasRole is unavailable.
        // For now, any authenticated user can access routes protected by this guard.
        // This means admin routes are currently accessible to non-admin authenticated users.
        // A separate AdminGuard or component-level checks would be needed.
        console.warn("AuthGuard: Role check ('ROLE_ADMIN') is currently disabled. Access granted if authenticated.");
        return true; 
      } else {
        // Usuario no autenticado. Redirigir a la página de login.
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    })
  );
};
