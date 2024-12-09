<?php

namespace App\Http\Controllers;

use App\Models\Semester;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SemesterController extends Controller
{
    // Display a listing of semesters
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $semesters = Semester::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $semesters = Semester::withTrashed()->get();
        } else {
            $semesters = Semester::all();
        }

        if ($semesters->isEmpty()) {
            return response()->json(['message' => 'No semesters found'], 404);
        }

        return response()->json($semesters);
    }

    // Store a newly created semester in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'semester_period' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create the semester with the provided semester_period
        $semester = Semester::create($request->all());

        return response()->json(['message' => 'Semester created successfully', 'semester' => $semester], 201);
    }


    // Display the specified semester
    public function show($id)
    {
        $semester = Semester::withTrashed()->find($id);
        if (!$semester) {
            return response()->json(['message' => 'Semester not found'], 404);
        }
        return response()->json($semester);
    }

    // Update the specified semester in storage
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'semester_period' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Find the semester by ID
        $semester = Semester::find($id);

        if (!$semester) {
            return response()->json(['message' => 'Semester not found'], 404);
        }

        // Update the semester
        $semester->update($request->all());

        // Return a success message with the updated semester data
        return response()->json(['message' => 'Semester updated successfully', 'semester' => $semester], 200);
    }



    // Remove the specified semester from storage
    public function destroy($id)
    {
        $semester = Semester::find($id);
        if (!$semester) {
            return response()->json(['message' => 'Semester not found'], 404);
        }
        
        $semester->delete();
        return response()->json(['message' => 'Semester deleted successfully']);
    }

    // Restore the specified soft-deleted semester
    public function restore($id)
    {
        $semester = Semester::withTrashed()->find($id);
        if (!$semester) {
            return response()->json(['message' => 'Semester not found'], 404);
        }

        $semester->restore();
        return response()->json(['message' => 'Semester restored successfully']);
    }
}
