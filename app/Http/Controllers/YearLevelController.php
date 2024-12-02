<?php

namespace App\Http\Controllers;

use App\Models\YearLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class YearLevelController extends Controller
{
    // Display a listing of year levels
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $yearLevels = YearLevel::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $yearLevels = YearLevel::withTrashed()->get();
        } else {
            $yearLevels = YearLevel::all();
        }

        if ($yearLevels->isEmpty()) {
            return response()->json(['message' => 'No year levels found'], 404);
        }

        return response()->json($yearLevels);
    }

    // Store a newly created year level in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'year_level' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $yearLevel = YearLevel::create($request->all());
        return response()->json(['message' => 'Year Level created successfully', 'yearLevel' => $yearLevel], 201);
    }

    // Display the specified year level
    public function show($id)
    {
        $yearLevel = YearLevel::withTrashed()->find($id);
        if (!$yearLevel) {
            return response()->json(['message' => 'Year Level not found'], 404);
        }
        return response()->json($yearLevel);
    }

    // Update the specified year level in storage
    public function update(Request $request, $id)
    {
        $yearLevel = YearLevel::withTrashed()->find($id);
        if (!$yearLevel) {
            return response()->json(['message' => 'Year Level not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'year_level' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $yearLevel->update($request->all());
        return response()->json(['message' => 'Year Level updated successfully', 'yearLevel' => $yearLevel]);
    }

    // Remove the specified year level from storage
    public function destroy($id)
    {
        $yearLevel = YearLevel::find($id);
        if (!$yearLevel) {
            return response()->json(['message' => 'Year Level not found'], 404);
        }

        $yearLevel->delete();
        return response()->json(['message' => 'Year Level deleted successfully']);
    }

    // Restore the specified soft-deleted year level
    public function restore($id)
    {
        $yearLevel = YearLevel::withTrashed()->find($id);
        if (!$yearLevel) {
            return response()->json(['message' => 'Year Level not found'], 404);
        }

        $yearLevel->restore();
        return response()->json(['message' => 'Year Level restored successfully']);
    }
}
