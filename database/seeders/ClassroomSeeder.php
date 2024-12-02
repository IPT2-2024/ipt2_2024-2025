<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassroomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('classrooms')->insert([
            ['room_type' => 'classroom', 'building_id' => 1, 'floor_id' => 1, 'roomtag_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['room_type' => 'classroom', 'building_id' => 1, 'floor_id' => 1, 'roomtag_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['room_type' => 'classroom', 'building_id' => 1, 'floor_id' => 1, 'roomtag_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['room_type' => 'classroom', 'building_id' => 1, 'floor_id' => 1, 'roomtag_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['room_type' => 'classroom', 'building_id' => 1, 'floor_id' => 1, 'roomtag_id' => 5, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
