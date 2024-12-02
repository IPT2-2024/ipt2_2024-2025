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
        ]);
    }
}
