<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'section_id',
        'room_number',
        'capacity',
        'is_available',
    ];

    public function sections()
    {
        return $this->belongsTo(Section::class);
    }
}
