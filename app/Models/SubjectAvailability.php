<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectAvailability extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject_id',
        'department_id',
        'course_year',

    ];

    public function subject_catalogs()
    {
        return $this->belongsTo(SubjectCatalog::class);
    }

    public function sections()
    {
        return $this->hasMany(Section::class);
    }

    public function departments()
    {
        return $this->belongsTo(Department::class);
    }
}
