<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
public function onboarding(Request $request)
{
    $validated = $request->validate([
        'age' => 'required|integer|min:13|max:100',
        'gender' => 'required|string|in:male,female',
        'height' => 'required|numeric|min:100|max:250',
        'current_weight' => 'required|numeric|min:30|max:300',
        'target_weight' => 'required|numeric|min:30|max:300',

        'activity_level' =>
            'required|string|in:sedentary,light,moderate,active,very_active',

        'fitness_goal' =>
            'required|string|in:lose_weight,gain_muscle,maintain_weight',
    ]);

    $user = $request->user();

    // Calculate BMR
    if ($validated['gender'] === 'male') {
        $bmr =
            (10 * $validated['current_weight']) +
            (6.25 * $validated['height']) -
            (5 * $validated['age']) +
            5;
    } else {
        $bmr =
            (10 * $validated['current_weight']) +
            (6.25 * $validated['height']) -
            (5 * $validated['age']) -
            161;
    }

    // Activity factor
    $activityFactors = [
        'sedentary' => 1.2,
        'light' => 1.375,
        'moderate' => 1.55,
        'active' => 1.725,
        'very_active' => 1.9,
    ];

    $tdee = $bmr * $activityFactors[$validated['activity_level']];

    // Adjust calories based on goal
    if ($validated['fitness_goal'] === 'lose_weight') {
        $dailyCalorieTarget = $tdee - 500;
    } elseif ($validated['fitness_goal'] === 'gain_muscle') {
        $dailyCalorieTarget = $tdee + 300;
    } else {
        $dailyCalorieTarget = $tdee;
    }

    $dailyCalorieTarget = round($dailyCalorieTarget);

    // Save user's information
    $user->update([
        'age' => $validated['age'],
        'gender' => $validated['gender'],
        'height' => $validated['height'],
        'current_weight' => $validated['current_weight'],
        'target_weight' => $validated['target_weight'],
        'activity_level' => $validated['activity_level'],
        'fitness_goal' => $validated['fitness_goal'],
        'daily_calorie_target' => $dailyCalorieTarget,
        'onboarding_completed' => true,
    ]);

    return response()->json([
        'message' => 'Onboarding completed successfully',
        'daily_calorie_target' => $dailyCalorieTarget,
        'user' => $user,
    ], 200);
}




public function updateProfile(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => 'sometimes|required|string|max:150',
        'age' => 'sometimes|required|integer|min:13|max:100',
        'height' => 'sometimes|required|numeric|min:100|max:250',
        'target_weight' => 'sometimes|required|numeric|min:30|max:300',
        'activity_level' => 'sometimes|required|string|in:sedentary,light,moderate,active,very_active',
        'fitness_goal' => 'sometimes|required|string|in:lose_weight,gain_muscle,maintain_weight',

        'daily_calorie_target' => 'sometimes|required|integer|min:1000|max:5000',
        'water_target' => 'sometimes|required|integer|min:1|max:20',

        'protein_target' => 'sometimes|required|integer|min:0',
        'carbs_target' => 'sometimes|required|integer|min:0',
        'fat_target' => 'sometimes|required|integer|min:0',


        'water_reminder' => 'sometimes|boolean',
        'meal_reminder' => 'sometimes|boolean',
        'exercise_reminder' => 'sometimes|boolean',
        'theme' => 'sometimes|required|in:light,dark',
    ]);

    $user->update($validated);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user->fresh(),
    ]);
}




public function changePassword(Request $request)
{
    $validated = $request->validate([
        'current_password' => 'required|string',

        'password' => [
            'required',
            'confirmed',
            \Illuminate\Validation\Rules\Password::min(8)
                ->letters()
                ->numbers()
                ->symbols(),
        ],
    ]);

    $user = $request->user();

    if (!\Illuminate\Support\Facades\Hash::check(
        $validated['current_password'],
        $user->password
    )) {
        return response()->json([
            'message' => 'Current password is incorrect'
        ], 422);
    }

    $user->update([
        'password' => \Illuminate\Support\Facades\Hash::make(
            $validated['password']
        )
    ]);

    return response()->json([
        'message' => 'Password changed successfully'
    ]);
}
}