<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassifiedSection extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'classified_sections';
    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }


    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class, 'yearlevel_id');
    }


    public function collegeProgram()
    {
        return $this->belongsTo(CollegeProgram::class, 'collegeprogram_id');
    }


    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'classschedules_id');
    }
}
