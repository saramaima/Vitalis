<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
    'name',
    'email',
    'password',
    'age',
    'gender',
    'height',
    'current_weight',
    'target_weight',
    'activity_level',
    'fitness_goal',
    'daily_calorie_target',
    'water_target',

    'protein_target',
    'carbs_target',
    'fat_target',

    'water_reminder',
    'meal_reminder',
    'exercise_reminder',
    'theme',

    'onboarding_completed',
];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];



public function meals()
{
    return $this->hasMany(Meal::class);
}

public function exercises()
{
    return $this->hasMany(Exercise::class);
}

public function weightRecords()
{
    return $this->hasMany(WeightRecord::class);
}

public function waterRecords()
{
    return $this->hasMany(WaterRecord::class);
}

}
