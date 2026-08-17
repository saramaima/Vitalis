<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FoodController;
use App\Http\Controllers\Api\MealController;
use App\Http\Controllers\Api\ExerciseController;
use App\Http\Controllers\Api\WaterController;
use App\Http\Controllers\Api\WeightController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProgressController;




Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/auth/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->post('/users/onboarding',[UserController::class, 'onboarding']);
Route::post('/auth/forgot-password',[AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password',[AuthController::class, 'resetPassword']);

    
    
    

    

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/foods', [FoodController::class, 'index']);
    Route::post('/foods', [FoodController::class, 'store']);
    Route::get('/meals', [MealController::class, 'index']);
    Route::post('/meals/{mealType}/foods',[MealController::class, 'addFood']);
    Route::put('/meals/{mealId}/foods/{foodId}',[MealController::class, 'updateFood']);
    Route::delete('/meals/{mealId}/foods/{foodId}',[MealController::class, 'removeFood']);
    Route::delete('/meals/{mealId}',[MealController::class, 'destroy']);
   
    Route::get('/exercises', [ExerciseController::class, 'index']);
    Route::post('/exercises', [ExerciseController::class, 'store']);
    Route::put('/exercises/{id}', [ExerciseController::class, 'update']);
    Route::delete('/exercises/{id}', [ExerciseController::class, 'destroy']); 
    Route::get('/water', [WaterController::class, 'index']);
    Route::post('/water', [WaterController::class, 'store']);
    Route::get('/weight', [WeightController::class, 'index']);
    Route::post('/weight', [WeightController::class, 'store']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/progress', [ProgressController::class, 'index']);
    Route::put('/users/me', [UserController::class, 'updateProfile']);
    Route::put('/users/me/password', [UserController::class, 'changePassword']);
    Route::put('/weight/{id}', [WeightController::class, 'update']);
    Route::delete('/weight/{id}', [WeightController::class, 'destroy']);
    Route::put('/water/{id}', [WaterController::class, 'update']);
    Route::delete('/water/{id}', [WaterController::class, 'destroy']);

});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*

|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


