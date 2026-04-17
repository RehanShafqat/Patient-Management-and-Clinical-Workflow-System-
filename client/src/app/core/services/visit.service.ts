import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  UpdateVisitPayload,
  Visit,
  VisitFilters,
} from '../models/visit.model';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisitService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/visits`;

  getVisits(filters: VisitFilters = {}): Observable<PaginatedResponse<Visit>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Visit>>(this.apiUrl, { params });
  }

  getVisitById(id: string): Observable<ApiResponse<Visit>> {
    return this.http.get<ApiResponse<Visit>>(`${this.apiUrl}/${id}`);
  }

  updateVisit(
    id: string,
    payload: UpdateVisitPayload,
  ): Observable<ApiResponse<{ visit: Visit }>> {
    return this.http.patch<ApiResponse<{ visit: Visit }>>(
      `${this.apiUrl}/${id}`,
      payload,
    );
  }

  deleteVisit(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
