<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectCatalog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject_code',
        'subject_name',
        'credit_units',
        'subject_category',
        'subject_description',
        'is_open',
    ];

    public function curriculum_subjects()
    {
        return $this->hasMany(CurriculumSubject::class);
    }

    public function subject_availability()
    {
        return $this->hasMany(SubjectAvailability::class);
    }


}
