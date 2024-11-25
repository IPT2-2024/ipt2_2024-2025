<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            ['username' => 'superadmin', 'email' => null, 'password' => Hash::make('Superadmin@123'), 'status' => null, 'role_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'admin', 'email' => null, 'password' => Hash::make('Admin@123'), 'status' => null, 'role_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'john.linogao', 'email' => 'john.linogao@urios.edu.ph', 'password' => Hash::make('linogao'), 'status' => 'Regular', 'role_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'mark.pereyra', 'email' => 'mark.pereyra@urios.edu.ph', 'password' => Hash::make('pereyra'), 'status' => 'Irregular', 'role_id' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}