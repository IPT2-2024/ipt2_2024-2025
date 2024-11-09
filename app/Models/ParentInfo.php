<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'father_first_name',
        'father_last_name',
        'father_middle_inital',
        'father_suffix',
        'father_occupation',
        'father_address',
        'father_contact_no',
        'mother_firt_name',
        'mother_last_name',
        'mother_middle_inital',
        'mother_occupation',
        'mother_address',
        'mother_contact_no',
        

    ];

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

}
