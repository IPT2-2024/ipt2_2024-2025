<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Floor extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'floors';

    public function buildings()
    {
        return $this->hasMany(Building::class,'building_id');
    }

    public function classrooms()
    {
        return $this->hasMany(Classroom::class, 'classroom_id');
    }
}
