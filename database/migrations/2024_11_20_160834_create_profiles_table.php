<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 50)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('middle_initial', 20)->nullable();
            $table->string('suffix', 20)->nullable();
            $table->integer('age')->nullable();
            $table->text('address')->nullable();
            $table->string('school_email', 50)->nullable();
            $table->string('sex', 20)->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->date('admission_date')->nullable();
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable();
            $table->string('religion', 50)->nullable();
            $table->text('photo_path')->nullable();
            $table->string('emer_full_name', 100)->nullable();
            $table->string('relationship', 50)->nullable();
            $table->string('emer_contact_no', 20)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->timestamps();

            // Foreign key attributes
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('program_department_id')->nullable();
            $table->unsignedBigInteger('yearlevel_id')->nullable();
            $table->unsignedBigInteger('parent_info_id')->nullable();
            $table->unsignedBigInteger('department_id')->nullable(); // Add department_id column, nullable

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('program_department_id')->references('id')->on('college_program_departments')->onDelete('set null');
            $table->foreign('yearlevel_id')->references('id')->on('year_levels')->onDelete('set null');
            $table->foreign('parent_info_id')->references('id')->on('parent_infos')->onDelete('set null');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null'); // Add foreign key constraint for department_id
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
        Schema::dropIfExists('profiles');
    }
}