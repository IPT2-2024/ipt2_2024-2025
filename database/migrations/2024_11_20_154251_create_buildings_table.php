<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBuildingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('buildings', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('floor_id')->nullable(); // Make floor_id nullable
            $table->string('building_name', 50); // Add building_name column
            $table->timestamps(); // Add created_at and updated_at columns
    
            
            // Foreign key constraint
            $table->foreign('floor_id')->references('id')->on('floors')->onDelete('cascade'); // Add foreign key constraint for floor_id
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
        Schema::dropIfExists('buildings');
    }
}