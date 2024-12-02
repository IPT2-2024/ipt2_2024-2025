<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notification extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'notifications';
    
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function announcement()
    {
        return $this->belongsTo(Announcement::class, 'announcement_id');
    }

    public function enrollmentTracking()
    {
        return $this->belongsTo(EnrollmentTracking::class, 'enrollmenttracking_id');
    }


    public function assignmentTracking()
    {
        return $this->belongsTo(AssignmentTracking::class, 'assignmenttracking_id');
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
}
