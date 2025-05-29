import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { map, delay, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model'; // Ajusta ruta
import { Router } from '@angular/router'; // Para redireccionar

const AUTH_USER_STORAGE_KEY = 'libreria33_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadInitialUser());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map(user => !!user));

  constructor(private router: Router) { }

  private loadInitialUser(): User | null {
    const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser) as User;
      } catch (e) {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
    }
    return null;
  }

  private saveUser(user: User | null): void {
    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      this.currentUserSubject.next(null);
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  }

  // Simulación de Login
  login(email: string, password_todo_remove: string): Observable<User> {
    // En una app real, aquí llamarías a tu API de backend
    // Por ahora, simulamos con un usuario mock si el email es "test@example.com"
    if (email.toLowerCase() === 'test@example.com') {
      const mockUser: User = { id: 'user123', email: email, fullName: 'Usuario de Prueba' };
      return of(mockUser).pipe(
        delay(1000), // Simular retraso de red
        tap(user => this.saveUser(user))
      );
    }
    return throwError(() => new Error('Credenciales inválidas (simulado)'));
  }

  // Simulación de Registro
  register(fullName: string, email: string, password_todo_remove: string): Observable<User> {
    // En una app real, llamarías a tu API.
    // Simulamos creación de nuevo usuario.
    console.log(`Registrando: ${fullName}, ${email}`);
    const newUser: User = { id: `user-${Date.now()}`, email: email, fullName: fullName };
    return of(newUser).pipe(
      delay(1500),
      tap(user => {
        // Podrías auto-loguear al usuario después del registro
        // this.saveUser(user); 
        console.log('Usuario registrado (simulado), por favor inicie sesión.');
      })
    );
  }

  logout(): void {
    this.saveUser(null);
    this.router.navigate(['/login']); // Redirigir a login después de cerrar sesión
  }
}
