<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEnlistmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('enlistments', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('profile_id'); // Add profile_id column
            $table->unsignedBigInteger('classschedules_id'); // Add classschedules_id column
            $table->unsignedBigInteger('academicyear_id'); // Add academic_year column
            $table->unsignedBigInteger('semester_id'); // Add semester_id column
            $table->timestamps(); // Add created_at and updated_at columns

            // Foreign key constraints
            $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade'); // Add foreign key constraint for profile_id
            $table->foreign('classschedules_id')->references('id')->on('class_schedules')->onDelete('cascade'); // Add foreign key constraint for classschedules_id
            $table->foreign('academicyear_id')->references('id')->on('academic_year')->onDelete('cascade'); // Add foreign key constraint for academic_year
            $table->foreign('semester_id')->references('id')->on('semester')->onDelete('cascade'); // Add foreign key constraint for semester_id
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
        Schema::dropIfExists('enlistments');
    }
}