<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollegeProgramDepartmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('college_program_departments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('department_id'); // Add department_id column
            $table->unsignedBigInteger('collegeprogram_id'); // Add collegeprogram_id column
            $table->timestamps();
            $table->softDeletes()->nullable(); 

            // Foreign key constraints
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade'); // Add foreign key constraint for department_id
            $table->foreign('collegeprogram_id')->references('id')->on('college_programs')->onDelete('cascade'); // Add foreign key constraint for collegeprogram_id
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('college_program_departments');
    }
}