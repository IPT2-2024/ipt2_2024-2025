<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SemesterAcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('semester_academicyear')->insert([
            [
                'semester_id' => 1, // ID of 1st Semester
                'academicyear_id' => 1, // ID of 2024-2025 in academic_year table
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
