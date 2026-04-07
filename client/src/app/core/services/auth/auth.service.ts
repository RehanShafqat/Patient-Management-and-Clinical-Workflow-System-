import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginRequest, LoginResponse, AuthUser } from '../../models/auth.model';
import { ApiResponse } from '../../models';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);

  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // ------------------- Login -------------------------------
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

  // ------------------- Logout -------------------------------
  logout(): void {
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // -------------------  Helpers -------------------------------

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return true;
    // return !!this.getToken();
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
    console.log(this.currentUserSubject.value);

    const role = this.getCurrentUser()?.role;
    if (role === 'admin') this.router.navigate(['/admin/dashboard']);
    else if (role === 'doctor') this.router.navigate(['/doctor/dashboard']);
    else if (role === 'fdo') this.router.navigate(['/fdo/dashboard']);
  }
}
