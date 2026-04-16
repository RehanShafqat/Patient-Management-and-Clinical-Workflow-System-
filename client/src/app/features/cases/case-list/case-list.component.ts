import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CaseService } from '../../../core/services/case.service';
import { Case, CaseFilters } from '../../../core/models/case.model';
import {
  EntityTableColumn,
  EntityTableComponent,
} from '../../../shared/components/entity-table/entity-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CaseFormComponent } from '../case-form/case-form.component';

@Component({
  selector: 'app-case-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    EntityTableComponent,
    ConfirmDialogComponent,
    CaseFormComponent,
  ],
  templateUrl: './case-list.component.html',
})
export class CaseListComponent implements OnInit {
  private readonly caseService = inject(CaseService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  private searchSubject = new Subject<string>();

  readonly columns: EntityTableColumn[] = [
    { name: 'Case #', prop: 'case_number', width: 150 },
    { name: 'Patient ID', prop: 'patient_id', minWidth: 150 },
    { name: 'Category', prop: 'category', width: 130 },
    { name: 'Type', prop: 'case_type', width: 150 },
    { name: 'Priority', prop: 'priority', width: 120 },
    { name: 'Status', prop: 'case_status', type: 'status', width: 130 },
    { name: 'Opening Date', prop: 'opening_date', type: 'date', width: 120 },
  ];

  cases: Case[] = [];
  loading = true;
  totalCount = 0;
  pageSize = 15;
  currentPage = 1;

  filters: CaseFilters = {
    search: '',
  };

  isUpdateModalOpen = false;
  isDeleteModalOpen = false;
  selectedCase: Case | null = null;
  isDeleting = false;

  ngOnInit(): void {
    this.loadCases();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        this.filters.search = query;
        this.currentPage = 1;
        this.loadCases();
      });
  }

  loadCases(): void {
    this.loading = true;
    const fetchFilters: CaseFilters = {
      ...this.filters,
      page: this.currentPage,
      per_page: this.pageSize,
    };

    if (!fetchFilters.search) delete fetchFilters.search;

    this.caseService.getCases(fetchFilters).subscribe({
      next: (response) => {
        this.cases = response.data;
        this.totalCount = response.meta.total;
        this.loading = false;
      },
      error: () => {
        this.cases = [];
        this.totalCount = 0;
        this.loading = false;
      },
    });
  }

  onSearch(event: any): void {
    const query = event.target.value;
    this.searchSubject.next(query);
  }

  onPageChange(event: { offset: number; limit: number }): void {
    this.currentPage = event.offset + 1;
    this.pageSize = event.limit;
    this.loadCases();
  }

  onRowSelected(row: Case): void {
    // If you uncomment this, a row click will go to details instead of update.
    // For now we'll do update on row click or button. Let's do actions through modal.
  }

  // --- Modal Management ---

  openUpdateModal(row: Case): void {
    this.selectedCase = row;
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
    this.selectedCase = null;
  }

  onUpdateSuccess(updatedCase: Case): void {
    this.closeUpdateModal();
    this.loadCases();
  }

  openDeleteModal(row: Case): void {
    this.selectedCase = row;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedCase = null;
  }

  confirmDelete(): void {
    if (!this.selectedCase) return;

    this.isDeleting = true;
    this.caseService.deleteCase(this.selectedCase.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.toastr.success('Case record deleted successfully');
        this.selectedCase = null;
        this.loadCases();
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }
}
