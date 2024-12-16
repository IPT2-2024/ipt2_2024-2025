<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subjects = [
            [
                'subject_code' => 'GE 101',
                'subject_name' => 'Contemporary World',
                'classification' => 'minor',
                'units' => 2,
                'subject_description' => 'Modern World Society',
                'availability' => true, // Set to 1 (true) for availability
                'subjectcategory_id' => 1, // SubjectCategory ID 1 corresponds to General Education
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subject_code' => 'IT 171',
                'subject_name' => 'Fundamentals of Programming and Problem Solving',
                'classification' => 'major',
                'units' => 3,
                'subject_description' => 'Programming concepts and Algorithm design',
                'availability' => true, // Set to 1 (true) for availability
                'subjectcategory_id' => 3, // SubjectCategory ID 2 corresponds to Information Technology
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                
                'subject_code' => 'IT 271',
                'subject_name' => '	Data Structures and Algorithms',
                'classification' => 'major',
                'units' => 3,
                'subject_description' => 'Programming concepts and Algorithm design',
                'availability' => true, // Set to 1 (true) for availability
                'subjectcategory_id' => 3, // SubjectCategory ID 3 corresponds to Computer Science
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'subject_code' => 'THEO 101',
                'subject_name' => ' Religions, Religious Experiences and Spirituality',
                'classification' => 'minor',
                'units' => 3,
                'subject_description' => 'Faith traditions and Spiritual practices',
                'availability' => true, // Set to 1 (true) for availability
                'subjectcategory_id' => 2, // SubjectCategory ID 4 corresponds to Theology
                'created_at' => now(),
                'updated_at' => now(),
            ],
     
        ];

        // Insert the subject into the database
        DB::table('subjects')->insert($subjects);
    }
}
