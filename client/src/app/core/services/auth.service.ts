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
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  init(): Observable<void> {
    return this.checkAuthOnInit();
  }

  // Check Auth on App Init
  checkAuthOnInit(): Observable<void> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/auth/me`).pipe(
      tap((response) => {
        const apiResponse = response as ApiResponse<any>;
        const user = apiResponse?.data.user;
        this.currentUserSubject.next(user ?? null);
      }),
      map(() => void 0),
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
          this.currentUserSubject.next(response.data?.user!);
        }),
      );
  }

  logout(): Observable<LogoutResponse> {
    return this.http
      .post<LogoutResponse>(
        `${this.apiUrl}/auth/logout`,
        {},
        { withCredentials: true },
      )
      .pipe(tap(() => this.currentUserSubject.next(null)));
  }

  //  Helper functions

  getCurrentUser(): AuthUser {
    return this.currentUserSubject.value!;
  }

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
    console.log(this.currentUserSubject.value?.role);

    const role = this.getCurrentUser()?.role;
    if (role === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'doctor') this.router.navigate(['/doctor/dashboard']);
    else if (role === 'fdo') this.router.navigate(['/fdo/dashboard']);
  }
}
