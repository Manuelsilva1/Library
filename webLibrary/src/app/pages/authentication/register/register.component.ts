import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service'; // Ajusta ruta
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./auth.shared.scss'], // Usaremos el mismo SCSS compartido
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MaterialModule, TablerIconsModule]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
      // terms: [false, Validators.requiredTrue] // Opcional
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
     if (this.authService.currentUserSubject.getValue()) {
         this.router.navigate(['/']); // Redirigir si ya está logueado
     }
  }
 
  passwordMatchValidator(form: FormGroup) {
     const password = form.get('password');
     const confirmPassword = form.get('confirmPassword');
     if (password && confirmPassword && password.value !== confirmPassword.value) {
       confirmPassword.setErrors({ mismatch: true });
     } else if (confirmPassword) {
       confirmPassword.setErrors(null);
     }
     return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const { fullName, email, password } = this.registerForm.value;

    this.authService.register(fullName, email, password).subscribe({
      next: (user) => {
        this.isLoading = false;
        this.successMessage = `¡Registro exitoso para ${user.fullName}! Ahora puedes iniciar sesión.`;
        this.registerForm.reset();
        // Opcionalmente, redirigir a login después de un delay
        // setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Error en el registro. Inténtalo de nuevo.';
      }
    });
  }
}
