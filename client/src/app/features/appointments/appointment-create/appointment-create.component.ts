import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from '../../../core/models/appointment.model';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, AppointmentFormComponent],
  templateUrl: './appointment-create.component.html',
})
export class AppointmentCreateComponent {
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  onSuccess(createdAppointment: Appointment): void {
    const rolePrefix = this.router.url.split('/')[1] || 'admin';
    this.toastr.success('Appointment scheduled successfully');
    this.router.navigate([`/${rolePrefix}/appointments`]);
  }

  onCancel(): void {
    const rolePrefix = this.router.url.split('/')[1] || 'admin';
    this.router.navigate([`/${rolePrefix}/appointments`]);
  }
}
