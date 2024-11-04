<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurriculumSubject extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'curriculum_id',
        'subject_id',
        'semester',
        'year_level',
        'is_prerequisite',
    ];

    public function curriculums()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function subject_catalogs()
    {
        return $this->belongsTo(SubjectCatalog::class);
    }
}
