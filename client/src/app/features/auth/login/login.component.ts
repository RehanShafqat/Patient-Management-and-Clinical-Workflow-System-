// src/app/features/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {

    loginForm: FormGroup;
    isLoading = false;
    errorMessage = '';
    showPassword = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        // Redirect if already logged in
        if (this.authService.isLoggedIn()) {
            this.authService.redirectToDashboard();
        }

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
        });
    }

    // Shortcut to access form fields easily in the template
    get email() { return this.loginForm.get('email')!; }
    get password() { return this.loginForm.get('password')!; }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.authService.login(this.loginForm.value).subscribe({
            next: () => {
                this.isLoading = false;
                // Redirect to correct dashboard based on role
                this.authService.redirectToDashboard();
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.message || 'Invalid email or password.';
            }
        });
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }
}