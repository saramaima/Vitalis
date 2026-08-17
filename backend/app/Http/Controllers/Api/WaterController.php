<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WaterRecord;
use Illuminate\Http\Request;

class WaterController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->query('date', now()->toDateString());

        $records = WaterRecord::where('user_id', $request->user()->id)
            ->whereDate('date', $date)
            ->get();

        $total = $records->sum('amount');

        return response()->json([
            'date' => $date,
            'total_glasses' => $total,
            'water_target' => $request->user()->water_target,
            'records' => $records,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1|max:20',
            'date' => 'required|date',
        ]);

        $record = WaterRecord::create([
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'date' => $validated['date'],
        ]);

        return response()->json([
            'message' => 'Water added successfully',
            'data' => $record,
        ], 201);
    }



    public function update(Request $request, $id)
{
    $record = WaterRecord::where('user_id', $request->user()->id)
        ->findOrFail($id);

    $validated = $request->validate([
        'amount' => 'sometimes|required|integer|min:1|max:20',
        'date' => 'sometimes|required|date',
    ]);

    $record->update($validated);

    return response()->json([
        'message' => 'Water record updated successfully',
        'data' => $record->fresh(),
    ]);
}

public function destroy(Request $request, $id)
{
    $record = WaterRecord::where('user_id', $request->user()->id)
        ->findOrFail($id);

    $record->delete();

    return response()->json([
        'message' => 'Water record deleted successfully',
    ]);
}
}