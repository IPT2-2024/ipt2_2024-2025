<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicProgram extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'academic_programs';
 
    public function college_program_department()
    {
        return $this->belongsTo(CollegeProgramDepartment::class, 'program_department_id');
    }

    public function subjectCurriculum()
    {
        return $this->belongsTo(SubjectCurriculum::class, 'subjectcurriculum_id');
    }

    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'academicprogram_id');
    }
}
