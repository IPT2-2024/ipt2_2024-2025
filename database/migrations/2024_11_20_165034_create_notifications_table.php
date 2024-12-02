<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('event_id'); // Add event_id column
            $table->unsignedBigInteger('announcement_id'); // Add announcement_id column
            $table->unsignedBigInteger('enrollmenttracking_id'); // Add enrollmenttracking_id column
            $table->unsignedBigInteger('assignmenttracking_id'); // Add assignmenttracking_id column
            $table->unsignedBigInteger('profile_id'); // Add profile_id column
            $table->timestamps(); // Add created_at and updated_at columns

            // Foreign key constraints
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('announcement_id')->references('id')->on('announcements')->onDelete('cascade');
            $table->foreign('enrollmenttracking_id')->references('id')->on('enrollment_tracking')->onDelete('cascade');
            $table->foreign('assignmenttracking_id')->references('id')->on('assignment_tracking')->onDelete('cascade');
            $table->foreign('profile_id')->references('id')->on('profiles')->onDelete('cascade');
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
        Schema::dropIfExists('notifications');
    }
}