<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('departments')->insert([
            ['department_name' => 'Accountancy Program', 'created_at' => now(), 'updated_at' => now()],
            ['department_name' => 'Arts and Science Program', 'created_at' => now(), 'updated_at' => now()],
            ['department_name' => 'Business Administration Program', 'created_at' => now(), 'updated_at' => now()],
            ['department_name' => 'Computer Studies Program', 'created_at' => now(), 'updated_at' => now()],
            ['department_name' => 'Criminology Justice Program', 'created_at' => now(), 'updated_at' => now()],
            ['department_name' => 'Engineering Technology Program', 'created_at' => now(), 'updated_at' => now()],
            ['department_name' => 'Nursing Program', 'created_at' => now(), 'updated_at' => now()],
            ['department_name' => 'Teachers Education Program', 'created_at' => now(), 'updated_at' => now()],
        ]);
    } 
}
