<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRoomtagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roomtags', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->string('room_tag', 50); // Add room_tag column
            $table->enum('room_tag_type', ['numerical', 'functional', 'office']); // Add room_tag_type column
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
        Schema::dropIfExists('roomtags');
    }
}