import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../interceptors/api-response.interceptor';
import {
  CreateFdoPayload,
  FdoFilters,
  FdoPermissionOption,
  FdoUser,
  PaginatedResponse,
  UpdateFdoPayload,
} from '../models/fdo.model';

@Injectable({
  providedIn: 'root',
})
export class FdoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  getFdos(filters: FdoFilters = {}): Observable<PaginatedResponse<FdoUser>> {
    let params = new HttpParams().set('role', 'fdo');

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    console.log(params.toString());

    return this.http.get<PaginatedResponse<FdoUser>>(this.apiUrl, { params });
  }

  getFdoById(id: string): Observable<ApiResponse<{ user: FdoUser }>> {
    return this.http.get<ApiResponse<{ user: FdoUser }>>(
      `${this.apiUrl}/${id}`,
    );
  }

  getPermissions(): Observable<
    ApiResponse<{ permissions: FdoPermissionOption[] }>
  > {
    return this.http.get<ApiResponse<{ permissions: FdoPermissionOption[] }>>(
      `${this.apiUrl}/permissions`,
    );
  }

  createFdo(
    payload: CreateFdoPayload,
  ): Observable<ApiResponse<{ user: FdoUser }>> {
    return this.http.post<ApiResponse<{ user: FdoUser }>>(this.apiUrl, payload);
  }

  updateFdo(
    id: string,
    payload: UpdateFdoPayload,
  ): Observable<ApiResponse<{ user: FdoUser }>> {
    return this.http.put<ApiResponse<{ user: FdoUser }>>(
      `${this.apiUrl}/${id}`,
      payload,
    );
  }

  deleteFdo(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
