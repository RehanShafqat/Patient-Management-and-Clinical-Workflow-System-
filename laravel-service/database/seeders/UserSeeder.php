<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::factory()->create([
            'first_name' => 'System',
            'last_name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'is_active' => true,
            'role' => Role::ADMIN->value,
        ]);

        // Doctors
        User::factory(5)->create([
            'role' => Role::DOCTOR->value,
        ]);

        // FDOs
        User::factory(5)->create([
            'role' => Role::FDO->value,
        ]);
    }
}