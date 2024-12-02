<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('announcements')->insert([
            [
                'announcement' => 'The new semester will begin on January 15th, 2025.',
                'created_at' => now(),       // Current timestamp
                'updated_at' => now(),       // Current timestamp
                'deleted_at' => null,        // NULL if not deleted
            ],
            // You can add more announcements as needed
        ]);
    }
}
