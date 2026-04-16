import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PracticeLocation, PracticeLocationFilters } from '../models/practice-location.model';
import { PaginatedResponse } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PracticeLocationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/practice-locations`;

  getPracticeLocations(
    filters: PracticeLocationFilters = {}
  ): Observable<PaginatedResponse<PracticeLocation>> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    // We get response wrapped in ApiResponse for list endpoints typically?
    // Let's assume pagination matches the standard. Laravel sometimes returns data wrapped in data: { data: [] }. 
    // Usually PracticeLocationResource::collection($practiceLocations) returns { data: [], links, meta }
    return this.http.get<PaginatedResponse<PracticeLocation>>(this.apiUrl, { params });
  }
}
