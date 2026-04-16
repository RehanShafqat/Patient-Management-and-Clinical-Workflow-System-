import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Firm, FirmFilters } from '../models/firm.model';
import { PaginatedResponse } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class FirmService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/firms`;

  getFirms(filters: FirmFilters = {}): Observable<PaginatedResponse<Firm>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PaginatedResponse<Firm>>(this.apiUrl, { params });
  }
}
