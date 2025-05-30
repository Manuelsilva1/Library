import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Router para redireccionar
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // Ajusta ruta
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule, TablerIconsModule]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Changed from email to username
      password: ['', Validators.required]
      // rememberMe: [false] // Opcional
    });
  }

  ngOnInit(): void {
     // Check if user is already authenticated based on token presence
     if (this.authService.isAuthenticated()) { // Using isAuthenticated for check
         this.router.navigate(['/']); // Redirigir si ya está logueado
     }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    // The form value will now be {username: '...', password: '...'}
    // which matches the LoginRequest model.
    const credentials = this.loginForm.value; 

    this.authService.login(credentials).subscribe({
      next: (response) => { // Backend returns LoginResponse ({token: string})
        this.isLoading = false;
        this.router.navigate(['/']); // Redirigir a la página principal o a donde sea necesario
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
      }
    });
  }
}
