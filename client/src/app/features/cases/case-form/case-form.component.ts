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
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SearchableSelectComponent } from '../../../shared/components/searchable-select/searchable-select.component';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { PatientService } from '../../../core/services/patient.service';
import { PracticeLocationService } from '../../../core/services/practice-location.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { FirmService } from '../../../core/services/firm.service';
import { CaseService } from '../../../core/services/case.service';
import { ToastrService } from 'ngx-toastr';
import {
  Case,
  CaseCategory,
  CasePriority,
  CaseStatus,
  CaseType,
} from '../../../core/models/case.model';
import { Patient } from '../../../core/models/patient.model';
import { PracticeLocation } from '../../../core/models/practice-location.model';
import { Insurance } from '../../../core/models/insurance.model';
import { Firm } from '../../../core/models/firm.model';

@Component({
  selector: 'app-case-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchableSelectComponent],
  templateUrl: './case-form.component.html',
})
export class CaseFormComponent implements OnInit, OnChanges {
  @Input() caseMode: 'create' | 'edit' = 'create';
  @Input() initialData: Case | null = null;
  @Output() formSuccess = new EventEmitter<Case>();
  @Output() formCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private patientService = inject(PatientService);
  private practiceLocationService = inject(PracticeLocationService);
  private insuranceService = inject(InsuranceService);
  private firmService = inject(FirmService);
  private caseService = inject(CaseService);
  private toastr = inject(ToastrService);

  caseForm!: FormGroup;
  isSubmitting = false;

  // Enums for Selects
  caseCategories = Object.values(CaseCategory);
  caseTypes = Object.values(CaseType);
  casePriorities = Object.values(CasePriority);

  // ng-select Data Sources
  patients$ = new Subject<Patient[]>();
  patientsLoading = false;
  patientSearchInput$ = new Subject<string>();

  practiceLocations$ = new Subject<PracticeLocation[]>();
  locationsLoading = false;
  locationSearchInput$ = new Subject<string>();

  insurances$ = new Subject<Insurance[]>();
  insurancesLoading = false;
  insuranceSearchInput$ = new Subject<string>();

  firms$ = new Subject<Firm[]>();
  firmsLoading = false;
  firmSearchInput$ = new Subject<string>();

