<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurriculumsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('curriculums', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->text('objective'); // Add objective column
            $table->enum('curriculum_type', ['formal', 'informal']); // Add curriculum_type column
            $table->enum('resources', ['non-lab', 'laboratory']); // Add resources column
            $table->enum('prerequisite', ['yes', 'no']); // Add prerequisite column
            $table->text('assessment'); // Add assessment column
            $table->text('method'); // Add method column
            $table->text('content'); // Add content column
            $table->integer('number_of_hours'); // Add number_of_hours column
            $table->timestamps(); // Add created_at and updated_at columns
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
        Schema::dropIfExists('curriculums');
    }
}