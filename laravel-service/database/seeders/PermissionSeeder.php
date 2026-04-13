<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            ['permission_name' => 'create_user'],
            ['permission_name' => 'edit_user'],
            ['permission_name' => 'delete_user'],
            ['permission_name' => 'view_reports'],
            ['permission_name' => 'manage_appointments'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }
}