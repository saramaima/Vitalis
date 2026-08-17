<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Meal;
use App\Models\Food;
use Illuminate\Http\Request;

class MealController extends Controller
{
    // عرض وجبات المستخدم
    public function index(Request $request)
    {
        $date = $request->query('date');

        $meals = Meal::with('foods')
            ->where('user_id', $request->user()->id)
            ->when($date, function ($query) use ($date) {
                $query->whereDate('date', $date);
            })
            ->get();

        return response()->json([
            'data' => $meals
        ]);
    }


    // إضافة Food إلى Meal
    public function addFood(Request $request, $mealType)
    {
        $validated = $request->validate([
            'food_id' => 'required|exists:foods,id',
            'quantity' => 'required|numeric|min:0.1',
            'date' => 'required|date',
        ]);

        // التأكد من نوع الوجبة
        if (!in_array($mealType, [
            'breakfast',
            'lunch',
            'dinner',
            'snacks'
        ])) {
            return response()->json([
                'message' => 'Invalid meal type'
            ], 422);
        }

        // إيجاد الوجبة أو إنشاؤها
        $meal = Meal::firstOrCreate([
            'user_id' => $request->user()->id,
            'meal_type' => $mealType,
            'date' => $validated['date'],
        ], [
            'total_calories' => 0,
            'total_protein' => 0,
            'total_carbs' => 0,
            'total_fat' => 0,
        ]);

        $food = Food::findOrFail($validated['food_id']);

        // Add the food once per meal; if it already exists, increase its quantity.
        $existingFood = $meal->foods()
            ->where('foods.id', $food->id)
            ->first();

        if ($existingFood) {
            $newQuantity = $existingFood->pivot->quantity + $validated['quantity'];

            $meal->foods()->updateExistingPivot($food->id, [
                'quantity' => $newQuantity,
            ]);
        } else {
            $meal->foods()->attach($food->id, [
                'quantity' => $validated['quantity'],
            ]);
        }

        // إعادة حساب القيم الغذائية
        $this->recalculateMealTotals($meal);

        return response()->json([
            'message' => 'Food added to meal successfully',
            'data' => $meal->load('foods')
        ], 201);
    }


    // تعديل كمية Food داخل Meal
    public function updateFood(Request $request, $mealId, $foodId)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric|min:0.1',
        ]);

        $meal = Meal::where('user_id', $request->user()->id)
            ->findOrFail($mealId);

        // التأكد أن الطعام موجود داخل الوجبة
        $foodExists = $meal->foods()
            ->where('foods.id', $foodId)
            ->exists();

        if (!$foodExists) {
            return response()->json([
                'message' => 'Food not found in this meal'
            ], 404);
        }

        // تعديل الكمية في جدول meal_foods
        $meal->foods()->updateExistingPivot($foodId, [
            'quantity' => $validated['quantity'],
        ]);

        // إعادة الحساب
        $this->recalculateMealTotals($meal);

        return response()->json([
            'message' => 'Food quantity updated successfully',
            'data' => $meal->load('foods'),
        ]);
    }


    // حذف Food من Meal
    public function removeFood(Request $request, $mealId, $foodId)
    {
        $meal = Meal::where('user_id', $request->user()->id)
            ->findOrFail($mealId);

        // التأكد أن الطعام موجود داخل الوجبة
        $foodExists = $meal->foods()
            ->where('foods.id', $foodId)
            ->exists();

        if (!$foodExists) {
            return response()->json([
                'message' => 'Food not found in this meal'
            ], 404);
        }

        // حذف العلاقة من meal_foods
        $meal->foods()->detach($foodId);

        // إعادة حساب القيم
        $this->recalculateMealTotals($meal);

        return response()->json([
            'message' => 'Food removed from meal successfully',
            'data' => $meal->load('foods'),
        ]);
    }


    // حذف Meal كاملة
    public function destroy(Request $request, $mealId)
    {
        $meal = Meal::where('user_id', $request->user()->id)
            ->findOrFail($mealId);

        $meal->delete();

        return response()->json([
            'message' => 'Meal deleted successfully'
        ]);
    }


    // إعادة حساب Calories و Macros
    private function recalculateMealTotals(Meal $meal)
    {
        $meal->load('foods');

        $totalCalories = 0;
        $totalProtein = 0;
        $totalCarbs = 0;
        $totalFat = 0;

        foreach ($meal->foods as $food) {

            $quantity = $food->pivot->quantity;

            $totalCalories +=
                $food->calories * $quantity;

            $totalProtein +=
                $food->protein * $quantity;

            $totalCarbs +=
                $food->carbs * $quantity;

            $totalFat +=
                $food->fat * $quantity;
        }

        $meal->update([
            'total_calories' => round($totalCalories),
            'total_protein' => round($totalProtein, 2),
            'total_carbs' => round($totalCarbs, 2),
            'total_fat' => round($totalFat, 2),
        ]);
    }
}