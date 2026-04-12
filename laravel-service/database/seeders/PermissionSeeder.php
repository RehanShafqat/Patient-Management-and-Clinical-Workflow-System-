<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['permission_name' => 'create_user',   'description' => 'Can create users'],
            ['permission_name' => 'edit_user',     'description' => 'Can edit users'],
            ['permission_name' => 'delete_user',   'description' => 'Can delete users'],
            ['permission_name' => 'view_reports',  'description' => 'Can view reports'],
            ['permission_name' => 'manage_appointments', 'description' => 'Can manage appointments'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}