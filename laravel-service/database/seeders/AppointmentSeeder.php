<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\PatientCase;
use App\Models\DoctorProfile;
use App\Models\Specialty;
use App\Models\PracticeLocation;
use App\Models\User;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $fdo = User::where('role', 'fdo')->first();

        foreach (PatientCase::all() as $case) {
            $doctor = DoctorProfile::inRandomOrder()->first();

            Appointment::create([
                'appointment_number' => 'APT-' . now()->format('Ymd') . '-' . rand(10000, 99999),
                'case_id' => $case->id,
                'patient_id' => $case->patient_id,
                'doctor_id' => $doctor->id,
                'appointment_date' => now(),
                'appointment_time' => now(),
                'appointment_type' => 'New Patient',
                'specialty_id' => Specialty::inRandomOrder()->first()->id,
                'practice_location_id' => PracticeLocation::inRandomOrder()->first()->id,
                'status' => 'Scheduled',
                'reason_for_visit' => 'Checkup',
                'created_by' => $fdo->id,
            ]);
        }
    }
}