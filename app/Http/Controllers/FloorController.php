<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FloorController extends Controller
{
    // Display a listing of floors
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $floors = Floor::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $floors = Floor::withTrashed()->get();
        } else {
            $floors = Floor::all();
        }

        if ($floors->isEmpty()) {
            return response()->json(['message' => 'No floors found'], 404);
        }

        return response()->json($floors);
    }

    // Store a newly created floor in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_level' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $floor = Floor::create($request->all());
        return response()->json(['message' => 'Floor created successfully', 'floor' => $floor], 201);
    }

    // Display the specified floor
    public function show($id)
    {
        $floor = Floor::withTrashed()->find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }
        return response()->json($floor);
    }

    // Update the specified floor in storage
    public function update(Request $request, $id)
    {
        $floor = Floor::withTrashed()->find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'floor_level' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $floor->update($request->all());
        return response()->json(['message' => 'Floor updated successfully', 'floor' => $floor]);
    }

    // Remove the specified floor from storage
    public function destroy($id)
    {
        $floor = Floor::find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }
        
        $floor->delete();
        return response()->json(['message' => 'Floor deleted successfully']);
    }

    // Restore the specified soft-deleted floor
    public function restore($id)
    {
        $floor = Floor::withTrashed()->find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }

        $floor->restore();
        return response()->json(['message' => 'Floor restored successfully']);
    }

    // Retrieve all soft-deleted floors
    public function getDeletedFloors()
    {
        $deletedFloors = Floor::onlyTrashed()->get();
        if ($deletedFloors->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted floors found'], 404);
        }
        return response()->json($deletedFloors);
    }
}
