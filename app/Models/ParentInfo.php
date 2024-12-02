<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ParentInfo extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'parent_infos';

    public function profile()
    {
        return $this->hasOne(Profile::class, 'profile_id');
    }
}
