<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject_availability_id',
        'profile_id',
        'day_of_week',
        'start_time',
        'end_time',
        'max_enrollees',
        'term',
        

    ];

    public function room()
    {
        return $this->hasMany(Room::class);
    }

    public function subject_availability()
    {
        return $this->belongsTo(SubjectAvailability::class);
    }

    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

    public function room_schedules()
    {
        return $this->hasMany(RoomSchedule::class);
    }
}
