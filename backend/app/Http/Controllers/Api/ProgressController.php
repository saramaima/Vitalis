<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\Exercise;
use App\Models\WeightRecord;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class ProgressController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $range = $request->query('range', '7d');

        if ($range === '30d') {
            $startDate = Carbon::now()->subDays(29)->startOfDay();
        } elseif ($range === '3m') {
            $startDate = Carbon::now()->subMonths(3)->startOfDay();
        } else {
            $range = '7d';
            $startDate = Carbon::now()->subDays(6)->startOfDay();
        }

        $endDate = Carbon::now()->endOfDay();

        // Weight trend
        $weightRecords = WeightRecord::where('user_id', $user->id)
            ->whereBetween('date', [
                $startDate->toDateString(),
                $endDate->toDateString()
            ])
            ->orderBy('date')
            ->get(['date', 'weight']);

        // Meals
        $meals = Meal::where('user_id', $user->id)
            ->whereBetween('date', [
                $startDate->toDateString(),
                $endDate->toDateString()
            ])
            ->get();

        // Calories for every day in the selected range
        $dailyCalories = [];

        $period = CarbonPeriod::create(
            $startDate->toDateString(),
            $endDate->toDateString()
        );

        foreach ($period as $date) {
            $dateString = $date->format('Y-m-d');

            $total = $meals
                ->where('date', $dateString)
                ->sum('total_calories');

            $dailyCalories[] = [
                'date' => $dateString,
                'calories' => $total,
            ];
        }

        $averageCalories = count($dailyCalories) > 0
            ? round(
                collect($dailyCalories)->avg('calories')
            )
            : 0;

        // Exercises
        $exercises = Exercise::where('user_id', $user->id)
            ->whereBetween('date', [
                $startDate->toDateString(),
                $endDate->toDateString()
            ])
            ->get();

        return response()->json([
            'range' => $range,

            'weight_trend' => $weightRecords,

            'calories' => [
                'average' => $averageCalories,
                'daily' => $dailyCalories,
            ],

            'exercise_summary' => [
                'total_workouts' => $exercises->count(),
                'total_minutes' => $exercises->sum('duration'),
                'calories_burned' => $exercises->sum('calories_burned'),
            ],
        ]);
    }
}