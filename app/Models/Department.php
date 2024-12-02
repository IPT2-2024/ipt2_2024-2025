<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'departments';

    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class, 'academicprogram_id');
    }


    public function profiles()
    {
        return $this->hasMany(Profile::class, 'profile_id');
    }
}
