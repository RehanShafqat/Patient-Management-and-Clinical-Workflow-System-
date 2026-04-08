<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Insurance;
use App\Models\InsuranceAddress;

class InsuranceAddressSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Insurance::all() as $insurance) {
            InsuranceAddress::create([
                'insurance_id' => $insurance->id,
                'address' => 'Main Address ' . $insurance->id,
                'phone' => '1234567890',
                'is_primary' => true,
            ]);
        }
    }
}