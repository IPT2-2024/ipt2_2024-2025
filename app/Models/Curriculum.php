<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    use HasFactory;

     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'department_id',
        'curriculum_year',
    ];

    public function departments()
    {
        return $this->belongsTo(Department::class);
    }

    public function curriculum_subjects()
    {
        return $this->hasMany(CurriculumSubject::class);
    }

}
