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
        'section_id',

    ];

    public function sections()
    {
        return $this->belongsTo(Section::class);
    }

    public function enlistments()
    {
        return $this->belongsToMany(Enlistment::class, 'enlistment_room_schedule');
    }

}
