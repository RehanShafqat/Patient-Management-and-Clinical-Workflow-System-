import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EntityTableColumn,
  EntityTableComponent,
} from '../../../shared/components/entity-table/entity-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

interface PatientRecord {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  contact: string;
  status: 'active' | 'inactive' | 'critical' | 'discharged';
  primary_physician: string;
  email: string;
}

interface PatientRow extends PatientRecord {
  name: string;
  age: number;
}

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EntityTableComponent,
    ConfirmDialogComponent,
  ],
  templateUrl: './patient-list.component.html',
})
export class PatientListComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly columns: EntityTableColumn[] = [
    { name: 'Name', prop: 'name', minWidth: 220 },
    { name: 'DOB', prop: 'date_of_birth', type: 'date', width: 150 },
    { name: 'Age', prop: 'age', width: 90 },
    { name: 'Contact', prop: 'contact', minWidth: 180 },
    { name: 'Status', prop: 'status', type: 'status', width: 130 },
    { name: 'Primary Physician', prop: 'primary_physician', minWidth: 180 },
  ];

  readonly statusOptions = [
    'all',
    'active',
    'inactive',
    'critical',
    'discharged',
  ];

  allRows: PatientRow[] = [];
  filteredRows: PatientRow[] = [];
  pagedRows: PatientRow[] = [];

  loading = true;
  isSaving = false;
  isDeleting = false;
  isUpdateModalOpen = false;
  isDeleteModalOpen = false;

  searchQuery = '';
  selectedStatus = 'all';

  totalCount = 0;
  pageSize = 10;
  pageOffset = 0;

  selectedPatient: PatientRow | null = null;

  updateForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    date_of_birth: ['', [Validators.required]],
    contact: ['', [Validators.required]],
    status: ['active', [Validators.required]],
    primary_physician: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.http.get<PatientRecord[]>('/patients.json').subscribe({
      next: (records) => {
        this.allRows = records.map((record) => ({
          ...record,
          name: `${record.first_name} ${record.last_name}`,
          age: this.calculateAge(record.date_of_birth),
        }));

        this.applyFilters(true);
        this.loading = false;
      },
      error: () => {
        this.allRows = [];
        this.applyFilters(true);
        this.loading = false;
      },
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters(true);
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.applyFilters(true);
  }

  onPageChange(event: { offset: number; limit: number }): void {
    this.pageOffset = event.offset;
    this.pageSize = event.limit;
    this.setPagedRows();
  }

  onRowSelected(row: PatientRow): void {
    this.router.navigate([row.id], { relativeTo: this.route });
  }

  openUpdateModal(row: PatientRow): void {
    this.selectedPatient = row;
    this.updateForm.patchValue({
      first_name: row.first_name,
      last_name: row.last_name,
      date_of_birth: row.date_of_birth,
      contact: row.contact,
      status: row.status,
      primary_physician: row.primary_physician,
      email: row.email,
    });
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    if (this.isSaving) {
      return;
    }

    this.isUpdateModalOpen = false;
    this.selectedPatient = null;
    this.updateForm.reset();
  }

  saveUpdate(): void {
    this.updateForm.markAllAsTouched();
    if (this.updateForm.invalid || !this.selectedPatient) {
      return;
    }

    this.isSaving = true;

    const updated = this.updateForm.getRawValue();
    this.allRows = this.allRows.map((row) => {
      if (row.id !== this.selectedPatient?.id) {
        return row;
      }

      const firstName = (updated.first_name ?? '').trim();
      const lastName = (updated.last_name ?? '').trim();
      const dob = updated.date_of_birth ?? row.date_of_birth;

      return {
        ...row,
        first_name: firstName,
        last_name: lastName,
        name: `${firstName} ${lastName}`.trim(),
        date_of_birth: dob,
        age: this.calculateAge(dob),
        contact: (updated.contact ?? row.contact).trim(),
        status: (updated.status as PatientRow['status']) ?? row.status,
        primary_physician: (
          updated.primary_physician ?? row.primary_physician
        ).trim(),
        email: (updated.email ?? row.email).trim(),
      };
    });

    this.isSaving = false;
    this.isUpdateModalOpen = false;
    this.selectedPatient = null;
    this.applyFilters(false);
  }

  openDeleteModal(row: PatientRow): void {
    this.selectedPatient = row;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    if (this.isDeleting) {
      return;
    }

    this.isDeleteModalOpen = false;
    this.selectedPatient = null;
  }

  confirmDelete(): void {
    if (!this.selectedPatient) {
      return;
    }

    this.isDeleting = true;
    const idToDelete = this.selectedPatient.id;

    this.allRows = this.allRows.filter((row) => row.id !== idToDelete);

    this.isDeleting = false;
    this.isDeleteModalOpen = false;
    this.selectedPatient = null;
    this.applyFilters(false);
  }

  private applyFilters(resetToFirstPage: boolean): void {
    const term = this.searchQuery.trim().toLowerCase();
    this.filteredRows = this.allRows.filter((row) => {
      const matchesSearch =
        !term ||
        row.name.toLowerCase().includes(term) ||
        row.contact.toLowerCase().includes(term) ||
        row.primary_physician.toLowerCase().includes(term);

      const matchesStatus =
        this.selectedStatus === 'all' || row.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });

    this.totalCount = this.filteredRows.length;

    if (resetToFirstPage) {
      this.pageOffset = 0;
    }

    const maxOffset = Math.max(
      Math.ceil(this.totalCount / this.pageSize) - 1,
      0,
    );
    if (this.pageOffset > maxOffset) {
      this.pageOffset = maxOffset;
    }

    this.setPagedRows();
  }

  private setPagedRows(): void {
    const start = this.pageOffset * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRows = this.filteredRows.slice(start, end);
  }

  private calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  }
}
