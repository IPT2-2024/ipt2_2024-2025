<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Enlistment extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'enlistments';
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'classschedules_id');
    }


    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academicyear_id');
    }



    public function enrollmentTrackings()
    {
        return $this->hasMany(EnrollmentTracking::class, 'enrollmenttracking_id');
    }

    public function assignmentTrackings()
    {
        return $this->hasMany(AssignmentTracking::class,'assignmenttracking_id');
    }
}
