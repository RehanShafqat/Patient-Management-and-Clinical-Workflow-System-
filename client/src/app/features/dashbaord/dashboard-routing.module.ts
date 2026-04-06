import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FdoDashboardComponent } from './fdo-dashboard/fdo-dashboard.component';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { adminGuard } from '../../core/guards/auth.guard';
import { fdoGuard } from '../../core/guards/auth.guard';
import { doctorGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
  },
  { path: 'fdo', component: FdoDashboardComponent, canActivate: [fdoGuard] },
  {
    path: 'doctor',
    component: DoctorDashboardComponent,
    canActivate: [doctorGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
