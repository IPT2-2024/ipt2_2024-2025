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
            [
                'father_first_name' => 'Luis',
                'father_last_name' => 'Castro',
                'father_middle_initial' => 'R',
                'father_suffix' => null,
                'father_occupation' => 'Business Owner',
                'father_address' => 'Butuan City',
                'father_contact_no' => '09234567891',
                'mother_first_name' => 'Maria',
                'mother_last_name' => 'Castro',
                'mother_middle_initial' => 'L',
                'mother_occupation' => 'Housewife',
                'mother_address' => 'Butuan City',
                'mother_contact_no' => '09234567890',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'father_first_name' => 'Carlos',
                'father_last_name' => 'Villanueva',
                'father_middle_initial' => 'D',
                'father_suffix' => null,
                'father_occupation' => 'Accountant',
                'father_address' => 'Tandag City',
                'father_contact_no' => '09456789013',
                'mother_first_name' => 'Elena',
                'mother_last_name' => 'Villanueva',
                'mother_middle_initial' => 'T',
                'mother_occupation' => 'Teacher',
                'mother_address' => 'Tandag City',
                'mother_contact_no' => '09456789012',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'father_first_name' => 'Jose',
                'father_last_name' => 'Gonzales',
                'father_middle_initial' => 'M',
                'father_suffix' => null,
                'father_occupation' => 'Retired Military',
                'father_address' => 'Cebu City',
                'father_contact_no' => '09512345679',
                'mother_first_name' => 'Julia',
                'mother_last_name' => 'Gonzales',
                'mother_middle_initial' => 'T',
                'mother_occupation' => 'Nurse',
                'mother_address' => 'Cebu City',
                'mother_contact_no' => '09512345678',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'father_first_name' => 'Pedro',
                'father_last_name' => 'Reyes',
                'father_middle_initial' => 'A',
                'father_suffix' => null,
                'father_occupation' => 'Doctor',
                'father_address' => 'Cagayan de Oro City',
                'father_contact_no' => '09431234567',
                'mother_first_name' => 'Maria',
                'mother_last_name' => 'Reyes',
                'mother_middle_initial' => 'M',
                'mother_occupation' => 'Professor',
                'mother_address' => 'Cagayan de Oro City',
                'mother_contact_no' => '09431234568',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'father_first_name' => 'Manuel',
                'father_last_name' => 'Salazar',
                'father_middle_initial' => 'V',
                'father_suffix' => null,
                'father_occupation' => 'Architect',
                'father_address' => 'Davao City',
                'father_contact_no' => '09345678901',
                'mother_first_name' => 'Clara',
                'mother_last_name' => 'Salazar',
                'mother_middle_initial' => 'L',
                'mother_occupation' => 'Banker',
                'mother_address' => 'Davao City',
                'mother_contact_no' => '09345678902',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
