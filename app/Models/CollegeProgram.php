<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CollegeProgram extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'college_programs';

    public function classifiedSections()
    {
        return $this->hasMany(ClassifiedSection::class, 'classifiedsection_id');
    }

    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class, 'academicprogram_id');
    }
}
