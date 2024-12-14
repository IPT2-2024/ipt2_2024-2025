<?php

namespace App\Http\Controllers;

use App\Models\CollegeProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CollegeProgramController extends Controller
{

 
  
  
    // Display a listing of college programs
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $collegePrograms = CollegeProgram::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $collegePrograms = CollegeProgram::withTrashed()->get();
        } else {
            $collegePrograms = CollegeProgram::all();
        }

        if ($collegePrograms->isEmpty()) {
            return response()->json(['message' => 'No college programs found'], 404);
        }

        return response()->json($collegePrograms);
    }

    
    

    

    // Store a newly created college program in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'college_programs' => 'required|string|max:100',
            'study_type' => 'required|in:undergraduate,graduate,diploma',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $collegeProgram = CollegeProgram::create($request->all());
        return response()->json(['message' => 'College Program created successfully', 'collegeProgram' => $collegeProgram], 201);
    }

    // Display the specified college program
    public function show($id)
    {
        $collegeProgram = CollegeProgram::withTrashed()->find($id);
        if (!$collegeProgram) {
            return response()->json(['message' => 'College Program not found'], 404);
        }
        return response()->json($collegeProgram);
    }

    // Update the specified college program in storage
    public function update(Request $request, $id)
    {
        $collegeProgram = CollegeProgram::withTrashed()->find($id);
        if (!$collegeProgram) {
            return response()->json(['message' => 'College Program not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'college_programs' => 'required|string|max:100',
            'study_type' => 'required|in:undergraduate,graduate,diploma',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $collegeProgram->update($request->all());
        return response()->json(['message' => 'College Program updated successfully', 'collegeProgram' => $collegeProgram]);
    }

    // Soft delete the specified college program
    public function destroy($id)
    {
        $collegeProgram = CollegeProgram::find($id);
        if (!$collegeProgram) {
            return response()->json(['message' => 'College Program not found'], 404);
        }
        
        $collegeProgram->delete();
        return response()->json(['message' => 'College Program deleted successfully']);
    }

    // Restore the specified soft-deleted college program
    public function restore($id)
    {
        $collegeProgram = CollegeProgram::withTrashed()->find($id);
        if (!$collegeProgram) {
            return response()->json(['message' => 'College Program not found'], 404);
        }

        $collegeProgram->restore();
        return response()->json(['message' => 'College Program restored successfully']);
    }

    public function getTotalCourses()
    {
        // Count only courses that are not soft-deleted
        $totalCourses = CollegeProgram::whereNull('deleted_at')->count();

        return response()->json(['totalCourses' => $totalCourses]);
    }
}
