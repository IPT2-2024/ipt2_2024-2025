<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassifiedSectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('classified_sections')->insert([
            ['section_id' => 1, 'collegeprogram_id' => 1, 'yearlevel_id' => 3, 'created_at' => now()],
            ['section_id' => 2, 'collegeprogram_id' => 2, 'yearlevel_id' => 2, 'created_at' => now()],
            ['section_id' => 3, 'collegeprogram_id' => 3, 'yearlevel_id' => 1, 'created_at' => now()],
            ['section_id' => 4, 'collegeprogram_id' => 4, 'yearlevel_id' => 3, 'created_at' => now()],
            ['section_id' => 5, 'collegeprogram_id' => 5, 'yearlevel_id' => 1, 'created_at' => now()],
        ]);
    }
}
