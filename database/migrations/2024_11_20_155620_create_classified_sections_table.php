<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassifiedSectionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
            Schema::create('classified_sections', function (Blueprint $table) {
                $table->id(); // Add id column
                $table->unsignedBigInteger('section_id'); // Add section_id column
                $table->unsignedBigInteger('collegeprogram_id')->nullable(); // Add collegeprogram_id column
                $table->unsignedBigInteger('yearlevel_id')->nullable(); // Add yearlevel_id column
                $table->timestamps(); // Add created_at and updated_at columns

                // Foreign key constraints
                $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade'); // Add foreign key constraint for section_id
                $table->foreign('collegeprogram_id')->references('id')->on('college_programs')->onDelete('cascade'); // Add foreign key constraint for collegeprogram_id
                $table->foreign('yearlevel_id')->references('id')->on('year_levels')->onDelete('cascade'); // Add foreign key constraint for yearlevel_id
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
        Schema::dropIfExists('classified_sections');
    }
}