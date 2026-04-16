import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import {
  CreatePatientPayload,
  Gender,
  PatientStatus,
} from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.css'],
})
export class PatientFormComponent {
  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);

  readonly phoneRegex = /^(\+?\d{1,3}[-.\s]?)?\d{1,4}[-.\s]?\d{3}[-.\s]?\d{4}$/;

  readonly genderOptions: Array<{ label: string; value: Gender }> = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer Not To Say', value: 'prefer_not_to_say' },
  ];

  readonly patientStatusOptions: Array<{
    label: string;
    value: PatientStatus;
  }> = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Deceased', value: 'deceased' },
    { label: 'Transferred', value: 'transferred' },
  ];

  readonly countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
    'Pakistan',
    'Other'
  ];

  readonly states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'Other'
  ];

  currentStep = 1;
  isSubmitting = false;

  form = this.fb.group({
    first_name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    middle_name: ['', [Validators.maxLength(50)]],
    last_name: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    ],
    date_of_birth: ['', [Validators.required]],
    gender: ['male' as Gender, [Validators.required]],
    ssn: ['', [Validators.pattern(/^\d{3}-\d{2}-\d{4}$/)]],

    email: ['', [Validators.email]],
    phone: ['', [Validators.pattern(this.phoneRegex)]],
    mobile: ['', [Validators.pattern(this.phoneRegex)]],
    address: ['', [Validators.maxLength(100)]],
    city: ['', [Validators.maxLength(50)]],
    state: ['', [Validators.maxLength(50)]],
    zip_code: ['', [Validators.pattern(/^\d{5}(-\d{4})?$/)]],
    country: ['', [Validators.maxLength(50)]],
    emergency_contact_name: ['', [Validators.maxLength(50)]],
    emergency_contact_phone: ['', [Validators.pattern(this.phoneRegex)]],

    primary_physician: ['', [Validators.maxLength(50)]],
    insurance_provider: ['', [Validators.maxLength(50)]],
    insurance_policy_number: ['', [Validators.maxLength(50)]],
    preferred_language: ['English', [Validators.maxLength(30)]],
    patient_status: ['active' as PatientStatus, [Validators.required]],
  });

  get duplicateHintVisible(): boolean {
    const value = this.form.value;
    return !!(value.first_name && value.last_name && value.date_of_birth);
  }

  get maskedSsn(): string {
    const raw = this.form.value.ssn || '';
    if (!raw || raw.length < 4) {
      return '•••-••-••••';
    }
    return `•••-••-${raw.slice(-4)}`;
  }

  private controlsForStep(step: number): string[] {
    if (step === 1) {
      return ['first_name', 'last_name', 'date_of_birth', 'gender', 'ssn'];
    }
    if (step === 2) {
      return [
        'email',
        'phone',
        'mobile',
        'address',
        'city',
        'state',
        'zip_code',
        'country',
        'emergency_contact_name',
        'emergency_contact_phone',
      ];
    }
    return ['patient_status'];
  }

  private isStepValid(step: number): boolean {
    return this.controlsForStep(step).every(
      (name) => !this.form.get(name)?.invalid,
    );
  }

  private touchStep(step: number): void {
    this.controlsForStep(step).forEach((name) => {
      this.form.get(name)?.markAsTouched();
      this.form.get(name)?.updateValueAndValidity();
    });
  }

  goToPreviousStep(): void {
    this.currentStep = Math.max(1, this.currentStep - 1);
  }

  goToNextStep(): void {
    this.touchStep(this.currentStep);
    if (!this.isStepValid(this.currentStep)) {
      return;
    }
    this.currentStep = Math.min(3, this.currentStep + 1);
  }

  selectGender(value: Gender): void {
    this.form.patchValue({ gender: value });
  }

  selectStatus(value: PatientStatus): void {
    this.form.patchValue({ patient_status: value });
  }

  isFieldInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private firstInvalidStep(): number {
    if (!this.isStepValid(1)) {
      return 1;
    }
    if (!this.isStepValid(2)) {
      return 2;
    }
    return 3;
  }

  onCancel(): void {
    this.form.reset({
      gender: 'male',
      preferred_language: 'English',
      patient_status: 'active',
    });
    this.currentStep = 1;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.currentStep = this.firstInvalidStep();
      return;
    }

    const value = this.form.getRawValue();
    const payload: CreatePatientPayload = {
      first_name: value.first_name?.trim() || '',
      middle_name: value.middle_name?.trim() || undefined,
      last_name: value.last_name?.trim() || '',
      date_of_birth: value.date_of_birth || '',
      gender: (value.gender || 'male') as Gender,
      ssn: value.ssn?.trim() || undefined,
      email: value.email?.trim() || undefined,
      phone: value.phone?.trim() || undefined,
      mobile: value.mobile?.trim() || undefined,
      address: value.address?.trim() || undefined,
      city: value.city?.trim() || undefined,
      state: value.state?.trim() || undefined,
      zip_code: value.zip_code?.trim() || undefined,
      country: value.country?.trim() || undefined,
      emergency_contact_name: value.emergency_contact_name?.trim() || undefined,
      emergency_contact_phone:
        value.emergency_contact_phone?.trim() || undefined,
      primary_physician: value.primary_physician?.trim() || undefined,
      insurance_provider: value.insurance_provider?.trim() || undefined,
      insurance_policy_number:
        value.insurance_policy_number?.trim() || undefined,
      preferred_language: value.preferred_language?.trim() || 'English',
      patient_status: (value.patient_status || 'active') as PatientStatus,
      registration_date: new Date().toISOString(),
    };

    this.isSubmitting = true;
    console.log(payload);

    // this.patientService.createPatient(payload).subscribe({
    //   next: () => {
    //     this.isSubmitting = false;
    //     this.onCancel();
    //   },
    //   error: () => {
    //     this.isSubmitting = false;
    //   },
    // });
  }
}
