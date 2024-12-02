<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classroom extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'classrooms';

    public function building()
    {
        return $this->belongsTo(Building::class);
    }


    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }


    public function roomTag()
    {
        return $this->belongsTo(RoomTag::class);
    }


    public function classroomSchedulings()
    {
        return $this->hasMany(ClassroomScheduling::class);
    }
}
