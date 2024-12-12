<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subject_category', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->string('subject_category', 100)->nullable(); // Add subject_category column
            $table->unsignedBigInteger('yearlevel_id')->nullable(); // Add yearlevel_id column
            $table->timestamps(); // Add created_at and updated_at columns
            $table->softDeletes()->nullable(); 
            $table->foreign('yearlevel_id')->references('id')->on('year_levels')->onDelete('cascade'); // Add foreign key constraint for yearlevel_id
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subject_category');
    }
}