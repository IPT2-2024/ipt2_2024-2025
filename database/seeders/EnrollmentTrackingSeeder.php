<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnrollmentTrackingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('enrollment_tracking')->insert([
            [
                'enlistment_id' => 1,         // Example enlistment_id
                'created_at' => now(),        // Current timestamp
                'updated_at' => now(),        // Current timestamp
                'deleted_at' => null,         // NULL if not deleted
            ],
            // You can add more records if needed
        ]);
    }
}
