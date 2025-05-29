import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model'; // Ajusta ruta
import { Router } from '@angular/router'; // Para redireccionar
import { environment } from '../../environments/environment'; // Importar environment

// Define DTOs that match backend expectations (optional but good practice)
export interface UserLoginDto {
  email: string;
  password?: string; // Password might not always be part of User model for security
}

export interface UserRegistrationDto {
  fullName: string;
  email: string;
  password?: string;
}

// Interface for the expected userInfo structure within AuthResponseDto
// This matches the UserInfoDto from backend, and compatible with Angular's User model
interface UserInfoWithRoles {
  id?: any;
  email: string;
  fullName?: string;
  roles?: string[];
}

// Matches Backend's AuthResponseDto
export interface AuthResponseDto {
  message: string;
  userInfo: UserInfoWithRoles; // Use the interface that includes roles
  token: string;
}

const AUTH_USER_STORAGE_KEY = 'libreria33_auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`; // Usar environment.apiUrl

  private currentUserSubject = new BehaviorSubject<User | null>(this.loadInitialUser());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map(user => !!user && !!user.token));

  constructor(private http: HttpClient, private router: Router) { }

  private loadInitialUser(): User | null {
    const storedUser = localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        // Optionally, validate token presence or expiry here
        if (user && user.token) {
          return user;
        }
      } catch (e) {
        console.error("Error parsing stored user", e);
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
    }
    return null;
  }

  private saveUser(user: User | null, token?: string): void {
    if (user) {
      if (token) { // If a new token is provided, add/update it on the user object
        user.token = token;
      }
      this.currentUserSubject.next(user);
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      this.currentUserSubject.next(null);
      localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    }
  }

  login(credentials: UserLoginDto): Observable<User> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Assuming response.userInfo is compatible with Angular's User model
        // and response.token contains the JWT token.
        const userToSave: User = {
          ...response.userInfo, // Spread properties from userInfo
          token: response.token // Add token to the user object
        };
        this.saveUser(userToSave);
      }),
      map(response => response.userInfo), // Return the user part for component consumption
      catchError((error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        // Handle specific error messages from backend if available
        return throwError(() => new Error(error.error?.message || 'Login failed. Please check your credentials.'));
      })
    );
  }

  register(userData: UserRegistrationDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
      tap(registeredUser => {
        // Backend currently returns the created User object directly (without token)
        // User will need to login after registration to get a token
        console.log('Registration successful for:', registeredUser.email);
        // Optionally, you could auto-login here by calling this.login()
        // or just inform the user to log in.
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Registration failed:', error);
        return throwError(() => new Error(error.error?.message || 'Registration failed. Please try again.'));
      })
    );
  }

  logout(): void {
    this.saveUser(null); // Clears user and token
    this.router.navigate(['/login']);
  }

  // Helper to get current user value
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public hasRole(role: string): boolean {
    const currentUser = this.currentUserValue;
    return !!(currentUser && currentUser.roles && currentUser.roles.includes(role));
  }
}
