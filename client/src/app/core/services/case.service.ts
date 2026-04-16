import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  Case,
  CaseFilters,
  CreateCasePayload,
  CreateCaseResponse,
  UpdateCasePayload,
} from '../models/case.model';
import { PaginatedResponse } from '../models/patient.model';
import { ApiResponse } from '../interceptors/api-response.interceptor';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cases`;

  getCases(filters: CaseFilters = {}): Observable<PaginatedResponse<Case>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Case>>(this.apiUrl, { params });
  }

  getCaseById(id: string): Observable<ApiResponse<{ case: Case }>> {
    return this.http.get<ApiResponse<{ case: Case }>>(`${this.apiUrl}/${id}`);
  }

  createCase(
    payload: CreateCasePayload
  ): Observable<ApiResponse<CreateCaseResponse>> {
    return this.http.post<ApiResponse<CreateCaseResponse>>(
      this.apiUrl,
      payload
    );
  }

  updateCase(
    id: string,
    payload: UpdateCasePayload
  ): Observable<ApiResponse<{ case: Case }>> {
    return this.http.patch<ApiResponse<{ case: Case }>>(
      `${this.apiUrl}/${id}`,
      payload
    );
  }

  deleteCase(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
