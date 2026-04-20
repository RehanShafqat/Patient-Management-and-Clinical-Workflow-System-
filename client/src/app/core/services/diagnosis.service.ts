import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Diagnosis, DiagnosisFilters } from '../models/diagnosis.model';
import { PaginatedResponse } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/diagnoses`;
  private readonly diagnosisCache = new Map<
    string,
    Observable<PaginatedResponse<Diagnosis>>
  >();

  getDiagnoses(
    filters: DiagnosisFilters = {},
  ): Observable<PaginatedResponse<Diagnosis>> {
    let params = new HttpParams();

    Object.entries(filters)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });

    const cacheKey = params.toString();
    const cached = this.diagnosisCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const request$ = this.http
      .get<PaginatedResponse<Diagnosis>>(this.apiUrl, { params })
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));

    this.diagnosisCache.set(cacheKey, request$);

    return request$;
  }

  clearCache(): void {
    this.diagnosisCache.clear();
  }
}
