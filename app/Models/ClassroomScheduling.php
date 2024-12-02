<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassroomScheduling extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'classroom_scheduling';

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }


    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'classschedules_id');
    }

    
}
