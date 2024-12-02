<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAcademicProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('academic_programs', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('subjectcurriculum_id'); // Add subjectcurriculum_id column
            $table->unsignedBigInteger('program_department_id'); // Add program_department_id column
            $table->timestamps(); // Add created_at and updated_at columns
            $table->softDeletes()->nullable(); 

            // Foreign key constraints
            $table->foreign('subjectcurriculum_id')->references('id')->on('subject_curriculums')->onDelete('cascade'); // Add foreign key constraint for subjectcurriculum_id
            $table->foreign('program_department_id')->references('id')->on('college_program_departments')->onDelete('cascade'); // Add foreign key constraint for program_department_id
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('academic_programs');
    }
}