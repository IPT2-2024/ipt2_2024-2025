<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('class_schedules')->insert([
            [
                'start_time' => '07:00:00',  
                'end_time' => '10:00:00',  
                'day_of_week' => 'Monday/Thursday',
                'classifiedsection_id' => 1,
                'academicprogram_id' => 1,
                'classroomscheduling_id' => 1,
                'profile_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
