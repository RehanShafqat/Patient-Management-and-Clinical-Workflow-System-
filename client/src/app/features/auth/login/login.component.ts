import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { LoginRequest } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})

// Implements OnInit interface to enforce ngOnInit lifecycle hook implementation
export class LoginComponent implements OnInit {
  isLoading = false;
  showPassword = false;
  authService = inject(AuthService);

  // FormBuilder creates a reactive form with named controls and built-in validators
  loginForm = new FormBuilder().group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Built-in Angular lifecycle hook - runs after component initialization
  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.authService.redirectToDashboard();
    }
  }
  
  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    // Gets form values (email and password) and casts to LoginRequest interface for type safety
    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: () => {
        this.isLoading = false;
        this.authService.redirectToDashboard();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
