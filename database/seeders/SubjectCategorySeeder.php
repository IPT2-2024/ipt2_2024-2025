<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subjectCategories = [
            ['subject_category' => 'General Education', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Information Technology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Computer Science', 'yearlevel_id'=> 2, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Theology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Accountancy', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Mathematics', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'National Service Training Program', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Biology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Basic Education Studies', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Criminology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Bridge', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Library and Information Science', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Anatomy and Physiology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Biomchemistry', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Criminal Justice Education', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Psychology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
        ];

        // Insert the subject categories into the database
        DB::table('subject_category')->insert($subjectCategories);
    }
}
    