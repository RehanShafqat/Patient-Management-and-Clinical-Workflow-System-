<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DiagnosesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('diagnoses')->insert([
            [
                'icd_code' => 'I10',
                'diagnoses_name' => 'Hypertension',
                'description' => 'High blood pressure'
            ],
            [
                'icd_code' => 'E11',
                'diagnoses_name' => 'Type 2 Diabetes',
                'description' => 'Chronic condition'
            ],
            [
                'icd_code' => 'J45',
                'diagnoses_name' => 'Asthma',
                'description' => 'Respiratory issue'
            ],
        ]);
    }
}