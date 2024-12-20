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
            ['subject_category' => 'General Education Core Courses', 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Institutional Courses', 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Common Courses', 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Professional Courses', 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Professional Electives', 'created_at' => now(), 'updated_at' => now()],

        ];

        // Insert the subject categories into the database
        DB::table('subject_category')->insert($subjectCategories);
    }
}
    