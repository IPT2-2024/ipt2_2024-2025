<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CollegeProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('college_programs')->insert([
            ['college_programs' => 'Bachelor of Science in Information Technology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Computer Science', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Cybersecurity', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Civil Engineering', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Industrial Engineering', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Nursing', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Accountancy', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Applied Mathematics', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Psychology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Physical Education', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Criminology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Marketing Management', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Hospitality Management', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],  
            ['college_programs' => 'Bachelor of Science in Accounting Information System', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Internal Auditing', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],  
            ['college_programs' => 'Bachelor of Science in Management Accounting', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],  
            ['college_programs' => 'Bachelor of Science in Biology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()], 
            ['college_programs' => 'Bachelor of Public administration', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()], 
            ['college_programs' => 'Diploma in Information Technology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()], 
            ['college_programs' => 'Bachelor of Library and Information Science', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Entertainment and Multimedia Computing', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()], 
            ['college_programs' => 'Bachelor of Elementary Education', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Secondary Education Major in English', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()], 
            ['college_programs' => 'Bachelor of Secondary Education Major in Mathematics', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()], 
        ]);
    }
}
