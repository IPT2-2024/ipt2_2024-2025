<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('semester')->insert([
            ['semester_period' => '1st Semester', 'created_at' => now(), 'updated_at' => now()],
            ['semester_period' => '2nd Semester', 'created_at' => now(), 'updated_at' => now()],
            ['semester_period' => 'Summer', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
