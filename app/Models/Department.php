<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    /**
     * Get the profiles for the department.
     */
    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }

    /**
     * Get the courses for the department.
     */
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function curriculums()
    {
        return $this->hasMany(Curriculum::class);
    }

    public function subject_availability()
    {
        return $this->hasMany(SubjectAvailability::class);
    }
    
}
