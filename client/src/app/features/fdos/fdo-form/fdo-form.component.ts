import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  CreateFdoPayload,
  FdoPermissionOption,
  FdoUser,
  UpdateFdoPayload,
} from '../../../core/models/fdo.model';
import { FdoService } from '../../../core/services/fdo.service';

interface PermissionGroup {
  key: string;
  title: string;
  permissions: FdoPermissionOption[];
}

@Component({
  selector: 'app-fdo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fdo-form.component.html',
})
export class FdoFormComponent implements OnChanges {
  @Input() fdoId: string | null = null;
  @Input() mode: 'create' | 'edit' = 'edit';
  @Output() formSuccess = new EventEmitter<FdoUser>();
  @Output() formCancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly fdoService = inject(FdoService);
  private readonly toastr = inject(ToastrService);

  loading = false;
  isSubmitting = false;
  permissionTouched = false;

  private readonly fieldLabels: Record<string, string> = {
    first_name: 'First name',
    last_name: 'Last name',
    email: 'Email',
    password: 'Password',
    phone: 'Phone',
    is_active: 'Status',
  };

  currentFdo: FdoUser | null = null;
  permissionGroups: PermissionGroup[] = [];
  private selectedPermissionIds = new Set<string>();

  form = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(100)],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(100)],
    ],
    phone: ['', [Validators.required, Validators.maxLength(20)]],
    is_active: [true, [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    this.applyModeValidators();

    if (this.mode === 'create') {
      this.currentFdo = null;
      this.form.reset({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone: '',
        is_active: true,
      });
      this.selectedPermissionIds = new Set<string>();
      this.permissionTouched = false;
      this.loadPermissionsOnly();
      return;
    }

    if ((changes['fdoId'] || changes['mode']) && this.fdoId) {
      this.loadForm(this.fdoId);
    }
  }

  private applyModeValidators(): void {
    const emailControl = this.form.get('email');
    const passwordControl = this.form.get('password');

    if (!emailControl || !passwordControl) {
      return;
    }

    if (this.mode === 'create') {
      emailControl.setValidators([
        Validators.required,
        Validators.email,
        Validators.maxLength(100),
      ]);
      passwordControl.setValidators([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]);
      emailControl.enable({ emitEvent: false });
      passwordControl.enable({ emitEvent: false });
    } else {
      emailControl.clearValidators();
      passwordControl.setValidators([
        Validators.minLength(6),
        Validators.maxLength(100),
      ]);
      emailControl.setValue('', { emitEvent: false });
      passwordControl.setValue('', { emitEvent: false });
      emailControl.disable({ emitEvent: false });
      passwordControl.enable({ emitEvent: false });
    }

    emailControl.updateValueAndValidity({ emitEvent: false });
    passwordControl.updateValueAndValidity({ emitEvent: false });
  }

  private loadPermissionsOnly(): void {
    this.loading = true;

    this.fdoService.getPermissions().subscribe({
      next: (response) => {
        this.permissionGroups = this.buildPermissionGroups(
          response.data.permissions,
        );
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private loadForm(id: string): void {
    this.loading = true;

    forkJoin({
      fdoResponse: this.fdoService.getFdoById(id),
      permissionResponse: this.fdoService.getPermissions(),
    }).subscribe({
      next: ({ fdoResponse, permissionResponse }) => {
        this.currentFdo = fdoResponse.data.user;

        const assigned = this.currentFdo.userPermissions?.map(
          (item) => item.permission_id,
        );

        this.selectedPermissionIds = new Set(assigned || []);
        this.permissionGroups = this.buildPermissionGroups(
          permissionResponse.data.permissions,
        );

        this.form.patchValue({
          first_name: this.currentFdo.first_name,
          last_name: this.currentFdo.last_name,
          phone: this.currentFdo.phone || '',
          is_active: this.currentFdo.is_active,
          email: this.currentFdo.email || '',
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private buildPermissionGroups(
    permissions: FdoPermissionOption[],
  ): PermissionGroup[] {
    const groupMap = new Map<string, PermissionGroup>();

    permissions.forEach((permission) => {
      const groupKey = permission.permission_name.split('_')[1] || 'general';

      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, {
          key: groupKey,
          title: this.toTitleCase(groupKey),
          permissions: [],
        });
      }

      groupMap.get(groupKey)!.permissions.push(permission);
    });

    return Array.from(groupMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title),
    );
  }

  togglePermission(permissionId: string, checked: boolean): void {
    if (checked) {
      this.selectedPermissionIds.add(permissionId);
      this.permissionTouched = true;
      return;
    }

    this.selectedPermissionIds.delete(permissionId);
    this.permissionTouched = true;
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissionIds.has(permissionId);
  }

  get selectedPermissionsCount(): number {
    return this.selectedPermissionIds.size;
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    this.permissionTouched = true;

    if (this.form.invalid) {
      return;
    }

    if (this.selectedPermissionIds.size === 0) {
      return;
    }

    const value = this.form.getRawValue();

    if (this.mode === 'create') {
      const payload: CreateFdoPayload = {
        role: 'fdo',
        first_name: (value.first_name || '').trim(),
        last_name: (value.last_name || '').trim(),
        email: (value.email || '').trim(),
        password: value.password || '',
        phone: (value.phone || '').trim(),
        is_active: !!value.is_active,
        permissions: Array.from(this.selectedPermissionIds),
      };

      this.isSubmitting = true;
      this.fdoService.createFdo(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.toastr.success('FDO created successfully');
          this.formSuccess.emit(response.data.user);
        },
        error: () => {
          this.isSubmitting = false;
        },
      });
      return;
    }

    if (!this.currentFdo) {
      return;
    }

    const payload: UpdateFdoPayload = {
      role: 'fdo',
      first_name: value.first_name?.trim(),
      last_name: value.last_name?.trim(),
      phone: value.phone?.trim() || null,
      is_active: !!value.is_active,
      ...(value.password ? { password: value.password } : {}),
      permissions: Array.from(this.selectedPermissionIds),
    };

    this.isSubmitting = true;

    this.fdoService.updateFdo(this.currentFdo.id, payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.toastr.success('FDO updated successfully');
        this.formSuccess.emit(response.data.user);
      },
      error: () => {
        this.isSubmitting = false;
      },
    });
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

    if (errors['email']) {
      return 'Please enter a valid email address.';
    }

    if (errors['minlength']) {
      return `${label} must be at least ${errors['minlength'].requiredLength} characters.`;
    }

    if (errors['maxlength']) {
      return `${label} cannot exceed ${errors['maxlength'].requiredLength} characters.`;
    }

    return `${label} is invalid.`;
  }

  get isPermissionInvalid(): boolean {
    return this.permissionTouched && this.selectedPermissionIds.size === 0;
  }

  permissionActionLabel(permissionName: string): string {
    const action = permissionName.split('_')[0] || permissionName;
    return this.toTitleCase(action);
  }

  permissionTargetLabel(permissionName: string): string {
    const parts = permissionName.split('_').slice(1);
    return this.toTitleCase(parts.join(' '));
  }

  private toTitleCase(value: string): string {
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}
