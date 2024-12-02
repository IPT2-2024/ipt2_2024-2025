<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FloorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('floors')->insert([
            ['floor_level' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['floor_level' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['floor_level' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['floor_level' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['floor_level' => 5, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
