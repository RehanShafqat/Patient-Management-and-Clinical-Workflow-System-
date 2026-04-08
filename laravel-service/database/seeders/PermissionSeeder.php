<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('permissions')->insert([
            ['permission_name' => 'create_user', 'description' => 'Can create user'],
            ['permission_name' => 'edit_user', 'description' => 'Can edit user'],
            ['permission_name' => 'delete_user', 'description' => 'Can delete user'],
        ]);
    }
}