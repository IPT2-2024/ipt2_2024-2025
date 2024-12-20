<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BuildingController extends Controller
{
    // Display a listing of buildings
    public function index(Request $request)
{
    try {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $buildings = Building::onlyTrashed()->with('floor')->get(); // Eager load 'floor' relationship
        } elseif ($deleted === 'true') {
            $buildings = Building::withTrashed()->with('floor')->get(); // Eager load 'floor' relationship
        } else {
            $buildings = Building::with('floor')->get(); // Eager load 'floor' relationship
        }

        // Return the buildings, including floor level
        return response()->json($buildings);
    } catch (\Exception $e) {
        return response()->json([], 200); // Empty response when there's an error
    }
}



    // Store a newly created building in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_id' => 'nullable|exists:floors,id',
            'building_name' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $building = Building::create($request->all());
        return response()->json(['message' => 'Building created successfully', 'building' => $building], 201);
    }

    // Display the specified building
    public function show($id)
    {
        $building = Building::withTrashed()->find($id);
        if (!$building) {
            return response()->json(['message' => 'Building not found'], 404);
        }
        return response()->json($building);
    }

    // Update the specified building in storage
    public function update(Request $request, $id)
    {
        $building = Building::withTrashed()->find($id);
        if (!$building) {
            return response()->json(['message' => 'Building not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'floor_id' => 'required|exists:floors,id',
            'building_name' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $building->update($request->all());
        return response()->json(['message' => 'Building updated successfully', 'building' => $building]);
    }

    // Remove the specified building from storage
    public function destroy($id)
    {
        $building = Building::find($id);
        if (!$building) {
            return response()->json(['message' => 'Building not found'], 404);
        }
        
        $building->delete();
        return response()->json(['message' => 'Building deleted successfully']);
    }

    // Restore the specified soft-deleted building
    public function restore($id)
{
    $building = Building::withTrashed()->find($id); // Include soft-deleted buildings

    if (!$building) {
        return response()->json(['message' => 'Building not found'], 404);
    }

    $building->deleted_at = null; // Restore the building (set deleted_at to null)
    $building->save();

    return response()->json(['message' => 'Building restored successfully'], 200);
}
}
