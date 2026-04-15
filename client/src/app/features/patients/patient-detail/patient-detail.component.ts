import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
})
export class PatientDetailComponent {
  patient = {
    id: 'PT-2026-000145',
    first_name: 'Amelia',
    middle_name: 'Rose',
    last_name: 'Carter',
    date_of_birth: '1991-09-12',
    gender: 'female',
    patient_status: 'active',
    registration_date: '2026-04-09T10:35:00.000Z',
    email: 'amelia.carter@example.com',
    phone: '+1 212-555-9834',
    mobile: '+1 917-555-1033',
    address: '44 West 36th Street',
    city: 'New York',
    state: 'NY',
    zip_code: '10018',
    country: 'United States',
    emergency_contact_name: 'Daniel Carter',
    emergency_contact_phone: '+1 646-555-4711',
    primary_physician: 'Dr. Hannah Lee',
    insurance_provider: 'HealthShield Plus',
    insurance_policy_number: 'HS-9344-21-A',
    preferred_language: 'English',
  };

  readonly recentVisits = [
    { date: '2026-04-12', type: 'Follow-up', department: 'Cardiology' },
    { date: '2026-03-24', type: 'Initial Intake', department: 'General Care' },
    { date: '2026-02-11', type: 'Lab Review', department: 'Diagnostics' },
  ];

  get fullName(): string {
    return [
      this.patient.first_name,
      this.patient.middle_name,
      this.patient.last_name,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get age(): number {
    const birth = new Date(this.patient.date_of_birth);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      years--;
    }
    return years;
  }

  get initials(): string {
    const first = this.patient.first_name?.charAt(0) || '';
    const last = this.patient.last_name?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  }
}
