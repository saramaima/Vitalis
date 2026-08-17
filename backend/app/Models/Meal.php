<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'meal_type',
        'date',
        'total_calories',
        'total_protein',
        'total_carbs',
        'total_fat',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function foods()
    {
        return $this->belongsToMany(
            Food::class,
            'meal_foods'
        )->withPivot('quantity');
    }
}