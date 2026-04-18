import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  EntityTableColumn,
  EntityTableComponent,
} from '../../../shared/components/entity-table/entity-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { VisitService } from '../../../core/services/visit.service';
import {
  Visit,
  VisitFilters,
  VisitStatus,
} from '../../../core/models/visit.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { VisitFormComponent } from '../visit-form/visit-form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-visit-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntityTableComponent,
    ConfirmDialogComponent,
    VisitFormComponent,
  ],
  templateUrl: './visit-list.component.html',
  styleUrls: ['./visit-list.component.css'],
})
export class VisitListComponent implements OnInit {
  private readonly visitService = inject(VisitService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly filterDebounceMs = environment.filterDebounceMs;

  private readonly searchSubject = new Subject<string>();

  visits: Array<Visit & { follow_up_label: string }> = [];
  readonly columns: EntityTableColumn[] = [
    { name: 'Visit#', prop: 'visit_number', minWidth: 150 },
    { name: 'Patient', prop: 'patient_name', minWidth: 180 },
    { name: 'Doctor', prop: 'doctor_name', minWidth: 180 },
    { name: 'Case#', prop: 'case_number', minWidth: 150 },
    { name: 'Date', prop: 'visit_date', type: 'date', width: 130 },
    { name: 'Status', prop: 'visit_status', type: 'status', width: 130 },
    { name: 'Follow Up', prop: 'follow_up_label', minWidth: 120 },
  ];

  readonly statusOptions: VisitStatus[] = [
    'Draft',
    'Completed',
    'Cancelled',
    'Billed',
  ];

  loading = true;
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;

  private readonly defaultFilters: VisitFilters = {
    search: '',
    visit_status: undefined,
    date_from: undefined,
    date_to: undefined,
  };

  filters: VisitFilters = { ...this.defaultFilters };

  isUpdateModalOpen = false;
  isDeleteModalOpen = false;
  isDeleting = false;
  selectedVisit: Visit | null = null;

  get canDeleteVisits(): boolean {
    return this.isAdminRoute();
  }

  ngOnInit(): void {
    this.setupSearch();
    this.loadVisits();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(this.filterDebounceMs), distinctUntilChanged())
      .subscribe((search) => {
        this.filters.search = search;
        this.currentPage = 1;
        this.loadVisits();
      });
  }

  loadVisits(): void {
    this.loading = true;

    const fetchFilters: VisitFilters = {
      ...this.filters,
      page: this.currentPage,
      per_page: this.pageSize,
    };

    if (!fetchFilters.search) delete fetchFilters.search;
    if (!fetchFilters.visit_status) delete fetchFilters.visit_status;
    if (!fetchFilters.date_from) delete fetchFilters.date_from;
    if (!fetchFilters.date_to) delete fetchFilters.date_to;

    this.visitService.getVisits(fetchFilters).subscribe({
      next: (response) => {
        this.visits = response.data.map((visit) => ({
          ...visit,
          follow_up_label: visit.follow_up_required ? 'Yes' : 'No',
        }));
        this.totalCount = response.meta.total;
        this.loading = false;
      },
      error: () => {
        this.visits = [];
        this.totalCount = 0;
        this.loading = false;
      },
    });
  }

  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadVisits();
  }

  onPageChange(event: { offset: number; limit: number }): void {
    this.currentPage = event.offset + 1;
    this.pageSize = event.limit;
    this.loadVisits();
  }

  onRowSelected(row: Visit): void {
    if (!row?.id) {
      return;
    }

    const rolePrefix = this.router.url.split('/')[1] || 'admin';
    this.router.navigate([`/${rolePrefix}/visits`, row.id]);
  }

  onUpdateRequested(visit: Visit): void {
    this.openUpdateModal(visit);
  }

  openUpdateModal(visit: Visit): void {
    this.selectedVisit = visit;
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
    this.selectedVisit = null;
  }

  onUpdateSuccess(updatedVisit: Visit): void {
    this.closeUpdateModal();
    this.toastr.success('Visit updated successfully');
    this.loadVisits();
  }

  onDeleteRequested(visit: Visit): void {
    if (!this.isAdminRoute()) {
      this.toastr.error('Only admins can delete visits.');
      return;
    }

    this.selectedVisit = visit;
    this.isDeleteModalOpen = true;
  }

  onDeleteModalChange(open: boolean): void {
    this.isDeleteModalOpen = open;
    if (!open) {
      this.selectedVisit = null;
    }
  }

  confirmDelete(): void {
    if (!this.selectedVisit) {
      return;
    }

    this.isDeleting = true;

    this.visitService.deleteVisit(this.selectedVisit.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.toastr.success('Visit deleted successfully');
        this.selectedVisit = null;
        this.loadVisits();
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }

  resetFilters(): void {
    if (this.areFiltersDefault() && this.currentPage === 1) {
      return;
    }

    this.filters = { ...this.defaultFilters };
    this.currentPage = 1;
    this.loadVisits();
  }

  private areFiltersDefault(): boolean {
    return (
      (this.filters.search || '').trim() === '' &&
      !this.filters.visit_status &&
      !this.filters.date_from &&
      !this.filters.date_to
    );
  }

  private isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin/');
  }
}
