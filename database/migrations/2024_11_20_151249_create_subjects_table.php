<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->string('subject_code', 10); // Add subject_code column
            $table->string('subject_name', 50); // Add subject_name column
            $table->string('classification', 50); // Add classification column
            $table->integer('units'); // Add units column
            $table->text('subject_description')->nullable(); // Add subject_description column, nullable
            $table->boolean('availability'); // Add availability column
            $table->unsignedBigInteger('subjectcategory_id'); // Add subjectcategory_id column
            $table->timestamps(); // Add created_at and updated_at columns
            $table->softDeletes()->nullable(); 

            // Foreign key constraint
            $table->foreign('subjectcategory_id')->references('id')->on('subject_category')->onDelete('cascade'); // Add foreign key constraint
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subjects');
    }
}