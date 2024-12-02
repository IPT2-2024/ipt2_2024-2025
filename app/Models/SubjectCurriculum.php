<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectCurriculum extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'subject_curriculums';
    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class, 'curriculum_id');
    }


    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }


    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class, 'academicprogram_id');
    }
}
