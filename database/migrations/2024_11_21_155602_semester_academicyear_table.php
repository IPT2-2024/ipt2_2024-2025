<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SemesterAcademicyearTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('semester_academicyear', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('semester_id');
            $table->unsignedBigInteger('academicyear_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('semester_id')->references('id')->on('semester')->onDelete('cascade');
            $table->foreign('academicyear_id')->references('id')->on('academic_year')->onDelete('cascade');
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
        Schema::dropIfExists('semester_academicyear');
    }
}