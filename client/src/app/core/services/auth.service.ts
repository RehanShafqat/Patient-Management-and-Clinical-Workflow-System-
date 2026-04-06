import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, AuthUser } from '../models/auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = environment.apiUrl;

    // BehaviorSubject keeps track of current logged-in user across the app
    private currentUserSubject = new BehaviorSubject<AuthUser | null>(
        this.getUserFromStorage()
    );

    // Any component can subscribe to this to know who is logged in
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {}

    // ------------------- Login -------------------------------
    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
            .pipe(
                tap((response) => {
                    // Store token and user in localStorage after successful login
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this.currentUserSubject.next(response.user);
                })
            );
    }

    // ------------------- Logout -------------------------------
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    // ------------------- Create User (Admin only) -------------------------------
    // createUser(data: CreateUserRequest): Observable<any> {
    //     return this.http.post(`${this.apiUrl}/users`, data);
    // }

    // -------------------  Helpers -------------------------------
    getToken(): string | null {
        return localStorage.getItem('token');
    }

    getCurrentUser(): AuthUser | null {
        return this.currentUserSubject.value;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    isAdmin(): boolean {
        return this.getCurrentUser()?.role === 'admin';
    }

    isDoctor(): boolean {
        return this.getCurrentUser()?.role === 'doctor';
    }

    isFdo(): boolean {
        return this.getCurrentUser()?.role === 'fdo';
    }

    // Redirect to correct dashboard based on role
    redirectToDashboard(): void {
        const role = this.getCurrentUser()?.role;
        if (role === 'admin') this.router.navigate(['/admin/dashboard']);
        else if (role === 'doctor') this.router.navigate(['/doctor/dashboard']);
        else if (role === 'fdo') this.router.navigate(['/fdo/dashboard']);
    }

    private getUserFromStorage(): AuthUser | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}