<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEnrollmentTrackingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('enrollment_tracking', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('enlistment_id'); // Add enlistment_id column
            $table->timestamps(); // Add created_at and updated_at columns

            // Foreign key constraint
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
        Schema::dropIfExists('enrollment_tracking');
    }
}