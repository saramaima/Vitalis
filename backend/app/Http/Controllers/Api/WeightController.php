<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeightRecord;
use Illuminate\Http\Request;

class WeightController extends Controller
{
    public function index(Request $request)
    {
        $records = WeightRecord::where('user_id', $request->user()->id)
            ->orderBy('date', 'asc')
            ->get();

        return response()->json([
            'data' => $records
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight' => 'required|numeric|min:30|max:300',
            'date' => 'required|date',
        ]);

        $record = WeightRecord::create([
            'user_id' => $request->user()->id,
            'weight' => $validated['weight'],
            'date' => $validated['date'],
        ]);

        // تحديث الوزن الحالي للمستخدم
        $request->user()->update([
            'current_weight' => $validated['weight']
        ]);

        return response()->json([
            'message' => 'Weight recorded successfully',
            'data' => $record,
        ], 201);
    }




        public function update(Request $request, $id)
{
    $record = WeightRecord::where('user_id', $request->user()->id)
        ->findOrFail($id);

    $validated = $request->validate([
        'weight' => 'sometimes|required|numeric|min:30|max:300',
        'date' => 'sometimes|required|date',
    ]);

    $record->update($validated);

    // إذا كان هذا أحدث سجل وزن، حدّث current_weight
    $latestRecord = WeightRecord::where('user_id', $request->user()->id)
        ->orderBy('date', 'desc')
        ->orderBy('id', 'desc')
        ->first();

    if ($latestRecord) {
        $request->user()->update([
            'current_weight' => $latestRecord->weight,
        ]);
    }

    return response()->json([
        'message' => 'Weight record updated successfully',
        'data' => $record->fresh(),
    ]);
}

public function destroy(Request $request, $id)
{
    $record = WeightRecord::where('user_id', $request->user()->id)
        ->findOrFail($id);

    $record->delete();

    // بعد الحذف نجيب أحدث وزن متبقي
    $latestRecord = WeightRecord::where('user_id', $request->user()->id)
        ->orderBy('date', 'desc')
        ->orderBy('id', 'desc')
        ->first();

    if ($latestRecord) {
        $request->user()->update([
            'current_weight' => $latestRecord->weight,
        ]);
    }

    return response()->json([
        'message' => 'Weight record deleted successfully',
    ]);
}
}