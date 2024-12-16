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

            [
                'start_time' => '16:00:00',  
                'end_time' => '17:00:00',  
                'day_of_week' => 'Monday/Thursday',
                'classifiedsection_id' => 2,
                'academicprogram_id' => 1,
                'classroomscheduling_id' => 5,
                'profile_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'start_time' => '11:00:00',  
                'end_time' => '12:00:00',  
                'day_of_week' => 'Monday/Thursday',
                'classifiedsection_id' => 3,
                'academicprogram_id' => 1,
                'classroomscheduling_id' => 6,
                'profile_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'start_time' => '11:00:00',  
                'end_time' => '12:00:00',  
                'day_of_week' => 'Monday/Thursday',
                'classifiedsection_id' => 2,
                'academicprogram_id' => 2,
                'classroomscheduling_id' => 2,
                'profile_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'start_time' => '13:00:00',  
                'end_time' => '15:00:00',  
                'day_of_week' => 'Monday/Thursday',
                'classifiedsection_id' => 1,
                'academicprogram_id' => 3,
                'classroomscheduling_id' => 4,
                'profile_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],


            
        ]);
    }
}
