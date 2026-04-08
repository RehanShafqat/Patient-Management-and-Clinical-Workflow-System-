<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PatientCase;
use App\Models\Patient;
use App\Models\PracticeLocation;

class PatientCaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Patient::all() as $patient) {
            PatientCase::create([
                'case_number' => 'CASE-' . now()->year . '-' . rand(10000, 99999),
                'patient_id' => $patient->id,
                'practice_location_id' => PracticeLocation::inRandomOrder()->first()->id,
                'category' => 'General Medicine',
                'purpose_of_visit' => 'Routine checkup',
                'case_type' => 'Initial Consultation',
                'priority' => 'Normal',
                'case_status' => 'Active',
                'opening_date' => now(),
            ]);
        }
    }
}