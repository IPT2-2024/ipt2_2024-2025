<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParentInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parent_infos', function (Blueprint $table) {
            $table->id();
            $table->string('father_first_name', 100)->nullable(); // Add father_first_name column, nullable
            $table->string('father_last_name', 50)->nullable(); // Add father_last_name column, nullable
            $table->string('father_middle_initial', 20)->nullable(); // Add father_middle_initial column, nullable
            $table->string('father_suffix', 20)->nullable(); // Add father_suffix column, nullable
            $table->string('father_occupation', 50)->nullable(); // Add father_occupation column, nullable
            $table->text('father_address')->nullable(); // Add father_address column, nullable
            $table->string('father_contact_no', 20)->nullable(); // Add father_contact_no column, nullable
            $table->string('mother_first_name', 100)->nullable(); // Add mother_first_name column, nullable
            $table->string('mother_last_name', 50)->nullable(); // Add mother_last_name column, nullable
            $table->string('mother_middle_initial', 20)->nullable(); // Add mother_middle_initial column, nullable
            $table->string('mother_occupation', 50)->nullable(); // Add mother_occupation column, nullable
            $table->text('mother_address')->nullable(); // Add mother_address column, nullable
            $table->string('mother_contact_no', 50)->nullable(); // Add mother_contact_no column, nullable
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
        Schema::dropIfExists('parent_infos');
    }
}