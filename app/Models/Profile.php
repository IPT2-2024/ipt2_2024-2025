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
        'user_id',
        'department_id',
        'room_schedule_id',
        'last_name',
        'first_name',
        'phone_number',
        'address',
        'date_of_birth',
        'year_level',
        'photo',

    ];

    public function users()
    {
        return $this->hasOne(User::class);
    }

    public function enlistments()
    {
        return $this->hasOne(Enlistment::class);
    }

    public function departments()
    {
        return $this->belongsTo(Department::class);
    }

    public function room_schedules()
    {
        return $this->belongsTo(RoomSchedule::class);
    }

}
