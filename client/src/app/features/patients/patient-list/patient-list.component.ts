import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  EntityTableColumn,
  EntityTableComponent,
} from '../../../shared/components/entity-table/entity-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PatientService } from '../../../core/services/patient.service';
import {
  Gender,
  Patient,
  PatientFilters,
  PatientStatus,
} from '../../../core/models/patient.model';
import { PatientFormComponent } from '../patient-form/patient-form.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
    EntityTableComponent,
    ConfirmDialogComponent,
    PatientFormComponent,
    RouterLink,
  ],
  templateUrl: './patient-list.component.html',
})
export class PatientListComponent implements OnInit {
  private readonly patientService = inject(PatientService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly filterDebounceMs = environment.filterDebounceMs;

  //INFO: Stream for debounced search to avoid excessive API calls
  private searchSubject = new Subject<string>();
  //INFO: Stream for debounced city filtering to avoid excessive API calls while typing.
  private citySubject = new Subject<string>();
  //INFO: Stream for debounced country filtering to avoid excessive API calls while typing.
  private countrySubject = new Subject<string>();

  //INFO: Table column configuration
  readonly columns: EntityTableColumn[] = [
    { name: 'Name', prop: 'full_name', minWidth: 200 },
    { name: 'Email', prop: 'email', minWidth: 200 },
    { name: 'DOB', prop: 'date_of_birth', type: 'date', width: 130 },
    { name: 'Gender', prop: 'gender', width: 100 },
    { name: 'Status', prop: 'patient_status', type: 'status', width: 130 },
    { name: 'Contact', prop: 'phone', minWidth: 150 },
    { name: 'City', prop: 'city', width: 120 },
    { name: 'Country', prop: 'country', width: 120 },
  ];

  readonly statusOptions: PatientStatus[] = [
    'active',
    'inactive',
    'deceased',
    'transferred',
  ];
  readonly genderOptions: Gender[] = [
    'male',
    'female',
    'other',
    'prefer_not_to_say',
  ];

  //INFO: Data state
  patients: Patient[] = [];
  loading = true;
  totalCount = 0;
  pageSize = 10;
  currentPage = 1;

  //INFO: Filters state
  private readonly defaultFilters: PatientFilters = {
    search: '',
    patient_status: undefined,
    gender: undefined,
    city: '',
    country: '',
  };

  filters: PatientFilters = { ...this.defaultFilters };

  //INFO: Modal state
  isUpdateModalOpen = false;
  isDeleteModalOpen = false;
  selectedPatient: Patient | null = null;
  isDeleting = false;

  ngOnInit(): void {
    this.loadPatients();

    //INFO: search debouncing (300ms)
    this.searchSubject
      .pipe(debounceTime(this.filterDebounceMs), distinctUntilChanged())
      .subscribe((query) => {
        this.filters.search = query;
        this.currentPage = 1;
        this.loadPatients();
      });

    //INFO: city filter debouncing (300ms)
    this.citySubject
      .pipe(debounceTime(this.filterDebounceMs), distinctUntilChanged())
      .subscribe((city) => {
        this.filters.city = city;
        this.currentPage = 1;
        this.loadPatients();
      });

    //INFO: country filter debouncing (300ms)
    this.countrySubject
      .pipe(debounceTime(this.filterDebounceMs), distinctUntilChanged())
      .subscribe((country) => {
        this.filters.country = country;
        this.currentPage = 1;
        this.loadPatients();
      });
  }

  //INFO: Core method to fetch patients from service
  loadPatients(): void {
    this.loading = true;
    const fetchFilters: PatientFilters = {
      ...this.filters,
      page: this.currentPage,
      per_page: this.pageSize,
    };

    // Clean empty values from filters
    if (!fetchFilters.search) delete fetchFilters.search;
    if (!fetchFilters.city) delete fetchFilters.city;
    if (!fetchFilters.country) delete fetchFilters.country;

    //INFO: Defensive cleanup in case select emits string "undefined" from template bindings.
    // if (
    //   !fetchFilters.patient_status ||
    //   fetchFilters.patient_status === ('undefined' as unknown as PatientStatus)
    // ) {
    //   delete fetchFilters.patient_status;
    // }

    // if (
    //   !fetchFilters.gender ||
    //   fetchFilters.gender === ('undefined' as unknown as Gender)
    // ) {
    //   delete fetchFilters.gender;
    // }

    this.patientService.getPatients(fetchFilters).subscribe({
      next: (response) => {
        this.patients = response.data.map((p: any) => ({
          ...p,
          full_name: `${p.first_name} ${p.last_name}`,
        }));
        this.totalCount = response.meta.total;
        this.loading = false;
      },

      error: () => {
        this.patients = [];
        this.totalCount = 0;
        this.loading = false;
      },
    });
  }

  //INFO: Event handlers for UI interactions
  onSearch(query: string): void {
    this.searchSubject.next(query);
  }

  onCountrySearch(query: string): void {
    this.countrySubject.next(query);
  }

  onCitySearch(query: string): void {
    this.citySubject.next(query);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPatients();
  }

  resetFilters(): void {
    if (this.areFiltersDefault() && this.currentPage === 1) {
      return;
    }

    this.filters = { ...this.defaultFilters };
    this.currentPage = 1;
    this.loadPatients();
  }

  private areFiltersDefault(): boolean {
    return (
      (this.filters.search || '').trim() === '' &&
      !this.filters.patient_status &&
      !this.filters.gender &&
      (this.filters.city || '').trim() === '' &&
      (this.filters.country || '').trim() === ''
    );
  }

  onPageChange(event: { offset: number; limit: number }): void {
    this.currentPage = event.offset + 1;
    this.pageSize = event.limit;
    this.loadPatients();
  }

  onRowSelected(row: Patient): void {
    if (!row?.id) {
      return;
    }

    const rolePrefix = this.router.url.split('/')[1];

    //INFO: Use absolute role path to ensure detail route opens reliably from any patients list context.
    this.router.navigate([`/${rolePrefix}/patients`, row.id]);
  }

  //INFO: Modal management
  openUpdateModal(patient: Patient): void {
    this.selectedPatient = patient;
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
    this.selectedPatient = null;
  }

  onUpdateSuccess(updatedPatient: Patient): void {
    this.closeUpdateModal();
    this.loadPatients();
  }

  openDeleteModal(patient: Patient): void {
    this.selectedPatient = patient;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedPatient = null;
  }

  confirmDelete(): void {
    if (!this.selectedPatient) return;

    this.isDeleting = true;
    this.patientService.deletePatient(this.selectedPatient.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.isDeleteModalOpen = false;
        this.toastr.success('Patient record archived successfully');
        this.selectedPatient = null;
        this.loadPatients();
      },
      error: () => {
        this.isDeleting = false;
      },
    });
  }
}
