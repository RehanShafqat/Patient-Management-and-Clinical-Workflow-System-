import { CommonModule, Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/services/appointment.service';
import {
  Appointment,
  AppointmentType,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from '../../../core/models/appointment.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent implements OnInit {
  //INFO: Input for the appointment to edit. If null, component is in 'Create' mode.
  @Input() appointmentToEdit: Appointment | null = null;

  //INFO: EventEmitter to notify parent when operation is successful
  @Output() formSuccess = new EventEmitter<Appointment>();

  //INFO: EventEmitter to handle cancellations (especially in modals)
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private location = inject(Location);
  private toastr = inject(ToastrService);

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

  isSubmitting = false;

  //INFO: Form definition with validation rules matching backend schemas
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
  });

  ngOnInit(): void {
    //INFO: If in edit mode, patch the form with the appointment's existing data
    if (this.appointmentToEdit) {
      this.form.patchValue({
        case_id: this.appointmentToEdit.case_id,
        patient_id: this.appointmentToEdit.patient_id,
        doctor_id: this.appointmentToEdit.doctor_id,
        appointment_date: this.appointmentToEdit.appointment_date,
        appointment_time: this.appointmentToEdit.appointment_time,
        appointment_type: this.appointmentToEdit.appointment_type,
        specialty_id: this.appointmentToEdit.specialty_id,
        practice_location_id: this.appointmentToEdit.practice_location_id,
        duration_minutes: this.appointmentToEdit.duration_minutes,
        reason_for_visit: this.appointmentToEdit.reason_for_visit,
        notes: this.appointmentToEdit.notes,
      });

      //INFO: In edit mode, disable the case and patient fields
      this.form.get('case_id')?.disable();
      this.form.get('patient_id')?.disable();
    }
  }

  get isEditMode(): boolean {
    return !!this.appointmentToEdit;
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onCancel(): void {
    if (this.isEditMode) {
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

    //INFO: Construct payload
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
      //INFO: Update existing appointment
      this.appointmentService
        .updateAppointment(
          this.appointmentToEdit.id,
          payload as UpdateAppointmentPayload,
        )
        .subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.formSuccess.emit(response.data.appointment);
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
