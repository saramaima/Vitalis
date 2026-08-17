<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    public function index(Request $request)
    {
        $exercises = Exercise::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'data' => $exercises
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|max:30',
            'duration' => 'required|integer|min:1',
            'intensity' => 'required|string|in:low,moderate,high',
            'calories_burned' => 'required|integer|min:0',
            'date' => 'required|date',
        ]);

        $exercise = Exercise::create([
            'user_id' => $request->user()->id,
            'type' => $validated['type'],
            'duration' => $validated['duration'],
            'intensity' => $validated['intensity'],
            'calories_burned' => $validated['calories_burned'],
            'date' => $validated['date'],
        ]);

        return response()->json([
            'message' => 'Exercise created successfully',
            'data' => $exercise,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $exercise = Exercise::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|required|string|max:30',
            'duration' => 'sometimes|required|integer|min:1',
            'intensity' => 'sometimes|required|string|in:low,moderate,high',
            'calories_burned' => 'sometimes|required|integer|min:0',
            'date' => 'sometimes|required|date',
        ]);

        $exercise->update($validated);

        return response()->json([
            'message' => 'Exercise updated successfully',
            'data' => $exercise,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $exercise = Exercise::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $exercise->delete();

        return response()->json([
            'message' => 'Exercise deleted successfully'
        ]);
    }
}