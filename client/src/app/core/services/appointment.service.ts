import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  Appointment,
  AppointmentFilters,
  CreateAppointmentPayload,
  CreateAppointmentResponse,
  PaginatedResponse,
  UpdateAppointmentPayload,
} from '../models/appointment.model';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/appointments`;

  //INFO: Fetch paginated and filtered appointments
  getAppointments(
    filters: AppointmentFilters = {},
  ): Observable<PaginatedResponse<Appointment>> {
    let params = new HttpParams();

    // Map filters to HttpParams
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Appointment>>(this.apiUrl, {
      params,
    });
  }

  //INFO: Fetch a single appointment by ID
  getAppointmentById(
    id: string,
  ): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(
      `${this.apiUrl}/${id}`,
    );
  }

  //INFO: Create a new appointment
  createAppointment(
    payload: CreateAppointmentPayload,
  ): Observable<ApiResponse<CreateAppointmentResponse>> {
    return this.http.post<ApiResponse<CreateAppointmentResponse>>(
      this.apiUrl,
      payload,
    );
  }

  //INFO: Update an existing appointment
  updateAppointment(
    id: string,
    payload: UpdateAppointmentPayload,
  ): Observable<ApiResponse<{ appointment: Appointment }>> {
    return this.http.patch<ApiResponse<{ appointment: Appointment }>>(
      `${this.apiUrl}/${id}`,
      payload,
    );
  }

  //INFO: Cancel an appointment
  cancelAppointment(id: string): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.apiUrl}/${id}/cancel`,
      {},
    );
  }

  //INFO: Delete an appointment (soft delete handled by backend)
  deleteAppointment(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
