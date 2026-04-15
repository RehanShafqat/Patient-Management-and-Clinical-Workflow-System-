import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  CreatePatientPayload,
  CreatePatientResponse,
  Patient,
} from '../models/patient.model';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/patients`;

  createPatient(
    payload: CreatePatientPayload,
  ): Observable<ApiResponse<CreatePatientResponse>> {
    return this.http.post<ApiResponse<CreatePatientResponse>>(
      this.apiUrl,
      payload,
    );
  }

  getPatients(): Observable<ApiResponse<{ patients: Patient[] }>> {
    return this.http.get<ApiResponse<{ patients: Patient[] }>>(this.apiUrl);
  }
}
