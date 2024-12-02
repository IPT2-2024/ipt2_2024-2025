<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CollegeProgramDepartment extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'college_program_departments';
    public function collegeprogram()
    {
        return $this->belongsTo(CollegeProgram::class, 'collegeprogram_id');
    }

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function academicprograms()
    {
        return $this->hasMany(AcademicProgram::class, 'academicprogram_id');
    }

    public function profile()
    {
        return $this->hasMany(Profile::class, 'profile_id');
    }
}
