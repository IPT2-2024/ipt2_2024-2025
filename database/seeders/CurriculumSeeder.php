<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $curriculums = [
            [
                'objective' => 'By the end of this unit, students will be able to analyze the causes and effects of the Industrial Revolution, including its impact on society, economy, and technology, and explain how it shaped the modern world.',
                'curriculum_type' => 'formal',
                'resources' => 'non-lab',
                'prerequisite' => 'no',
                'assessment' => 'Quizzes, Assignments, Period Examinations',
                'method' => 'Quizzes, Project, Presentation',
                'content' => 'Lessons, Digital Resources, Workbooks', 
                'number_of_hours' => 24,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objective' => 'By the end of this unit, students will be able to analyze the causes and effects of the Industrial Revolution, including its impact on society, economy, and technology, and explain how it shaped the modern world.',
                'curriculum_type' => 'formal',
                'resources' => 'laboratory',
                'prerequisite' => 'yes',
                'assessment' => 'Quizzes, Assignments, Period Examinations',
                'method' => 'Quizzes, Project, Presentation',
                'content' => 'Lessons, Digital Resources, Workbooks', 
                'number_of_hours' => 24,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objective' => 'By the end of this unit, students will be able to analyze the causes and effects of the Industrial Revolution, including its impact on society, economy, and technology, and explain how it shaped the modern world.',
                'curriculum_type' => 'formal',
                'resources' => 'laboratory',
                'prerequisite' => 'yes',
                'assessment' => 'Quizzes, Assignments, Period Examinations',
                'method' => 'Quizzes, Project, Presentation',
                'content' => 'Lessons, Digital Resources, Workbooks', 
                'number_of_hours' => 24,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'objective' => 'By the end of this unit, students will be able to analyze the causes and effects of the Industrial Revolution, including its impact on society, economy, and technology, and explain how it shaped the modern world.',
                'curriculum_type' => 'formal',
                'resources' => 'non-lab',
                'prerequisite' => 'yes',
                'assessment' => 'Quizzes, Assignments, Period Examinations',
                'method' => 'Quizzes, Project, Presentation',
                'content' => 'Lessons, Digital Resources, Workbooks', 
                'number_of_hours' => 24,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        
        ];

        // Insert the curriculum into the database
        DB::table('curriculums')->insert($curriculums);
    }
}