  ngOnInit() {
    this.initForm();
    this.setupPatientSearch();
    this.setupLocationSearch();
    this.setupInsuranceSearch();
    this.setupFirmSearch();

    // Load initial empty searches to populate default list
    this.loadPatients('');
    this.loadLocations('');
    this.loadInsurances('');
    this.loadFirms('');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData) {
      this.patchFormValues();
    }
  }

  private initForm() {
    this.caseForm = this.fb.group({
      patient_id: [null, Validators.required],
      practice_location_id: [null, Validators.required],
      category: [null, Validators.required],
      case_type: [null, Validators.required],
      priority: [CasePriority.NORMAL, Validators.required],
      purpose_of_visit: ['', Validators.required],
      date_of_accident: [null],
      insurance_id: [null],
      firm_id: [null],
      referred_by: [''],
      referred_doctor_name: [''],
      opening_date: [new Date().toISOString().split('T')[0]],
      closing_date: [null],
      clinical_notes: [''],
    });
  }

  private patchFormValues() {
    if (this.caseForm && this.initialData) {
      // Need to pre-populate ng-select subjects if we only have IDs, 
      // but usually the backend returns relations, so we might need to handle them.
      // If we have relations, let's inject them into streams as initial values so ng-select displays them properly
      if (this.initialData.patient) {
        this.patients$.next([this.initialData.patient]);
      }
      if (this.initialData.practiceLocation) {
        this.practiceLocations$.next([this.initialData.practiceLocation]);
      }
      if (this.initialData.insurance) {
        this.insurances$.next([this.initialData.insurance]);
      }
      if (this.initialData.firm) {
        this.firms$.next([this.initialData.firm]);
      }

      this.caseForm.patchValue({
        patient_id: this.initialData.patient_id,
        practice_location_id: this.initialData.practice_location_id,
        category: this.initialData.category,
        case_type: this.initialData.case_type,
        priority: this.initialData.priority || CasePriority.NORMAL,
        purpose_of_visit: this.initialData.purpose_of_visit,
        date_of_accident: this.initialData.date_of_accident,
        insurance_id: this.initialData.insurance_id,
        firm_id: this.initialData.firm_id,
        referred_by: this.initialData.referred_by,
        referred_doctor_name: this.initialData.referred_doctor_name,
        opening_date: this.initialData.opening_date,
        closing_date: this.initialData.closing_date,
        clinical_notes: this.initialData.clinical_notes,
      });
    }
  }

  // Search Loaders
  private loadPatients(term: string) {
    this.playersPatientSearch(term);
  }
  private playersPatientSearch(term: string) {
      this.patientService.getPatients({ search: term, per_page: 20 }).subscribe(res => {
         this.patients$.next(res.data);
      });
  }

  private loadLocations(term: string) {
      this.practiceLocationService.getPracticeLocations({ search: term, per_page: 20 }).subscribe(res => {
         this.practiceLocations$.next(res.data);
      });
  }

  private loadInsurances(term: string) {
      this.insuranceService.getInsurances({ search: term, per_page: 20 }).subscribe(res => {
         this.insurances$.next(res.data);
      });
  }

  private loadFirms(term: string) {
      this.firmService.getFirms({ search: term, per_page: 20 }).subscribe(res => {
         this.firms$.next(res.data);
      });
  }


  // RxJS Setup for Debounced Typeaheads
  private setupPatientSearch() {
    this.patientSearchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.patientsLoading = true)),
        switchMap((term) =>
          this.patientService.getPatients({ search: term, per_page: 20 }).pipe(
            catchError(() => of({ data: [] })),
            tap(() => (this.patientsLoading = false))
          )
        )
      )
      .subscribe((res: any) => {
        this.patients$.next(res.data);
      });
  }

  private setupLocationSearch() {
    this.locationSearchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.locationsLoading = true)),
        switchMap((term) =>
          this.practiceLocationService.getPracticeLocations({ search: term, per_page: 20 }).pipe(
            catchError(() => of({ data: [] })),
            tap(() => (this.locationsLoading = false))
          )
        )
      )
      .subscribe((res: any) => {
        this.practiceLocations$.next(res.data);
      });
  }

  private setupInsuranceSearch() {
    this.insuranceSearchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.insurancesLoading = true)),
        switchMap((term) =>
          this.insuranceService.getInsurances({ search: term, per_page: 20 }).pipe(
            catchError(() => of({ data: [] })),
            tap(() => (this.insurancesLoading = false))
          )
        )
      )
      .subscribe((res: any) => {
        this.insurances$.next(res.data);
      });
  }

  private setupFirmSearch() {
    this.firmSearchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => (this.firmsLoading = true)),
        switchMap((term) =>
          this.firmService.getFirms({ search: term, per_page: 20 }).pipe(
            catchError(() => of({ data: [] })),
            tap(() => (this.firmsLoading = false))
          )
        )
      )
      .subscribe((res: any) => {
        this.firms$.next(res.data);
      });
  }

  clearFields() {
    this.caseForm.reset({
      priority: CasePriority.NORMAL,
      opening_date: new Date().toISOString().split('T')[0],
    });
  }

  onCancel() {
    this.formCancel.emit();
  }

  onSubmit() {
    if (this.caseForm.invalid) {
      this.caseForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.');
      return;
    }

    this.isSubmitting = true;
    const payload = this.caseForm.value;

    if (this.caseMode === 'create') {
      this.caseService.createCase(payload).subscribe({
        next: (res) => {
          this.toastr.success('Case created successfully');
          this.isSubmitting = false;
          this.formSuccess.emit(res.data.case);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error(err.error?.message || 'Failed to create case');
        },
      });
    } else if (this.caseMode === 'edit' && this.initialData) {
      this.caseService.updateCase(this.initialData.id, payload).subscribe({
        next: (res) => {
          this.toastr.success('Case updated successfully');
          this.isSubmitting = false;
          this.formSuccess.emit(res.data.case);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error(err.error?.message || 'Failed to update case');
        },
      });
    }
  }

  get patientControl() {
    return this.caseForm.get('patient_id');
  }

  get locationControl() {
    return this.caseForm.get('practice_location_id');
  }
}
