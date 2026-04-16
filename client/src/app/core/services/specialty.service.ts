import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/patient.model';
import { Specialty, SpecialtyFilters } from '../models/specialty.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/specialties`;

  getSpecialties(
    filters: SpecialtyFilters = {},
  ): Observable<PaginatedResponse<Specialty>> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Specialty>>(this.apiUrl, { params });
  }
}
