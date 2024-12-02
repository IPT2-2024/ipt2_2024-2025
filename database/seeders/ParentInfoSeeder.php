<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ParentInfoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('parent_infos')->insert([
            [
                'father_first_name' => 'Juan Pablo',
                'father_last_name' => 'Linogao',
                'father_middle_initial' => 'R',
                'father_suffix' => null,
                'father_occupation' => 'Engineer',
                'father_address' => 'Magallanes, Agusan del Norte',
                'father_contact_no' => '09928999761',
                'mother_first_name' => 'Rose',
                'mother_last_name' => 'Linogao',
                'mother_middle_initial' => 'C',
                'mother_occupation' => null,
                'mother_address' => 'Magallanes, Agusan del Norte',
                'mother_contact_no' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
