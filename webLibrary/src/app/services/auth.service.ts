import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { User } from '../models/user.model'; // Ensure this model can store token and basic info
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
// ApiError model might be useful for typing errors if not handled globally by an interceptor
// import { ApiError } from '../models/api-error.model'; 

const AUTH_TOKEN_KEY = 'authToken'; // Key for storing only the token

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // currentUserSubject can store a minimal User object (e.g., username/email and token)
  // or null if not logged in.
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadInitialUser());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  public isAuthenticated$: Observable<boolean> = this.currentUser$.pipe(map(user => !!user && !!user.token));

  constructor(private http: HttpClient, private router: Router) { }

  private loadInitialUser(): User | null {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      // At this stage, we don't have full user details from just the token.
      // We could decode the token to get username/email if it's stored there (not standard for JWT payload directly)
      // Or, we can have a /me endpoint to fetch user details if token is valid.
      // For now, create a minimal User object.
      // Let's assume for simplicity, we don't store username in token for this app, or decode it here.
      // The app will rely on components to fetch full user details if needed, or AuthService would need a /me call.
      // For currentUserSubject, we'll store a User object with just the token.
      // If User model requires email, and we don't have it, this approach needs adjustment.
      // Assuming User model can handle potentially undefined email/roles if only token is known.
      const minimalUser: User = { token: token }; // User model might need to allow optional fields
      // If User requires an email/id, this would be:
      // const minimalUser: User = { id: 0, email: 'unknown', token: token }; // Placeholder
      return minimalUser;
    }
    return null;
  }

  // saveAuthToken stores only the token and updates currentUserSubject with minimal user info
  private saveAuthToken(token: string | null, username?: string): void {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      // Create a minimal User object for currentUserSubject
      // Assuming username is available (e.g. from login credentials)
      const userForSubject: User = { token: token };
      if (username) {
        // Assuming User model has an email field that can store the username
        // And other fields are optional or not set at this point.
        userForSubject.email = username; 
      }
      this.currentUserSubject.next(userForSubject);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      this.currentUserSubject.next(null);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.saveAuthToken(response.token, credentials.username);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Login failed:', error);
        this.saveAuthToken(null); // Clear token on login failure
        // Attempt to use ApiError structure from backend
        const apiErrorMessage = error.error?.message || (Array.isArray(error.error?.errors) ? error.error.errors.join(', ') : 'Login failed.');
        return throwError(() => new Error(apiErrorMessage));
      })
    );
  }

  logout(): void {
    this.saveAuthToken(null); // Clears token and user subject
    this.router.navigate(['/auth/login']); // Redirect to login page
  }

  public getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  // isAuthenticated can be simplified if isAuthenticated$ is used primarily
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // currentUserValue can return the minimal User object (token, possibly username)
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // hasRole would require roles to be in the User object, which they aren't with this simplified login.
  // This method would either always return false, or User object needs to be populated from a /me endpoint.
  // For now, commenting out as it's not reliably usable.
  /*
  public hasRole(role: string): boolean {
    const currentUser = this.currentUserValue;
    // return !!(currentUser && currentUser.roles && currentUser.roles.includes(role));
    return false; // Or fetch roles from a /me endpoint after login
  }
  */

  // register method can be added later if needed, ensuring it uses correct DTOs.
  // For now, removing the old register method.
}
