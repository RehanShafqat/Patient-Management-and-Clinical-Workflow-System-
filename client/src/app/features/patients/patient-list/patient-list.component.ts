import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import {
  EntityTableColumn,
  EntityTableComponent,
} from '../../../shared/components/entity-table/entity-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

interface PatientRecord {
  id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  ssn?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  primary_physician?: string;
  insurance_provider?: string;
  insurance_policy_number?: string;
  preferred_language?: string;
  patient_status: 'active' | 'inactive' | 'deceased' | 'transferred';
  registration_date?: string;
  created_at: string;
  updated_at: string;
}

interface PatientRow extends PatientRecord {
  name: string;
  age: number;
  contact: string;
}

interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
    path: string;
    links: any[];
  };
}

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
  private readonly apiUrl = environment.apiUrl;

  // Phone regex: supports +, country code, dashes, spaces
  private readonly phoneRegex =
    /^(\+?\d{1,3}[-.\s]?)?\d{1,4}[-.\s]?\d{3}[-.\s]?\d{4}$/;
  // SSN regex: XXX-XX-XXXX
  private readonly ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
  // ZIP code regex: 5 digits optionally followed by - and 4 digits
  private readonly zipRegex = /^\d{5}(-\d{4})?$/;

  readonly columns: EntityTableColumn[] = [
    { name: 'Name', prop: 'name', minWidth: 220 },
    { name: 'DOB', prop: 'date_of_birth', type: 'date', width: 150 },
    { name: 'Age', prop: 'age', width: 90 },
    { name: 'Contact', prop: 'contact', minWidth: 180 },
    { name: 'Status', prop: 'patient_status', type: 'status', width: 130 },
    { name: 'Primary Physician', prop: 'primary_physician', minWidth: 180 },
  ];

  readonly statusOptions = [
    'all',
    'active',
    'inactive',
    'deceased',
    'transferred',
  ];

  readonly cityOptions = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
  ];

  readonly stateOptions = [
    'California',
    'Texas',
    'New York',
    'Florida',
    'Illinois',
  ];

  readonly countryOptions = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
  ];

  allRows: PatientRow[] = [];
  filteredRows: PatientRow[] = [];
  pagedRows: PatientRow[] = [];

  loading = true;
  isSaving = false;
  isDeleting = false;
  isUpdateModalOpen = false;
  isDeleteModalOpen = false;
  isCreateModalOpen = false;

  searchQuery = '';
  selectedStatus = 'all';
  selectedGender = 'all';
  filterCity = '';
  filterState = '';
  filterCountry = '';

  totalCount = 0;
  pageSize = 10;
  pageOffset = 0;

  selectedPatient: PatientRow | null = null;

  updateForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    date_of_birth: ['', [Validators.required, this.dateOfBirthValidator]],
    phone: ['', [Validators.pattern(this.phoneRegex)]],
    mobile: ['', [Validators.pattern(this.phoneRegex)]],
    email: ['', [Validators.email]],
    patient_status: ['active', [Validators.required]],
    primary_physician: [''],
  });

  createForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    middle_name: [''],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    date_of_birth: ['', [Validators.required, this.dateOfBirthValidator]],
    gender: ['male', [Validators.required]],
    ssn: ['', [Validators.pattern(this.ssnRegex)]],
    phone: ['', [Validators.pattern(this.phoneRegex)]],
    mobile: ['', [Validators.pattern(this.phoneRegex)]],
    email: ['', [Validators.email]],
    address: [''],
    city: [''],
    state: [''],
    zip_code: ['', [Validators.pattern(this.zipRegex)]],
    country: [''],
    emergency_contact_name: [''],
    emergency_contact_phone: ['', [Validators.pattern(this.phoneRegex)]],
    primary_physician: [''],
    insurance_provider: [''],
    insurance_policy_number: [''],
    preferred_language: [''],
    patient_status: ['active', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    let params = new HttpParams()
      .set('page', (this.pageOffset + 1).toString())
      .set('per_page', this.pageSize.toString())
      .set('search', this.searchQuery)
      .set(
        'patient_status',
        this.selectedStatus === 'all' ? '' : this.selectedStatus,
      )
      .set('gender', this.selectedGender === 'all' ? '' : this.selectedGender);
      
    if (this.filterCity) params = params.set('city', this.filterCity);
    if (this.filterState) params = params.set('state', this.filterState);
    if (this.filterCountry) params = params.set('country', this.filterCountry);

    this.http
      .get<
        PaginatedResponse<PatientRecord>
      >(`${this.apiUrl}/patients`, { params })
      .subscribe({
        next: (response) => {
          this.allRows = response.data.map((record) => ({
            ...record,
            name: `${record.first_name} ${record.last_name}`,
            age: this.calculateAge(record.date_of_birth),
            contact: record.mobile || record.phone || '',
          }));
          this.totalCount = response.meta.total;
          this.pageSize = response.meta.per_page;
          this.pageOffset = response.meta.current_page - 1;
          this.setPagedRows();
          this.loading = false;
        },
        error: () => {
          this.allRows = [];
          this.totalCount = 0;
          this.setPagedRows();
          this.loading = false;
        },
      });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.pageOffset = 0;
    this.loadPatients();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.pageOffset = 0;
    this.loadPatients();
  }

  onFilterChange(): void {
    this.pageOffset = 0;
    this.loadPatients();
  }

  onPageChange(event: { offset: number; limit: number }): void {
    this.pageOffset = event.offset;
    this.pageSize = event.limit;
    this.loadPatients();
  }

  onRowSelected(row: PatientRow): void {
    this.router.navigate([row.id], { relativeTo: this.route });
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    if (this.isSaving) {
      return;
    }

    this.isCreateModalOpen = false;
    this.createForm.reset();
  }

  saveCreate(): void {
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      return;
    }

    this.isSaving = true;

    const newPatient = this.createForm.getRawValue();
    this.http.post(`${this.apiUrl}/patients`, newPatient).subscribe({
      next: () => {
        this.isSaving = false;
        this.isCreateModalOpen = false;
        this.createForm.reset();
        this.loadPatients();
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }

  openUpdateModal(row: PatientRow): void {
    this.selectedPatient = row;
    this.updateForm.patchValue({
      first_name: row.first_name,
      last_name: row.last_name,
      date_of_birth: row.date_of_birth,
      phone: row.phone || '',
      mobile: row.mobile || '',
      email: row.email || '',
      patient_status: row.patient_status,
      primary_physician: row.primary_physician || '',
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
    this.http
      .put(`${this.apiUrl}/patients/${this.selectedPatient.id}`, updated)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.isUpdateModalOpen = false;
          this.selectedPatient = null;
          this.loadPatients();
        },
        error: () => {
          this.isSaving = false;
        },
      });
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
    this.http
      .delete(`${this.apiUrl}/patients/${this.selectedPatient.id}`)
      .subscribe({
        next: () => {
          this.isDeleting = false;
          this.isDeleteModalOpen = false;
          this.selectedPatient = null;
          this.loadPatients();
        },
        error: () => {
          this.isDeleting = false;
        },
      });
  }

  private setPagedRows(): void {
    this.pagedRows = this.allRows;
  }

  private dateOfBirthValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }

    const dob = new Date(control.value);
    const today = new Date();

    if (dob > today) {
      return { futureDate: true };
    }

    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 150);
    if (dob < minDate) {
      return { tooOld: true };
    }

    return null;
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
