<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'subject_category'; // Specify the table name

    protected $guarded = [];

    public function subjects()
    {
        return $this->hasMany(Subject::class, 'subject_id');
    }

    public function year_levels()
    {
        return $this->belongsTo(YearLevel::class, 'yearlevel_id');
    }
}
