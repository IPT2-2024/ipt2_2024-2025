<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('notifications')->insert([
            [
                'event_id' => 1,                  // Example event_id
                'announcement_id' => 1,           // Example announcement_id
                'enrollmenttracking_id' => 1,     // Example enrollmenttracking_id
                'assignmenttracking_id' => 1,     // Example assignmenttracking_id
                'profile_id' => 1,                // Example profile_id
                'created_at' => now(),            // Current timestamp
                'updated_at' => now(),            // Current timestamp
                'deleted_at' => null,             // NULL if not deleted
            ],
            // You can add more records as needed
        ]);
    }
}
