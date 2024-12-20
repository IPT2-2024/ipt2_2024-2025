<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BuildingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('buildings')->insert([
            ['building_name' => 'College Building Main', 'floor_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['building_name' => 'College Building North', 'floor_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['building_name' => 'College Building South', 'floor_id' => 5, 'created_at' => now(), 'updated_at' => now()],
            ['building_name' => 'College Building East', 'floor_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            
        ]);
    }
}
