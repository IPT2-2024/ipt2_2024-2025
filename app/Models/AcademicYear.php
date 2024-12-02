<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicYear extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'academic_year';
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class, 'semacad_year_id');
    }
}
