import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreatePatientPayload,
  CreatePatientResponse,
  PaginatedResponse,
  Patient,
  PatientFilters,
  UpdatePatientPayload,
} from '../models/patient.model';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/patients`;

  //INFO: Fetch paginated and filtered patients
  getPatients(
    filters: PatientFilters = {},
  ): Observable<PaginatedResponse<Patient>> {
    let params = new HttpParams();

    // Map filters to HttpParams
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Patient>>(this.apiUrl, { params });
  }

  //INFO: Fetch a single patient by ID
  getPatientById(id: string): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.get<ApiResponse<{ patient: Patient }>>(
      `${this.apiUrl}/${id}`,
    );
  }

  //INFO: Create a new patient
  createPatient(
    payload: CreatePatientPayload,
  ): Observable<ApiResponse<CreatePatientResponse>> {
    return this.http.post<ApiResponse<CreatePatientResponse>>(
      this.apiUrl,
      payload,
    );
  }

  //INFO: Update an existing patient
  updatePatient(
    id: string,
    payload: UpdatePatientPayload,
  ): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http.put<ApiResponse<{ patient: Patient }>>(
      `${this.apiUrl}/${id}`,
      payload,
    );
  }

  //INFO: Delete a patient (soft delete handled by backend)
  deletePatient(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
