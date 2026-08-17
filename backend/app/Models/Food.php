<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    use HasFactory;

    protected $table = 'foods';

    protected $fillable = [
        'name',
        'serving_size',
        'calories',
        'protein',
        'carbs',
        'fat',
    ];

    public function meals()
    {
        return $this->belongsToMany(Meal::class, 'meal_foods')
            ->withPivot('quantity');
    }
}