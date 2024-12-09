<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->string('event_name', 255); // Add event_name column
            $table->date('date_start'); // Add date column
            $table->date('date_end')->nullable(); ; // Add date column
            $table->time('time_start',)->nullable(); ; // Add time column
            $table->time('time_end',)->nullable();  // Add time column
            $table->timestamps();
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
        Schema::dropIfExists('events');
    }
}