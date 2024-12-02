<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class YearLevel extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'year_levels';

    public function profiles()
    {
        return $this->hasMany(Profile::class, 'yearlevel_id');
    }


    public function classifiedSections()
    {
        return $this->hasMany(ClassifiedSection::class, 'classifiedsection_id');
    }

    public function year_levels()
    {
        return $this->hasMany(YearLevel::class, 'yearlevel_id');
    }
}
