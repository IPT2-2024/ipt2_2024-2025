<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Add your seeders here
        $this->call([
            RoleSeeder::class, // Ensure roles are seeded first
            UserSeeder::class,
            YearLevelSeeder::class,
            SubjectCategorySeeder::class,
            SubjectSeeder::class,
            CurriculumSeeder::class,
            SubjectCurriculumSeeder::class,
            RoomTagSeeder::class,
            FloorSeeder::class,
            BuildingSeeder::class,
            ClassroomSeeder::class,
            DepartmentSeeder::class,
            CollegeProgramSeeder::class,
            AcademicYearSeeder::class,
            SemesterSeeder::class,
            SemesterAcademicYearSeeder::class,
            ClassroomSchedulingSeeder::class,
            SectionSeeder::class,
            ClassifiedSectionSeeder::class,
            CollegeProgramDepartmentSeeder::class,
            AcademicProgramSeeder::class,
            ParentInfoSeeder::class,
            ProfileSeeder::class,
            ClassScheduleSeeder::class,
            EnlistmentSeeder::class,
            EnrollmentTrackingSeeder::class,
            AnnouncementSeeder::class,
            EventSeeder::class,
            AssignmentTrackingSeeder::class,
            NotificationSeeder::class,
           
        ]);
    }
}
