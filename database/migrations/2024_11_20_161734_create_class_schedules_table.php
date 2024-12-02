<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassSchedulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->time('start_time'); // Add start_time column
            $table->time('end_time'); // Add end_time column
            $table->enum('day_of_week', [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
                'Monday/Thursday', 'Tuesday/Friday', 'Wednesday/Saturday'
            ]); // Add day_of_week column
            $table->unsignedBigInteger('classifiedsection_id'); // Add classifiedsection_id column
            $table->unsignedBigInteger('academicprogram_id'); // Add academicprogram_id column
            $table->unsignedBigInteger('classroomscheduling_id'); // Add classroomscheduling_id column
            $table->unsignedBigInteger('profile_id')->nullable(); // Add profile_id column, nullable
            $table->timestamps(); // Add created_at and updated_at columns

            // Foreign key constraints
            $table->foreign('classifiedsection_id')->references('id')->on('classified_sections')->onDelete('cascade'); // Add foreign key constraint for classifiedsection_id
            $table->foreign('academicprogram_id')->references('id')->on('academic_programs')->onDelete('cascade'); // Add foreign key constraint for academicprogram_id
            $table->foreign('classroomscheduling_id')->references('id')->on('classroom_scheduling')->onDelete('cascade'); // Add foreign key constraint for classroomscheduling_id
            $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('set null'); // Add foreign key constraint for profile_id
            $table->softDeletes()->nullable(); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('class_schedules');
    }
}