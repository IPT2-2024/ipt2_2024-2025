<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollegeProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('college_programs', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->string('college_programs', 100); // Add college_programs column
            $table->enum('study_type', ['undergraduate', 'graduate', 'diploma']); // Add study_type column
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
        Schema::dropIfExists('college_programs');
    }
}