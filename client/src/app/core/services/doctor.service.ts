import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  getDoctors(
    filters: DoctorFilters = {},
  ): Observable<PaginatedResponse<DoctorUser>> {
    let params = new HttpParams().set('role', 'doctor');

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<PaginatedResponse<DoctorUser>>(this.apiUrl, {
      params,
    });
  }

  getDoctorById(id: string): Observable<ApiResponse<{ user: DoctorUser }>> {
    return this.http.get<ApiResponse<{ user: DoctorUser }>>(
      `${this.apiUrl}/${id}`,
    );
  }

  createDoctor(
    payload: CreateDoctorPayload,
  ): Observable<ApiResponse<{ user: DoctorUser }>> {
    return this.http.post<ApiResponse<{ user: DoctorUser }>>(
      this.apiUrl,
      payload,
    );
  }

  updateDoctor(
    id: string,
    payload: UpdateDoctorPayload,
  ): Observable<ApiResponse<{ user: DoctorUser }>> {
    return this.http.put<ApiResponse<{ user: DoctorUser }>>(
      `${this.apiUrl}/${id}`,
      payload,
    );
  }

  deleteDoctor(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
