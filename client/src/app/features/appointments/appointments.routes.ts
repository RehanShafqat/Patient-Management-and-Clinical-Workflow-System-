import { Routes } from '@angular/router';
import { AppointmentListComponent } from './appointment-list/appointment-list.component';

export const appointmentsRoutes: Routes = [
  {
    path: '',
    component: AppointmentListComponent,
    data: { title: 'Appointments' },
  },
  // You can add appointment detail route here when ready
  // {
  //   path: ':id',
  //   component: AppointmentDetailComponent,
  //   data: { title: 'Appointment Detail' },
  // },
];
