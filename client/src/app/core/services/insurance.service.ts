import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Insurance, InsuranceFilters } from '../models/insurance.model';
import { PaginatedResponse } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/insurances`;

  getInsurances(filters: InsuranceFilters = {}): Observable<PaginatedResponse<Insurance>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Insurance>>(this.apiUrl, { params });
  }
}
