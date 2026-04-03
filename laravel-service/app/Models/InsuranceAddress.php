<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class InsuranceAddress extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'insurance_id',
        'address',
        'phone',
    ];

    public function insurance()
    {
        return $this->belongsTo(Insurance::class);
    }
}