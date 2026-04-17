import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import { PaginatedResponse } from '../models/patient.model';
import {
  CreateDoctorPayload,
  DoctorFilters,
  DoctorUser,
  UpdateDoctorPayload,
} from '../models/doctor.model';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;
  private readonly doctorsCache = new Map<
    string,
    Observable<PaginatedResponse<DoctorUser>>
  >();

  private clearDoctorsCache(): void {
    this.doctorsCache.clear();
  }

  getDoctors(
    filters: DoctorFilters = {},
  ): Observable<PaginatedResponse<DoctorUser>> {
    let params = new HttpParams().set('role', 'doctor');

    Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });

    const cacheKey = params.toString();
    const cached = this.doctorsCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const request$ = this.http
      .get<PaginatedResponse<DoctorUser>>(this.apiUrl, {
        params,
      })
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.doctorsCache.set(cacheKey, request$);

    return request$;
  }

  getDoctorById(id: string): Observable<ApiResponse<{ user: DoctorUser }>> {
    return this.http.get<ApiResponse<{ user: DoctorUser }>>(
      `${this.apiUrl}/${id}`,
    );
  }

  createDoctor(
    payload: CreateDoctorPayload,
  ): Observable<ApiResponse<{ user: DoctorUser }>> {
    return this.http
      .post<ApiResponse<{ user: DoctorUser }>>(this.apiUrl, payload)
      .pipe(tap(() => this.clearDoctorsCache()));
  }

  updateDoctor(
    id: string,
    payload: UpdateDoctorPayload,
  ): Observable<ApiResponse<{ user: DoctorUser }>> {
    return this.http
      .put<ApiResponse<{ user: DoctorUser }>>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap(() => this.clearDoctorsCache()));
  }

  deleteDoctor(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.clearDoctorsCache()));
  }
}
