import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  EntityTableColumn,
  EntityTableComponent,
} from '../../../shared/components/entity-table/entity-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { environment } from '../../../../environments/environment';
import {
  Specialty,
  SpecialtyFilters,
} from '../../../core/models/specialty.model';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { SpecialtyFormComponent } from '../specialty-form/specialty-form.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-specialty-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EntityTableComponent,
    ConfirmDialogComponent,
    SpecialtyFormComponent,
    RouterLink,
  ],
  templateUrl: './specialty-list.component.html',
})
export class SpecialtyListComponent implements OnInit {
  private readonly specialtyService = inject(SpecialtyService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly filterDebounceMs = environment.filterDebounceMs;

  private readonly searchSubject = new Subject<string>();

  readonly columns: EntityTableColumn[] = [
    { name: 'Specialty Name', prop: 'specialty_name', minWidth: 240 },
    { name: 'Status', prop: 'status_label', type: 'status', width: 130 },
    { name: 'Created', prop: 'created_at', type: 'date', width: 140 },
  ];

  specialties: Array<
    Specialty & {
      status_label: string;
    }
  > = [];

  loading = true;
  totalCount = 0;
  currentPage = 1;
  pageSize = 10;

  private readonly defaultFilters: SpecialtyFilters = {
    search: '',
    is_active: undefined,
  };

  filters: SpecialtyFilters = { ...this.defaultFilters };

  isUpdateModalOpen = false;
  isDeleteModalOpen = false;
  isDeleting = false;
  selectedSpecialty: Specialty | null = null;

  ngOnInit(): void {
    this.setupSearch();
    this.loadSpecialties();
  }

  private setupSearch(): void {
    this.searchSubject
      .pipe(debounceTime(this.filterDebounceMs), distinctUntilChanged())
      .subscribe((search) => {
        this.filters.search = search;
        this.currentPage = 1;
        this.loadSpecialties();
      });
  }

  loadSpecialties(): void {
    this.loading = true;

    const fetchFilters: SpecialtyFilters = {
      ...this.filters,
      page: this.currentPage,
      per_page: this.pageSize,
    };

    if (!fetchFilters.search) {
      delete fetchFilters.search;
    }

    if (typeof fetchFilters.is_active !== 'boolean') {
      delete fetchFilters.is_active;
    }

    this.specialtyService.getSpecialties(fetchFilters).subscribe({
      next: (response) => {
        this.specialties = response.data.map((specialty) => ({
          ...specialty,
          status_label: specialty.is_active ? 'active' : 'inactive',
        }));
        this.totalCount = response.meta.total;
        this.loading = false;
      },
      error: () => {
        this.specialties = [];
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
    this.loadSpecialties();
  }

  resetFilters(): void {
    if (this.areFiltersDefault() && this.currentPage === 1) {
      return;
    }

    this.filters = { ...this.defaultFilters };
    this.currentPage = 1;
    this.loadSpecialties();
  }

  private areFiltersDefault(): boolean {
    return (
      (this.filters.search || '').trim() === '' &&
      typeof this.filters.is_active !== 'boolean'
    );
  }

  onPageChange(event: { offset: number; limit: number }): void {
    this.currentPage = event.offset + 1;
    this.pageSize = event.limit;
    this.loadSpecialties();
  }

  onRowSelected(row: Specialty): void {
    if (!row?.id) {
      return;
    }

    const rolePrefix = this.router.url.split('/')[1] || 'admin';
    this.router.navigate([`/${rolePrefix}/specialties`, row.id]);
  }

  onUpdateRequested(row: Specialty): void {
    this.selectedSpecialty = row;
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
    this.selectedSpecialty = null;
  }

  onUpdateSuccess(_specialty: Specialty): void {
    this.closeUpdateModal();
    this.loadSpecialties();
  }

  onDeleteRequested(row: Specialty): void {
    this.selectedSpecialty = row;
    this.isDeleteModalOpen = true;
  }

  onDeleteModalChange(open: boolean): void {
    this.isDeleteModalOpen = open;

    if (!open) {
      this.selectedSpecialty = null;
    }
  }

  confirmDelete(): void {
    if (!this.selectedSpecialty) {
      return;
    }

    this.isDeleting = true;

    this.specialtyService.deleteSpecialty(this.selectedSpecialty.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.toastr.success('Specialty deleted successfully');
        this.selectedSpecialty = null;
        this.loadSpecialties();
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }
}
