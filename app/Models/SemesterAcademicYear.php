<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SemesterAcademicYear extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'semester_academicyear';
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academicyear_id');
    }
}
