<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('profiles')->insert([
            [
                'first_name' => 'John Paul',
                'last_name' => 'Linogao',
                'middle_initial' => 'C',
                'suffix' => null,
                'age' => 20,
                'address' => 'Magallanes, Agusan del Norte',
                'school_email' => 'john.linogao@urios.edu.ph',
                'sex' => 'male',
                'phone_number' => '09101631245',
                'admission_date' => now(),
                'marital_status' => 'single',
                'religion' => 'catholic',
                'photo_path' => null,
                'emer_full_name' => 'Rose Linogao',
                'relationship' => 'Mother',
                'emer_contact_no' => '09101812345',
                'date_of_birth' => '2003-03-25',
                'user_id' => 1,
                'program_department_id' => null,
                'yearlevel_id' => 3,
                'parent_info_id' => 1,
                'department_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            [
                'first_name' => 'Michael Danville',
                'last_name' => 'Enciso',
                'middle_initial' => 'C',
                'suffix' => null,
                'age' => 20,
                'address' => 'Magallanes, Agusan del Norte',
                'school_email' => 'michael.enciso@urios.edu.ph',
                'sex' => 'male',
                'phone_number' => '09101631245',
                'admission_date' => now(),
                'marital_status' => 'single',
                'religion' => 'catholic',
                'photo_path' => null,
                'emer_full_name' => 'Rose Linogao',
                'relationship' => 'Mother',
                'emer_contact_no' => '09101812345',
                'date_of_birth' => '2003-03-25',
                'user_id' => 2,
                'program_department_id' => null,
                'yearlevel_id' => 3,
                'parent_info_id' => 1,
                'department_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
