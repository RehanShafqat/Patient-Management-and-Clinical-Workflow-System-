import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalPatients: number;
  patientChangePercent: number;
  activeCasesCount: number;
  newCasesToday: number;
  todayAppointmentsCount: number;
  completedVisitsCount: number;
  completionRate: number;
  appointmentsTrend: { date: string; count: number }[];
  caseCategories: { category: string; count: number }[];
  recentPatients: {
    id: string;
    full_name: string;
    registration_date: string;
    status: string;
  }[];
  staffPerformance: {
    name: string;
    department: string;
    patients_handled: number;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard/stats`;
  private statsCache$?: Observable<DashboardStats>;

  clearStatsCache(): void {
    this.statsCache$ = undefined;
  }

  getStats(): Observable<DashboardStats> {
    if (!this.statsCache$) {
      this.statsCache$ = this.http
        .get<{ data: DashboardStats }>(this.apiUrl)
        .pipe(
          map((response) => response.data),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }

    return this.statsCache$;
  }
}
