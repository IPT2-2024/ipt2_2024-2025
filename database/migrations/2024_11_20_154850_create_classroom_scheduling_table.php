<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassroomSchedulingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('classroom_scheduling', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->string('time_start', 50); // Add time_start column
            $table->string('time_end', 50); // Add time_end column
            $table->enum('day_of_week', [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
                'Monday/Thursday', 'Tuesday/Friday', 'Wednesday/Saturday'
            ]); // Add day_of_week column
            $table->unsignedBigInteger('classroom_id'); // Add classroom_id column
            $table->timestamps(); // Add created_at and updated_at columns
           
            // Foreign key constraint
            $table->foreign('classroom_id')->references('id')->on('classrooms')->onDelete('cascade'); // Add foreign key constraint for classroom_id
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
        Schema::dropIfExists('classroom_scheduling');
    }
}