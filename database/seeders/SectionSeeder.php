<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sections')->insert([
            ['section_name' => 'IT-31', 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'IT-32', 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'IT-33', 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'IT-21', 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'IT-11', 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'IT-22', 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'IT-41', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
