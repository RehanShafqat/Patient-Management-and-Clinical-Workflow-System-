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
import { Observable, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/patients`;
  private patientsCache = new Map<
    string,
    Observable<PaginatedResponse<Patient>>
  >();

  private clearPatientsCache(): void {
    this.patientsCache.clear();
  }

  //INFO: Fetch paginated and filtered patients
  getPatients(
    filters: PatientFilters = {},
  ): Observable<PaginatedResponse<Patient>> {
    let params = new HttpParams();

    // Map filters to HttpParams
    Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });

    const cacheKey = params.toString();
    const cached = this.patientsCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const request$ = this.http
      .get<PaginatedResponse<Patient>>(this.apiUrl, { params })
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.patientsCache.set(cacheKey, request$);

    return request$;
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
    return this.http
      .post<ApiResponse<CreatePatientResponse>>(this.apiUrl, payload)
      .pipe(tap(() => this.clearPatientsCache()));
  }

  //INFO: Update an existing patient
  updatePatient(
    id: string,
    payload: UpdatePatientPayload,
  ): Observable<ApiResponse<{ patient: Patient }>> {
    return this.http
      .put<ApiResponse<{ patient: Patient }>>(`${this.apiUrl}/${id}`, payload)
      .pipe(tap(() => this.clearPatientsCache()));
  }

  //INFO: Delete a patient (soft delete handled by backend)
  deletePatient(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.clearPatientsCache()));
  }
}
