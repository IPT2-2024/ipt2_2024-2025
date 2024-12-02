<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectCurriculumsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subject_curriculums', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('subject_id'); // Add subject_id column
            $table->unsignedBigInteger('curriculum_id'); // Add curriculum_id column
            $table->timestamps(); // Add created_at and updated_at columns
            $table->softDeletes()->nullable(); 

            // Foreign key constraints
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade'); // Add foreign key constraint for subject_id
            $table->foreign('curriculum_id')->references('id')->on('curriculums')->onDelete('cascade'); // Add foreign key constraint for curriculum_id
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subject_curriculums');
    }
}