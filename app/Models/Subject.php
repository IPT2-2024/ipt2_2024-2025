<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'subjects';

    public function subjectCurriculums()
    {
        return $this->hasMany(SubjectCurriculum::class, 'subject_id');
    }


    public function subjectCategory()
    {
        return $this->belongsTo(SubjectCategory::class, 'subjectcategory_id');
    }
}