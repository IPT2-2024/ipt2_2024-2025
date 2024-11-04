<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectAvailability extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject_id',
        'term',
        'max_enrolees',
        'is_open',

    ];

    public function subject_catalogs()
    {
        return $this->belongsTo(SubjectCatalog::class);
    }
}
