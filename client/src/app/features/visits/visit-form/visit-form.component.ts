import { CommonModule } from '@angular/common';
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
import { ToastrService } from 'ngx-toastr';
import { VisitService } from '../../../core/services/visit.service';
import {
  UpdateVisitPayload,
  Visit,
  VisitStatus,
} from '../../../core/models/visit.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-visit-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './visit-form.component.html',
})
export class VisitFormComponent implements OnInit, OnChanges {
  @Input() visitToEdit: Visit | null = null;
  @Output() formSuccess = new EventEmitter<Visit>();
  @Output() formCancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly visitService = inject(VisitService);
  private readonly toastr = inject(ToastrService);
  private readonly authService = inject(AuthService);

  isSubmitting = false;

  readonly statusOptions: VisitStatus[] = [
    'Draft',
    'Completed',
    'Cancelled',
    'Billed',
  ];

  form = this.fb.group({
    visit_status: ['Draft' as VisitStatus, [Validators.required]],
    visit_duration_minutes: [null as number | null],
    diagnoses_id: [''],
    symptoms: [''],
    treatment: [''],
    treatment_plan: [''],
    prescription: [''],
    notes: [''],
    follow_up_required: [false],
    follow_up_date: [''],
    referral_made: [false],
    referral_to: [''],
  });

  ngOnInit(): void {
    this.patchFormFromInput();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visitToEdit']) {
      this.patchFormFromInput();
    }
  }

  get isDoctorRole(): boolean {
    return this.authService.isDoctor();
  }

  private patchFormFromInput(): void {
    if (!this.visitToEdit) {
      return;
    }

    this.form.patchValue({
      visit_status: this.visitToEdit.visit_status,
      visit_duration_minutes: this.visitToEdit.visit_duration_minutes ?? null,
      diagnoses_id: this.visitToEdit.diagnoses_id || '',
      symptoms: this.visitToEdit.symptoms || '',
      treatment: this.visitToEdit.treatment || '',
      treatment_plan: this.visitToEdit.treatment_plan || '',
      prescription: this.visitToEdit.prescription || '',
      notes: this.visitToEdit.notes || '',
      follow_up_required: !!this.visitToEdit.follow_up_required,
      follow_up_date: this.visitToEdit.follow_up_date || '',
      referral_made: !!this.visitToEdit.referral_made,
      referral_to: this.visitToEdit.referral_to || '',
    });
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  onSubmit(): void {
    if (!this.visitToEdit) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.isDoctorRole) {
      const payload: UpdateVisitPayload = {
        diagnoses_id: value.diagnoses_id || null,
        treatment: value.treatment?.trim() || undefined,
        prescription: value.prescription?.trim() || undefined,
        notes: value.notes?.trim() || undefined,
      };

      this.isSubmitting = true;

      this.visitService.updateVisit(this.visitToEdit.id, payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.toastr.success('Visit updated successfully');
          this.formSuccess.emit(response.data.visit);
        },
        error: () => {
          this.isSubmitting = false;
        },
      });

      return;
    }

    const payload: UpdateVisitPayload = {
      visit_status: (value.visit_status || 'Draft') as VisitStatus,
      visit_duration_minutes: value.visit_duration_minutes || undefined,
      symptoms: value.symptoms?.trim() || undefined,
      treatment: value.treatment?.trim() || undefined,
      treatment_plan: value.treatment_plan?.trim() || undefined,
      prescription: value.prescription?.trim() || undefined,
      notes: value.notes?.trim() || undefined,
      follow_up_required: !!value.follow_up_required,
      follow_up_date: value.follow_up_date || null,
      referral_made: !!value.referral_made,
      referral_to: value.referral_to?.trim() || null,
    };

    this.isSubmitting = true;

    this.visitService.updateVisit(this.visitToEdit.id, payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.toastr.success('Visit updated successfully');
        this.formSuccess.emit(response.data.visit);
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
  }
}
