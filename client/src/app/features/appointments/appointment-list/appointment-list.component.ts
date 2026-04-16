import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  EntityTableColumn,
  EntityTableComponent,
} from '../../../shared/components/entity-table/entity-table.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentService } from '../../../core/services/appointment.service';
import {
  Appointment,
  AppointmentFilters,
  AppointmentStatus,
  AppointmentType,
} from '../../../core/models/appointment.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EntityTableComponent,
    ConfirmDialogComponent,
    AppointmentFormComponent,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  //INFO: Stream for debounced search to avoid excessive API calls
  private patientNameSubject = new Subject<string>();
  //INFO: Stream for debounced doctor name filtering
  private doctorNameSubject = new Subject<string>();
  //INFO: Stream for debounced date range filtering
  private dateRangeSubject = new Subject<{ from?: string; to?: string }>();

  //INFO: Table column configuration
  readonly columns: EntityTableColumn[] = [
    { name: 'Appointment#', prop: 'appointment_number', minWidth: 130 },
    { name: 'Patient', prop: 'patient_name', minWidth: 180 },
    { name: 'Doctor', prop: 'doctor_name', minWidth: 150 },
    { name: 'Specialty', prop: 'specialty_name', minWidth: 130 },
    { name: 'Location', prop: 'practice_location_name', minWidth: 150 },
    { name: 'Date', prop: 'appointment_date', type: 'date', width: 120 },
    { name: 'Time', prop: 'appointment_time', width: 100 },
    { name: 'Type', prop: 'appointment_type', width: 120 },
    { name: 'Status', prop: 'status', type: 'status', width: 120 },
    { name: 'Reason', prop: 'reason_for_visit', minWidth: 150 },
  ];

  readonly statusOptions: AppointmentStatus[] = [
    'scheduled',
    'confirmed',
    'checked_in',
    'in_progress',
    'completed',
    'cancelled',
    'no_show',
    'rescheduled',
  ];

  readonly appointmentTypeOptions: AppointmentType[] = [
    'New Patient',
    'Follow-up',
    'Consultation',
    'Procedure',
    'Telehealth',
    'Emergency',
    'Routine Checkup',
    'Post-op Follow-up',
  ];

  //INFO: Data state
  appointments: Appointment[] = [];
  loading = true;
  totalCount = 0;
  pageSize = 10;
  currentPage = 1;

  //INFO: Filter options (extracted from appointments)
  specialties: { id: string; name: string }[] = [];
  locations: { id: string; name: string }[] = [];

  //INFO: Track if initial load is complete to populate filter options
  private isInitialLoadComplete = false;

  //INFO: Filters state
  filters: AppointmentFilters = {
    patient_name: '',
    doctor_name: '',
    specialty_id: undefined,
    appointment_type: undefined,
    status: undefined,
    practice_location_id: undefined,
    created_by: undefined,
    date_from: undefined,
    date_to: undefined,
  };

  //INFO: Modal state
  isCreateModalOpen = false;
  isUpdateModalOpen = false;
  isDeleteModalOpen = false;
  selectedAppointment: Appointment | null = null;
  isDeleting = false;

  ngOnInit(): void {
    // Load all appointments without filters first to populate options
    this.loadAllAppointmentsForOptions();
    this.setupFilterSubscriptions();
  }

  //INFO: Load appointments without filters to populate specialty/location dropdowns
  private loadAllAppointmentsForOptions(): void {
    this.appointmentService.getAppointments({ per_page: 100 }).subscribe({
      next: (response) => {
        this.extractFilterOptions(response.data);
        this.isInitialLoadComplete = true;
        // Now load with filters applied
        this.loadAppointments();
      },
      error: () => {
        this.isInitialLoadComplete = true;
        this.loadAppointments();
      },
    });
  }

  //INFO: Setup filter subscriptions
  private setupFilterSubscriptions(): void {
    //INFO: Patient name debouncing (300ms)
    this.patientNameSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((patientName) => {
        this.filters.patient_name = patientName;
        this.currentPage = 1;
        this.loadAppointments();
      });

    //INFO: Doctor name debouncing (300ms)
    this.doctorNameSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((doctorName) => {
        this.filters.doctor_name = doctorName;
        this.currentPage = 1;
        this.loadAppointments();
      });

    //INFO: Date range debouncing (300ms)
    this.dateRangeSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(({ from, to }) => {
        this.filters.date_from = from;
        this.filters.date_to = to;
        this.currentPage = 1;
        this.loadAppointments();
      });
  }

  //INFO: Core method to fetch appointments from service
  loadAppointments(): void {
    this.loading = true;
    const fetchFilters: AppointmentFilters = {
      ...this.filters,
      page: this.currentPage,
      per_page: this.pageSize,
    };

    // Clean empty values from filters
    if (!fetchFilters.patient_name) delete fetchFilters.patient_name;
    if (!fetchFilters.doctor_name) delete fetchFilters.doctor_name;
    if (!fetchFilters.date_from) delete fetchFilters.date_from;
    if (!fetchFilters.date_to) delete fetchFilters.date_to;
    if (!fetchFilters.specialty_id) delete fetchFilters.specialty_id;
    if (!fetchFilters.practice_location_id)
      delete fetchFilters.practice_location_id;
    if (!fetchFilters.created_by) delete fetchFilters.created_by;

    //INFO: Defensive cleanup in case select emits string "undefined" from template bindings.
    if (
      !fetchFilters.appointment_type ||
      fetchFilters.appointment_type ===
        ('undefined' as unknown as AppointmentType)
    ) {
      delete fetchFilters.appointment_type;
    }

    if (
      !fetchFilters.status ||
      fetchFilters.status === ('undefined' as unknown as AppointmentStatus)
    ) {
      delete fetchFilters.status;
    }

    this.appointmentService.getAppointments(fetchFilters).subscribe({
      next: (response) => {
        this.appointments = response.data;
        this.totalCount = response.meta.total;
        this.loading = false;

        //INFO: Merge any new specialties/locations found (in case initial load didn't get all)
        // This ensures we never lose options when filtering
        this.extractFilterOptions(response.data, true);
      },

      error: () => {
        this.appointments = [];
        this.totalCount = 0;
        this.loading = false;
      },
    });
  }

  //INFO: Extract unique specialties and locations, optionally merging with existing
  private extractFilterOptions(
    appointmentData: Appointment[],
    merge = false,
  ): void {
    const specialtyMap = new Map<string, string>();
    const locationMap = new Map<string, string>();

    // If merging, start with existing options
    if (merge) {
      this.specialties.forEach((spec) => specialtyMap.set(spec.id, spec.name));
      this.locations.forEach((loc) => locationMap.set(loc.id, loc.name));
    }

    appointmentData.forEach((apt) => {
      if (apt.specialty_id && apt.specialty_name) {
        specialtyMap.set(apt.specialty_id, apt.specialty_name);
      }
      if (apt.practice_location_id && apt.practice_location_name) {
        locationMap.set(apt.practice_location_id, apt.practice_location_name);
      }
    });

    this.specialties = Array.from(specialtyMap, ([id, name]) => ({
      id,
      name,
    })).sort((a, b) => a.name.localeCompare(b.name));

    this.locations = Array.from(locationMap, ([id, name]) => ({
      id,
      name,
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  //INFO: Event handlers for UI interactions
  onPatientNameSearch(query: string): void {
    this.patientNameSubject.next(query);
  }

  onDoctorNameSearch(query: string): void {
    this.doctorNameSubject.next(query);
  }

  onDateRangeChange(): void {
    this.dateRangeSubject.next({
      from: this.filters.date_from,
      to: this.filters.date_to,
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAppointments();
  }

  onPageChange(event: { offset: number; limit: number }): void {
    this.currentPage = event.offset + 1;
    this.pageSize = event.limit;
    this.loadAppointments();
  }

  onRowSelected(row: Appointment): void {
    if (!row?.id) {
      return;
    }

    const rolePrefix = this.router.url.split('/')[1];

    //INFO: Use absolute role path to ensure detail route opens reliably from any appointments list context.
    this.router.navigate([`/${rolePrefix || 'admin'}/appointments`, row.id]);
  }

  //INFO: Modal management
  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  onCreateSuccess(newAppointment: Appointment): void {
    this.closeCreateModal();
    this.currentPage = 1;
    this.loadAppointments();
    this.toastr.success('Appointment scheduled successfully');
  }

  openUpdateModal(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.isUpdateModalOpen = true;
  }

  closeUpdateModal(): void {
    this.isUpdateModalOpen = false;
    this.selectedAppointment = null;
  }

  onUpdateSuccess(updatedAppointment: Appointment): void {
    this.closeUpdateModal();
    this.loadAppointments();
    this.toastr.success('Appointment updated successfully');
  }

  openDeleteModal(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.selectedAppointment = null;
  }

  cancelAppointment(): void {
    if (!this.selectedAppointment) return;

    this.isDeleting = true;
    this.appointmentService
      .cancelAppointment(this.selectedAppointment.id)
      .subscribe({
        next: () => {
          this.isDeleting = false;
          this.isDeleteModalOpen = false;
          this.toastr.success('Appointment cancelled successfully');
          this.selectedAppointment = null;
          this.loadAppointments();
        },
        error: () => {
          this.isDeleting = false;
        },
      });
  }
}
