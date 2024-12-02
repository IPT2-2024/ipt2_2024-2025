<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectCurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subjectCurriculums = [
            [
                'subject_id' => 1, // Subject ID
                'curriculum_id' => 1, // Curriculum ID
                'created_at' => now(),
                'updated_at' => now(),
            ], 
            [
                'subject_id' => 2, // Subject ID
                'curriculum_id' => 2, // Curriculum ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subject_id' => 3, // Subject ID
                'curriculum_id' => 3, // Curriculum ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subject_id' => 4, // Subject ID
                'curriculum_id' => 4, // Curriculum ID
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert the subject-curriculum relationship into the database
        DB::table('subject_curriculums')->insert($subjectCurriculums);
    }
}
