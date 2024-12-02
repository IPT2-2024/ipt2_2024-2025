<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomtagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roomtags')->insert([
            ['room_tag' => '01', 'room_tag_type' => 'numerical', 'created_at' => now()],
            ['room_tag' => '02', 'room_tag_type' => 'numerical', 'created_at' => now()],
            ['room_tag' => '03', 'room_tag_type' => 'numerical', 'created_at' => now()],
            ['room_tag' => '04', 'room_tag_type' => 'numerical', 'created_at' => now()],
            ['room_tag' => '04', 'room_tag_type' => 'numerical', 'created_at' => now()],
            ['room_tag' => '05', 'room_tag_type' => 'numerical', 'created_at' => now()],
        ]);
    }
}
