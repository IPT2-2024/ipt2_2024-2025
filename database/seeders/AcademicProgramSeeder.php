<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AcademicProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('academic_programs')->insert([
            [
                'subjectcurriculum_id' => 1, // Subject Curriculum ID
                'program_department_id' => 1, // Program Department ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            
        ]);
    }
}