<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 100); // Add username column
            $table->string('email', 100)->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable(); // Add email_verified_at column
            $table->string('password', 255); // Add password column
            $table->enum('status', ['regular', 'irregular','active','archived'])->nullable(); // Add status column
            $table->string('remember_token', 100)->nullable(); // Add remember_token column
            $table->unsignedBigInteger('role_id'); // Add role_id column
            $table->timestamps();
            $table->softDeletes()->nullable(); 

            // Foreign key constraint
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade'); // Add foreign key constraint
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}