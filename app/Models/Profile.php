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
        'user_id',
        'department_id',
        'parent_info_id',
        'first_name',
        'last_name',
        'middle_inital',
        'suffix',
        'date_of_birth',
        'address',
        'section',
        'sex',
        'phone_number',
        'admission_date',
        'blood_type',
        'marital_status',
        'religion',
        'photo',
        'emer_full_name',
        'relationship',
        'contact_no',

    ];

    public function users()
    {
        return $this->hasOne(User::class);
    }

    public function enlistments()
    {
        return $this->hasOne(Enlistment::class);
    }

    public function departments()
    {
        return $this->belongsTo(Department::class);
    }

    public function sections()
    {
        return $this->belongsTo(Section::class);
    }

    public function parent_info()
    {
        return $this->hasOne(ParentInfo::class);
    }

}
