<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\Exercise;
use App\Models\WaterRecord;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
       if (!$user->onboarding_completed) {
       return response()->json([
        'message' => 'Please complete onboarding first',
        'onboarding_completed' => false,
    ], 422);
}


        $date = $request->query('date', now()->toDateString());

        // Meals for selected day
        $meals = Meal::with('foods')
            ->where('user_id', $user->id)
            ->whereDate('date', $date)
            ->get();

        // Total calories and macros consumed
        $caloriesConsumed = $meals->sum('total_calories');
        $protein = $meals->sum('total_protein');
        $carbs = $meals->sum('total_carbs');
        $fat = $meals->sum('total_fat');

        // Calories burned from exercises
        $caloriesBurned = Exercise::where('user_id', $user->id)
            ->whereDate('date', $date)
            ->sum('calories_burned');

        // Water consumed
        $waterConsumed = WaterRecord::where('user_id', $user->id)
            ->whereDate('date', $date)
            ->sum('amount');

        // Remaining calories
         $netCalories = $caloriesConsumed - $caloriesBurned;
         $remainingCalories =$user->daily_calorie_target - $netCalories;
              

        return response()->json([
            'date' => $date,
            'onboarding_completed' => true,
            
            'calories' => [
                'target' => $user->daily_calorie_target,
                'consumed' => $caloriesConsumed,
                'burned' => $caloriesBurned,
                'net' => $netCalories,
                'remaining' => $remainingCalories,
            ],

            'macros' => [
              'protein' => [
                   'consumed' => round($protein, 2),
                    'target' => $user->protein_target,
               ],
             'carbs' => [
                   'consumed' => round($carbs, 2),
                   'target' => $user->carbs_target,
               ],
             'fat' => [
                'consumed' => round($fat, 2),
               'target' => $user->fat_target,
               ],
            ],

            'water' => [
                'consumed' => $waterConsumed,
                'target' => $user->water_target,
            ],

            'weight' => [
                'current' => $user->current_weight,
                'target' => $user->target_weight,
            ],

            'meals' => $meals,
        ]);
    }
}