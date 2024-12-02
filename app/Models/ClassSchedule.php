<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassSchedule extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'class_schedules';

    public function classroomScheduling()
    {
        return $this->belongsTo(ClassroomScheduling::class, 'classroomscheduling_id');
    }


    public function classifiedSection()
    {
        return $this->belongsTo(ClassifiedSection::class, 'classifiedsection_id');
    }


    public function academicProgram()
    {
        return $this->belongsTo(AcademicProgram::class, 'academicprogram_id');
    }

    public function semesterAcademicYear()
    {
        return $this->belongsTo(SemesterAcademicYear::class, 'semacacadyear_id');
    }


    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }


    public function assignmentTrackings()
    {
        return $this->hasMany(AssignmentTracking::class,'assignmenttracking_id');
    }
}
    