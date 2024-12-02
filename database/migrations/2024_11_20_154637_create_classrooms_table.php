<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassroomsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classrooms', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->enum('room_type', ['classroom', 'laboratory', 'etc']); // Add room_type column
            $table->unsignedBigInteger('roomtag_id'); // Add roomtag_id column
            $table->unsignedBigInteger('building_id'); // Add building_id column
            $table->unsignedBigInteger('floor_id'); // Add floor_id column
            $table->timestamps(); // Add created_at and updated_at columns
           

            // Foreign key constraints
            $table->foreign('roomtag_id')->references('id')->on('roomtags')->onDelete('cascade'); // Add foreign key constraint for roomtag_id
            $table->foreign('building_id')->references('id')->on('buildings')->onDelete('cascade'); // Add foreign key constraint for building_id
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
        Schema::dropIfExists('classrooms');
    }
}