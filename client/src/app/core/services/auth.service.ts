import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  AuthUser,
  LogoutResponse,
} from '../models/auth.model';

import { ApiResponse } from '../interceptors/api-response.interceptor';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  private apiUrl = environment.apiUrl;
  
  // BehaviorSubject: Emits current and new user values to subscribers
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  
  // asObservable() - Makes it read-only (components can't call .next() - only AuthService controls user state changes)
  currentUser$ = this.currentUserSubject.asObservable();

  // Runs on app initialization via provideAppInitializer in app.config
  checkAuthOnInit(): Observable<void> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/auth/me`).pipe(
      // tap: Performs side effects (logging, updating state) without changing the value
      tap((response) => {
        const user = response?.data.user;
        console.log("user", user);

        // Update BehaviorSubject - emits new value to all subscribers (currentUser$)
        this.currentUserSubject.next(user ?? null);
      }),
      // map: Transforms the response to void (required by Observable<void> return type)
      map(() => void 0),
      // catchError: Catches errors and returns fallback Observable
      catchError(() => {
        this.currentUserSubject.next(null);
        return of(void 0);
      }),
    );
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.http
      .post<
        ApiResponse<LoginResponse>
      >(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.currentUserSubject.next(response.data?.user ?? null);
        }),
      );
  }

  logout(): Observable<LogoutResponse> {
    // withCredentials: true sends HTTP cookies with the request
    // Allows backend to identify user via session cookies and clear auth tokens
    return this.http
      .post<LogoutResponse>(
        `${this.apiUrl}/auth/logout`,
        {},
        { withCredentials: true },
      )
      .pipe(tap(() => this.currentUserSubject.next(null)));
  }

  //  Helper functions

  // uses ! (non-null assertion) to tell TypeScript "this won't be null here"
  getCurrentUser(): AuthUser {
    return this.currentUserSubject.value!;
  }

  // Uses !! to convert user object to strict boolean (true if logged in, false if not)
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
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
    console.log("User role:", this.currentUserSubject.value?.role);

    const role = this.getCurrentUser()?.role;
    if (role === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'doctor') this.router.navigate(['/doctor/dashboard']);
    else if (role === 'fdo') this.router.navigate(['/fdo/dashboard']);
  }
}
