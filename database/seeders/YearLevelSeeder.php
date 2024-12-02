<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class YearLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $yearLevels = [
            ['year_level' => '1', 'created_at' => now(), 'updated_at' => now()],
            ['year_level' => '2', 'created_at' => now(), 'updated_at' => now()],
            ['year_level' => '3', 'created_at' => now(), 'updated_at' => now()],
            ['year_level' => '4', 'created_at' => now(), 'updated_at' => now()],
            ['year_level' => '5', 'created_at' => now(), 'updated_at' => now()],
        ];

        // Insert the year levels into the database
        DB::table('year_levels')->insert($yearLevels);
    }
}
