<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssignmentTracking extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'assignment_tracking';

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'classschedule_id');
    }


    public function enlistment()
    {
        return $this->belongsTo(Enlistment::class, 'enlistment_id');
    }
}
