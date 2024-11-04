<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enlistment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'subject_id',
        'enlistment_status',
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function subject_catalogs()
    {
        return $this->belongsTo(DSubjectCatalog::class);
    }
}
