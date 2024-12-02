<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassroomController extends Controller
{
    // Display a listing of classrooms
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $classrooms = Classroom::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $classrooms = Classroom::withTrashed()->get();
        } else {
            $classrooms = Classroom::all();
        }

        if ($classrooms->isEmpty()) {
            return response()->json(['message' => 'No classrooms found'], 404);
        }

        return response()->json($classrooms);
    }

    // Store a newly created classroom in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_type' => 'required|in:classroom,laboratory,etc',
            'roomtag_id' => 'required|exists:roomtags,id',
            'building_id' => 'required|exists:buildings,id',
            'floor_id' => 'required|exists:floors,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classroom = Classroom::create($request->all());
        return response()->json(['message' => 'Classroom created successfully', 'classroom' => $classroom], 201);
    }

    // Display the specified classroom
    public function show($id)
    {
        $classroom = Classroom::withTrashed()->find($id);
        if (!$classroom) {
            return response()->json(['message' => 'Classroom not found'], 404);
        }
        return response()->json($classroom);
    }

    // Update the specified classroom in storage
    public function update(Request $request, $id)
    {
        $classroom = Classroom::withTrashed()->find($id);
        if (!$classroom) {
            return response()->json(['message' => 'Classroom not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'room_type' => 'required|in:classroom,laboratory,etc',
            'roomtag_id' => 'required|exists:roomtags,id',
            'building_id' => 'required|exists:buildings,id',
            'floor_id' => 'required|exists:floors,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classroom->update($request->all());
        return response()->json(['message' => 'Classroom updated successfully', 'classroom' => $classroom]);
    }

    // Remove the specified classroom from storage
    public function destroy($id)
    {
        $classroom = Classroom::find($id);
        if (!$classroom) {
            return response()->json(['message' => 'Classroom not found'], 404);
        }
        
        $classroom->delete();
        return response()->json(['message' => 'Classroom deleted successfully']);
    }

    // Restore the specified soft-deleted classroom
    public function restore($id)
    {
        $classroom = Classroom::withTrashed()->find($id);
        if (!$classroom) {
            return response()->json(['message' => 'Classroom not found'], 404);
        }

        $classroom->restore();
        return response()->json(['message' => 'Classroom restored successfully']);
    }
}
