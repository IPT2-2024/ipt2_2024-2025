<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignmentTrackingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('assignment_tracking')->insert([
            [
                'classschedule_id' => 1,     // Example classschedule_id
                'enlistment_id' => 1,        // Example enlistment_id
                'created_at' => now(),       // Current timestamp
                'updated_at' => now(),       // Current timestamp
                'deleted_at' => null,        // NULL if not deleted
            ],
            // Add more records if needed
        ]);
    }
}
