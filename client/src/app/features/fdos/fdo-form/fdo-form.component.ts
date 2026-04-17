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
  @Output() formSuccess = new EventEmitter<FdoUser>();
  @Output() formCancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly fdoService = inject(FdoService);
  private readonly toastr = inject(ToastrService);

  loading = false;
  isSubmitting = false;

  currentFdo: FdoUser | null = null;
  permissionGroups: PermissionGroup[] = [];
  private selectedPermissionIds = new Set<string>();

  form = this.fb.group({
    first_name: ['', [Validators.required, Validators.minLength(2)]],
    last_name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
    is_active: [true, [Validators.required]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fdoId'] && this.fdoId) {
      this.loadForm(this.fdoId);
    }
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
      return;
    }

    this.selectedPermissionIds.delete(permissionId);
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
    if (!this.currentFdo) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: UpdateFdoPayload = {
      role: 'fdo',
      first_name: value.first_name?.trim(),
      last_name: value.last_name?.trim(),
      phone: value.phone?.trim() || null,
      is_active: !!value.is_active,
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
