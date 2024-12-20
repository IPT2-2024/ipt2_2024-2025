<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EnlistmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('enlistments')->insert([
            [
                'profile_id' => 6,               // Example profile_id
                'classschedules_id' => 1,        // Example classschedules_id
                'academicyear_id' => 1,       // Example academic year
                'semester_id' => 1,              // Example semester ID (e.g., 1 = 1st Semester)
                'created_at' => now(),           // Current timestamp
                'updated_at' => now(),           // Current timestamp
                'deleted_at' => null,            // NULL if not deleted
            ],

            [
                'profile_id' => 4,               // Example profile_id
                'classschedules_id' => 1,        // Example classschedules_id
                'academicyear_id' => 1,       // Example academic year
                'semester_id' => 1,              // Example semester ID (e.g., 1 = 1st Semester)
                'created_at' => now(),           // Current timestamp
                'updated_at' => now(),           // Current timestamp
                'deleted_at' => null,            // NULL if not deleted
            ],

            [
                'profile_id' => 7,               // Example profile_id
                'classschedules_id' => 1,        // Example classschedules_id
                'academicyear_id' => 1,       // Example academic year
                'semester_id' => 1,              // Example semester ID (e.g., 1 = 1st Semester)
                'created_at' => now(),           // Current timestamp
                'updated_at' => now(),           // Current timestamp
                'deleted_at' => null,            // NULL if not deleted
            ],

            [
                'profile_id' => 8,               // Example profile_id
                'classschedules_id' => 1,        // Example classschedules_id
                'academicyear_id' => 1,       // Example academic year
                'semester_id' => 1,              // Example semester ID (e.g., 1 = 1st Semester)
                'created_at' => now(),           // Current timestamp
                'updated_at' => now(),           // Current timestamp
                'deleted_at' => null,            // NULL if not deleted
            ],
            // You can add more records as needed
        ]);
    }
}
