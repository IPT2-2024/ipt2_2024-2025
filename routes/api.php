<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AcademicProgramController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AssignmentTrackingController;
use App\Http\Controllers\BuildingController;
use App\Http\Controllers\ClassifiedSectionController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\ClassroomSchedulingController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\CollegeProgramController;
use App\Http\Controllers\CollegeProgramDepartmentController;
use App\Http\Controllers\CurriculumController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EnlistmentController;
use App\Http\Controllers\EnrollmentTrackingController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ParentInfoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RoomTagController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SemesterAcademicYearController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\SubjectCategoryController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SubjectCurriculumController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YearLevelController;

// Wrap all routes inside an authentication middleware group
Route::middleware('auth:sanctum')->group(function () {
    
    // Roles
    Route::apiResource('roles', RoleController::class);
    Route::post('roles/{id}/restore', [RoleController::class, 'restore']);

    // Users
    Route::apiResource('users', UserController::class);
    Route::post('users/{id}/restore', [UserController::class, 'restore']);

    // Profiles
    Route::apiResource('profiles', ProfileController::class);
    Route::post('profiles/{id}/restore', [ProfileController::class, 'restore']);

    // Parent Info
    Route::apiResource('parentinfo', ParentInfoController::class);
    Route::post('parentinfo/{id}/restore', [ParentInfoController::class, 'restore']);

    // Year Levels
    Route::apiResource('yearlevel', YearLevelController::class);
    Route::post('yearlevel/{id}/restore', [YearLevelController::class, 'restore']);

    // Subject Categories
    Route::apiResource('subjectcategory', SubjectCategoryController::class);
    Route::post('subjectcategory/{id}/restore', [SubjectCategoryController::class, 'restore']);

    // Subjects
    Route::apiResource('subject', SubjectController::class);
    Route::post('subject/{id}/restore', [SubjectController::class, 'restore']);

    // Curriculums
    Route::apiResource('curriculum', CurriculumController::class);
    Route::post('curriculum/{id}/restore', [CurriculumController::class, 'restore']);

    // Subject Curriculums
    Route::apiResource('subjectcurriculum', SubjectCurriculumController::class);
    Route::post('subjectcurriculum/{id}/restore', [SubjectCurriculumController::class, 'restore']);

    // Departments
    Route::apiResource('department', DepartmentController::class);
    Route::post('department/{id}/restore', [DepartmentController::class, 'restore']);

    // College Programs
    Route::apiResource('collegeprogram', CollegeProgramController::class);
    Route::post('collegeprogram/{id}/restore', [CollegeProgramController::class, 'restore']);

    // College Program Departments
    Route::apiResource('collegeprogramdepartment', CollegeProgramDepartmentController::class);
    Route::post('collegeprogramdepartment/{id}/restore', [CollegeProgramDepartmentController::class, 'restore']);

    // Academic Programs
    Route::apiResource('academicprogram', AcademicProgramController::class);
    Route::post('academicprogram/{id}/restore', [AcademicProgramController::class, 'restore']);

    // Sections
    Route::apiResource('sections', SectionController::class);
    Route::post('sections/{id}/restore', [SectionController::class, 'restore']);

    // Room Tags
    Route::apiResource('roomtag', RoomTagController::class);
    Route::post('roomtag/{id}/restore', [RoomTagController::class, 'restore']);

    // Floors
    Route::apiResource('floor', FloorController::class);
    Route::post('floor/{id}/restore', [FloorController::class, 'restore']);

    // Classified Sections
    Route::apiResource('classifiedsection', ClassifiedSectionController::class);
    Route::post('classifiedsection/{id}/restore', [ClassifiedSectionController::class, 'restore']);

    // Buildings
    Route::apiResource('building', BuildingController::class);
    Route::post('building/{id}/restore', [BuildingController::class, 'restore']);

    // Classrooms
    Route::apiResource('classroom', ClassroomController::class);
    Route::post('classroom/{id}/restore', [ClassroomController::class, 'restore']);

    // Classroom Schedulings
    Route::apiResource('classroomscheduling', ClassroomSchedulingController::class);
    Route::post('classroomscheduling/{id}/restore', [ClassroomSchedulingController::class, 'restore']);

    // Semesters
    Route::apiResource('semester', SemesterController::class);
    Route::post('semester/{id}/restore', [SemesterController::class, 'restore']);

    // Academic Years
    Route::apiResource('academicyear', AcademicYearController::class);
    Route::post('academicyear/{id}/restore', [AcademicYearController::class, 'restore']);

    // Semester Academic Years
    Route::apiResource('semesteracademicyear', SemesterAcademicYearController::class);
    Route::post('semesteracademicyear/{id}/restore', [SemesterAcademicYearController::class, 'restore']);

    // Class Schedules
    Route::apiResource('classschedule', ClassScheduleController::class);
    Route::post('classschedule/{id}/restore', [ClassScheduleController::class, 'restore']);

    // Enlistments
    Route::apiResource('enlistment', EnlistmentController::class);
    Route::post('enlistment/{id}/restore', [EnlistmentController::class, 'restore']);

    // Enrollment Trackings
    Route::apiResource('enrollmenttracking', EnrollmentTrackingController::class);
    Route::post('enrollmenttracking/{id}/restore', [EnrollmentTrackingController::class, 'restore']);

    // Assignment Trackings
    Route::apiResource('assignmenttracking', AssignmentTrackingController::class);
    Route::post('assignmenttracking/{id}/restore', [AssignmentTrackingController::class, 'restore']);

    // Events
    Route::apiResource('event', EventController::class);
    Route::post('event/{id}/restore', [EventController::class, 'restore']);

    // Announcements
    Route::apiResource('announcement', AnnouncementController::class);
    Route::post('announcement/{id}/restore', [AnnouncementController::class, 'restore']);

    // Notifications
    Route::apiResource('notification', NotificationController::class);
    Route::post('notification/{id}/restore', [NotificationController::class, 'restore']);

});

