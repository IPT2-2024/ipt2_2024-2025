<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semester extends Model
{
    use HasFactory, SoftDeletes;


    protected $table = 'semester';
    protected $guarded = [];
    
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class, 'semacad_year_id');
    }

    public function enlistments()
    {
        return $this->hasMany(Enlistment::class, 'enlistment_id');
    }
}
