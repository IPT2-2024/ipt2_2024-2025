<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];
    protected $table = 'announcements';
    public function notifications()
    {
        return $this->hasMany(Notification::class, 'announcement_id');
    }
}
