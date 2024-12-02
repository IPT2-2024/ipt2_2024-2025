<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClassroomSchedulingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $classroomSchedules = [];
        $classroomIds = [1, 2, 3, 4, 5]; // Use only classroom IDs 1, 2, 3, 4, 5
        $daysOfWeek = [
            'Monday/Thursday',
            'Tuesday/Friday',
            'Wednesday',
            'Saturday'
        ];
        $sessionLengths = [60, 90, 120, 150, 180]; // Session lengths in minutes

        foreach ($classroomIds as $classroomId) {
            foreach ($daysOfWeek as $day) {
                $startTime = '7:00 AM';
                $endTimeLimit = $day === 'Saturday' ? '12:00 PM' : '9:00 PM';

                while (strtotime($startTime) < strtotime($endTimeLimit)) {
                    $sessionLength = $sessionLengths[array_rand($sessionLengths)]; // Random session length
                    $endTime = date('g:i A', strtotime($startTime) + $sessionLength * 60);

                    // Break if the end time exceeds the limit
                    if (strtotime($endTime) > strtotime($endTimeLimit)) {
                        break;
                    }

                    $classroomSchedules[] = [
                        'classroom_id' => $classroomId,
                        'time_start' => $startTime,
                        'time_end' => $endTime,
                        'day_of_week' => $day,
                        'created_at' => now(),
                    ];

                    $startTime = $endTime; // Update the start time for the next session
                }
            }
        }

        // Insert generated schedules into the database
        DB::table('classroom_scheduling')->insert($classroomSchedules);
    }
}
