import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Ajusta path si es necesario
import { environment } from '../../environments/environment'; // Ajusta path si es necesario

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const currentUser = authService.currentUserValue; // Acceder al valor actual del BehaviorSubject

  // Verificar si la solicitud es para la API y si hay un token
  if (currentUser && currentUser.token && req.url.startsWith(environment.apiUrl)) {
    // Clonar la solicitud para añadir el header de Authorization
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentUser.token}`,
      },
    });
    return next(clonedReq);
  }

  // Si no es para la API o no hay token, pasar la solicitud original
  return next(req);
};
