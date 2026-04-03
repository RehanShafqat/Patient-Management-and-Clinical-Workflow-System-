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
        'is_primary'  // main/default address for this insurance
    ];

    // One insurance address belongs to one insurance company
    public function insurance()
    {
        return $this->belongsTo(Insurance::class);
    }
}