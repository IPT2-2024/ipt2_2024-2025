<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomSchedule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'room_id',
        'department_id',
        'subject_id',
        'day_of_week',
        'start_time',
        'end_time',
        'semester',
        'academic_year',

    ];

    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }

    public function departments()
    {
        return $this->belongsTo(Department::class);
    }

    public function rooms()
    {
        return $this->belongsTo(Room::class);
    }

    public function subject_catalogs()
    {
        return $this->belongsTo(SubjectCatalog::class);
    }

}
