<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAssignmentTrackingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('assignment_tracking', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('classschedule_id'); // Add scheduling_id column
            $table->unsignedBigInteger('enlistment_id'); // Add enlistment_id column
            $table->timestamps(); // Add created_at and updated_at columns

            // Foreign key constraints
            $table->foreign('classschedule_id')->references('id')->on('classroom_scheduling')->onDelete('cascade'); // Add foreign key constraint for scheduling_id
            $table->foreign('enlistment_id')->references('id')->on('enlistments')->onDelete('cascade'); // Add foreign key constraint for enlistment_id
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
        Schema::dropIfExists('assignment_tracking');
    }
}