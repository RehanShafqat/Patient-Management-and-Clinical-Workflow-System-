import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import {
  Appointment,
  AppointmentStatus,
  AppointmentType,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../../core/models/appointment.model';
import { ToastrService } from 'ngx-toastr';
import { SearchableSelectComponent } from '../../../shared/components/searchable-select/searchable-select.component';
import {
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { CaseService } from '../../../core/services/case.service';
import { Case } from '../../../core/models/case.model';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';
import { SpecialtyService } from '../../../core/services/specialty.service';
import { Specialty } from '../../../core/models/specialty.model';
import { PracticeLocationService } from '../../../core/services/practice-location.service';
import { PracticeLocation } from '../../../core/models/practice-location.model';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

interface CaseOption extends Case {
  display_label: string;
}

interface DoctorOption {
  id: string;
  doctor_name: string;
  display_label: string;
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableSelectComponent],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent implements OnInit, OnChanges {
  @Input() appointmentToEdit: Appointment | null = null;
  @Output() formSuccess = new EventEmitter<Appointment>();
  @Output() formCancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly caseService = inject(CaseService);
  private readonly patientService = inject(PatientService);
  private readonly specialtyService = inject(SpecialtyService);
  private readonly practiceLocationService = inject(PracticeLocationService);
  private readonly location = inject(Location);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  private readonly searchableSelectPageSize =
    environment.searchableSelectPageSize;
  private readonly filterDebounceMs = environment.filterDebounceMs;

  cases$ = new Subject<CaseOption[]>();
  casesLoading = false;
  caseSearchInput$ = new Subject<string>();

  patients$ = new Subject<Patient[]>();
  patientsLoading = false;
  patientSearchInput$ = new Subject<string>();

  doctors$ = new Subject<DoctorOption[]>();
  doctorsLoading = false;
  doctorSearchInput$ = new Subject<string>();

  specialties$ = new Subject<Specialty[]>();
  specialtiesLoading = false;
  specialtySearchInput$ = new Subject<string>();

  practiceLocations$ = new Subject<PracticeLocation[]>();
  locationsLoading = false;
  locationSearchInput$ = new Subject<string>();

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

  readonly doctorStatusOptions: AppointmentStatus[] = [
    'Checked In',
    'In Progress',
    'Completed',
  ];

  isSubmitting = false;

  private readonly fieldLabels: Record<string, string> = {
    case_id: 'Case',
    patient_id: 'Patient',
    doctor_id: 'Doctor',
    appointment_date: 'Date',
    appointment_time: 'Time',
    appointment_type: 'Type',
    specialty_id: 'Specialty',
    practice_location_id: 'Practice location',
    duration_minutes: 'Duration',
    reason_for_visit: 'Reason for visit',
    notes: 'Notes',
    status: 'Status',
  };

  form = this.fb.group({
    case_id: ['', [Validators.required]],
    patient_id: ['', [Validators.required]],
    doctor_id: ['', [Validators.required]],
    appointment_date: ['', [Validators.required]],
    appointment_time: ['', [Validators.required]],
    appointment_type: ['New Patient' as AppointmentType, [Validators.required]],
    specialty_id: ['', [Validators.required]],
    practice_location_id: ['', [Validators.required]],
    duration_minutes: [
      30,
      [Validators.required, Validators.min(5), Validators.max(480)],
    ],
    reason_for_visit: ['', [Validators.required, Validators.minLength(10)]],
    notes: ['', [Validators.maxLength(500)]],
    status: ['' as AppointmentStatus | ''],
  });

  ngOnInit(): void {
    this.setupCaseSearch();
    this.setupPatientSearch();
    this.setupDoctorSearch();
    this.setupSpecialtySearch();
    this.setupLocationSearch();

    if (this.appointmentToEdit) {
      this.patchFormValues();
      this.form.get('case_id')?.disable();
      this.form.get('patient_id')?.disable();
    } else {
      this.form.get('case_id')?.enable();
      this.form.get('patient_id')?.enable();
    }

    if (this.doctorStatusOnlyMode) {
      this.form.get('status')?.setValidators([Validators.required]);
      this.form.get('status')?.updateValueAndValidity({ emitEvent: false });

      Object.keys(this.form.controls).forEach((key) => {
        if (key !== 'status') {
          this.form.get(key)?.disable({ emitEvent: false });
        }
      });
    }

    this.loadCases('');
    this.loadPatients('');
    this.loadDoctors('');
    this.loadSpecialties('');
    this.loadLocations('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointmentToEdit'] && this.appointmentToEdit && this.form) {
      this.patchFormValues();
      this.form.get('case_id')?.disable();
      this.form.get('patient_id')?.disable();
    }
  }

  get isEditMode(): boolean {
    return !!this.appointmentToEdit;
  }

  get isDoctorRole(): boolean {
    return this.authService.isDoctor();
  }

  get doctorStatusOnlyMode(): boolean {
    return this.isEditMode && this.isDoctorRole;
  }

  private patchFormValues(): void {
    if (!this.appointmentToEdit) {
      return;
    }

    this.seedSelectOptionsFromInitialData();

    this.form.patchValue({
      case_id: this.appointmentToEdit.case_id,
      patient_id: this.appointmentToEdit.patient_id,
      doctor_id: this.appointmentToEdit.doctor_id,
      appointment_date: this.appointmentToEdit.appointment_date,
      appointment_time: this.normalizeTime(
        this.appointmentToEdit.appointment_time,
      ),
      appointment_type: this.appointmentToEdit.appointment_type,
      specialty_id: this.appointmentToEdit.specialty_id,
      practice_location_id: this.appointmentToEdit.practice_location_id,
      duration_minutes: this.appointmentToEdit.duration_minutes,
      reason_for_visit: this.appointmentToEdit.reason_for_visit,
      notes: this.appointmentToEdit.notes,
      status: this.appointmentToEdit.status,
    });
  }

  private seedSelectOptionsFromInitialData(): void {
    if (!this.appointmentToEdit) {
      return;
    }

    const patientName = this.appointmentToEdit.patient_name || 'Patient';
    const [firstName, ...lastNameParts] = patientName.split(' ');

    const caseOption: CaseOption = {
      id: this.appointmentToEdit.case_id,
      case_number: this.appointmentToEdit.case_number || 'Selected case',
      patient_id: this.appointmentToEdit.patient_id,
      practice_location_id: this.appointmentToEdit.practice_location_id,
      category: 'General Medicine' as any,
      purpose_of_visit: this.appointmentToEdit.reason_for_visit,
      case_type: 'Initial Consultation' as any,
      priority: 'Normal' as any,
      case_status: 'Active' as any,
      opening_date: this.appointmentToEdit.appointment_date,
      display_label: this.appointmentToEdit.case_number
        ? `${this.appointmentToEdit.case_number} • ${patientName}`
        : 'Selected case',
    };

    const patientOption: Patient = {
      id: this.appointmentToEdit.patient_id,
      first_name: firstName || 'Patient',
      last_name: lastNameParts.join(' '),
      middle_name: null,
      date_of_birth: '-',
      gender: 'other' as any,
      patient_status: 'active' as any,
      registration_date: new Date().toISOString(),
      email: null,
      phone: null,
      mobile: null,
      address: null,
      city: null,
      state: null,
      zip_code: null,
      country: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      primary_physician: null,
      insurance_provider: null,
      insurance_policy_number: null,
      preferred_language: undefined,
      created_at: undefined,
      updated_at: undefined,
      deleted_at: null,
    };

    const doctorName = this.appointmentToEdit.doctor_name || 'Selected doctor';
    const specialtyName = this.appointmentToEdit.specialty_name || '';
    const doctorOption: DoctorOption = {
      id: this.appointmentToEdit.doctor_id,
      doctor_name: doctorName,
      display_label: specialtyName
        ? `${doctorName} • ${specialtyName}`
        : doctorName,
    };

    const specialtyOption: Specialty = {
      id: this.appointmentToEdit.specialty_id,
      specialty_name:
        this.appointmentToEdit.specialty_name || 'Selected specialty',
      is_active: true,
    };

    const locationOption: PracticeLocation = {
      id: this.appointmentToEdit.practice_location_id,
      location_name:
        this.appointmentToEdit.practice_location_name || 'Selected location',
      address: '-',
      city: '-',
      state: '-',
      zip: '-',
      phone: '-',
      email: '-',
      is_active: true,
    };

    this.cases$.next([caseOption]);
    this.patients$.next([patientOption]);
    this.doctors$.next([doctorOption]);
    this.specialties$.next([specialtyOption]);
    this.practiceLocations$.next([locationOption]);
  }

  private normalizeTime(value?: string | null): string {
    if (!value) return '';
    return value.length >= 5 ? value.slice(0, 5) : value;
  }

  private mapCaseOptions(cases: Case[]): CaseOption[] {
    return cases.map((caseItem: any) => {
      const patientName = caseItem.patient
        ? `${caseItem.patient.first_name} ${caseItem.patient.last_name}`
        : caseItem.patient_name || '';

      return {
        ...caseItem,
        display_label: patientName
          ? `${caseItem.case_number} • ${patientName}`
          : caseItem.case_number,
      } as CaseOption;
    });
  }

  private mapDoctorOptions(appointments: Appointment[]): DoctorOption[] {
    const unique = new Map<string, DoctorOption>();

    appointments.forEach((appointment) => {
      if (!appointment.doctor_id || !appointment.doctor_name) {
        return;
      }

      unique.set(appointment.doctor_id, {
        id: appointment.doctor_id,
        doctor_name: appointment.doctor_name,
        display_label: appointment.specialty_name
          ? `${appointment.doctor_name} • ${appointment.specialty_name}`
          : appointment.doctor_name,
      });
    });

    return Array.from(unique.values()).sort((a, b) =>
      a.doctor_name.localeCompare(b.doctor_name),
    );
  }

  private loadCases(term: string): void {
    this.caseService
      .getCases({ search: term, per_page: this.searchableSelectPageSize })
      .subscribe((response) => {
        this.cases$.next(this.mapCaseOptions(response.data));
      });
  }

  private loadPatients(term: string): void {
    this.patientService
      .getPatients({ search: term, per_page: this.searchableSelectPageSize })
      .subscribe((response) => {
        this.patients$.next(response.data);
      });
  }

  private loadDoctors(term: string): void {
    this.appointmentService
      .getAppointments({
        doctor_name: term,
        per_page: this.searchableSelectPageSize,
      })
      .subscribe((response) => {
        this.doctors$.next(this.mapDoctorOptions(response.data));
      });
  }

  private loadSpecialties(term: string): void {
    this.specialtyService
      .getSpecialties({
        search: term,
        per_page: this.searchableSelectPageSize,
      })
      .subscribe((response) => {
        this.specialties$.next(response.data);
      });
  }

  private loadLocations(term: string): void {
    this.practiceLocationService
      .getPracticeLocations({
        search: term,
        per_page: this.searchableSelectPageSize,
      })
      .subscribe((response) => {
        this.practiceLocations$.next(response.data);
      });
  }

  private setupCaseSearch(): void {
    this.caseSearchInput$
      .pipe(
        debounceTime(this.filterDebounceMs),
        distinctUntilChanged(),
        tap(() => (this.casesLoading = true)),
        switchMap((term) =>
          this.caseService
            .getCases({ search: term, per_page: this.searchableSelectPageSize })
            .pipe(
              catchError(() => of({ data: [] as Case[] } as any)),
              tap(() => (this.casesLoading = false)),
            ),
        ),
      )
      .subscribe((response: any) => {
        this.cases$.next(this.mapCaseOptions(response.data || []));
      });
  }

  private setupPatientSearch(): void {
    this.patientSearchInput$
      .pipe(
        debounceTime(this.filterDebounceMs),
        distinctUntilChanged(),
        tap(() => (this.patientsLoading = true)),
        switchMap((term) =>
          this.patientService
            .getPatients({
              search: term,
              per_page: this.searchableSelectPageSize,
            })
            .pipe(
              catchError(() => of({ data: [] as Patient[] } as any)),
              tap(() => (this.patientsLoading = false)),
            ),
        ),
      )
      .subscribe((response: any) => {
        this.patients$.next(response.data || []);
      });
  }

  private setupDoctorSearch(): void {
    this.doctorSearchInput$
      .pipe(
        debounceTime(this.filterDebounceMs),
        distinctUntilChanged(),
        tap(() => (this.doctorsLoading = true)),
        switchMap((term) =>
          this.appointmentService
            .getAppointments({
              doctor_name: term,
              per_page: this.searchableSelectPageSize,
            })
            .pipe(
              catchError(() => of({ data: [] as Appointment[] } as any)),
              tap(() => (this.doctorsLoading = false)),
            ),
        ),
      )
      .subscribe((response: any) => {
        this.doctors$.next(this.mapDoctorOptions(response.data || []));
      });
  }

  private setupSpecialtySearch(): void {
    this.specialtySearchInput$
      .pipe(
        debounceTime(this.filterDebounceMs),
        distinctUntilChanged(),
        tap(() => (this.specialtiesLoading = true)),
        switchMap((term) =>
          this.specialtyService
            .getSpecialties({
              search: term,
              per_page: this.searchableSelectPageSize,
            })
            .pipe(
              catchError(() => of({ data: [] as Specialty[] } as any)),
              tap(() => (this.specialtiesLoading = false)),
            ),
        ),
      )
      .subscribe((response: any) => {
        this.specialties$.next(response.data || []);
      });
  }

  private setupLocationSearch(): void {
    this.locationSearchInput$
      .pipe(
        debounceTime(this.filterDebounceMs),
        distinctUntilChanged(),
        tap(() => (this.locationsLoading = true)),
        switchMap((term) =>
          this.practiceLocationService
            .getPracticeLocations({
              search: term,
              per_page: this.searchableSelectPageSize,
            })
            .pipe(
              catchError(() => of({ data: [] as PracticeLocation[] } as any)),
              tap(() => (this.locationsLoading = false)),
            ),
        ),
      )
      .subscribe((response: any) => {
        this.practiceLocations$.next(response.data || []);
      });
  }

  onCaseSearch(term: string | Event): void {
    this.caseSearchInput$.next(typeof term === 'string' ? term : '');
  }

  onPatientSearch(term: string | Event): void {
    this.patientSearchInput$.next(typeof term === 'string' ? term : '');
  }

  onDoctorSearch(term: string | Event): void {
    this.doctorSearchInput$.next(typeof term === 'string' ? term : '');
  }

  onSpecialtySearch(term: string | Event): void {
    this.specialtySearchInput$.next(typeof term === 'string' ? term : '');
  }

  onLocationSearch(term: string | Event): void {
    this.locationSearchInput$.next(typeof term === 'string' ? term : '');
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors || !(control.dirty || control.touched)) {
      return '';
    }

    const label = this.fieldLabels[controlName] || 'This field';
    const errors = control.errors;

    if (errors['required']) {
      return `${label} is required.`;
    }

    if (errors['minlength']) {
      return `${label} must be at least ${errors['minlength'].requiredLength} characters.`;
    }

    if (errors['maxlength']) {
      return `${label} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
    }

    if (errors['min']) {
      return `${label} must be at least ${errors['min'].min}.`;
    }

    if (errors['max']) {
      return `${label} cannot exceed ${errors['max'].max}.`;
    }

    return `${label} is invalid.`;
  }

  onCancel(): void {
    if (this.formCancel.observed) {
      this.formCancel.emit();
    } else {
      //INFO: Navigate back to the previous screen (respects role-based routes)
      this.location.back();
    }
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    if (this.doctorStatusOnlyMode && this.appointmentToEdit) {
      const updatePayload: UpdateAppointmentPayload = {
        status: value.status as AppointmentStatus,
      };

      this.isSubmitting = true;

      this.appointmentService
        .updateAppointment(this.appointmentToEdit.id, updatePayload)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.formSuccess.emit(response.data.appointment);
            if (!this.formSuccess.observed) {
              this.location.back();
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            const errorMsg =
              error?.error?.message || 'Failed to update appointment status';
            this.toastr.error(errorMsg);
          },
        });

      return;
    }

    const payload: CreateAppointmentPayload = {
      case_id: value.case_id || '',
      patient_id: value.patient_id || '',
      doctor_id: value.doctor_id || '',
      appointment_date: value.appointment_date || '',
      appointment_time: value.appointment_time || '',
      appointment_type: (value.appointment_type ||
        'New Patient') as AppointmentType,
      specialty_id: value.specialty_id || '',
      practice_location_id: value.practice_location_id || '',
      duration_minutes: value.duration_minutes || 30,
      reason_for_visit: value.reason_for_visit?.trim() || '',
      notes: value.notes?.trim() || undefined,
    };

    this.isSubmitting = true;

    if (this.isEditMode && this.appointmentToEdit) {
      const updatePayload: UpdateAppointmentPayload = {
        doctor_id: value.doctor_id || undefined,
        appointment_date: value.appointment_date || undefined,
        appointment_time: value.appointment_time || undefined,
        appointment_type:
          (value.appointment_type as AppointmentType | undefined) || undefined,
        specialty_id: value.specialty_id || undefined,
        practice_location_id: value.practice_location_id || undefined,
        duration_minutes: value.duration_minutes || undefined,
        reason_for_visit: value.reason_for_visit?.trim() || undefined,
        notes: value.notes?.trim() || undefined,
      };

      this.appointmentService
        .updateAppointment(this.appointmentToEdit.id, updatePayload)
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.formSuccess.emit(response.data.appointment);
            if (!this.formSuccess.observed) {
              this.location.back();
            }
          },
          error: (error) => {
            this.isSubmitting = false;
            const errorMsg =
              error?.error?.message || 'Failed to update appointment';
            this.toastr.error(errorMsg);
          },
        });
    } else {
      //INFO: Create new appointment
      this.appointmentService.createAppointment(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.formSuccess.emit(response.data.appointment);
          if (!this.formSuccess.observed) {
            this.location.back();
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          const errorMsg =
            error?.error?.message || 'Failed to create appointment';
          this.toastr.error(errorMsg);
        },
      });
    }
  }
}
