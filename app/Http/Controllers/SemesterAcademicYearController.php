<?php

namespace App\Http\Controllers;

use App\Models\SemesterAcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SemesterAcademicYearController extends Controller
{
    // Display a listing of semester academic years
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $semesterAcademicYears = SemesterAcademicYear::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $semesterAcademicYears = SemesterAcademicYear::withTrashed()->get();
        } else {
            $semesterAcademicYears = SemesterAcademicYear::all();
        }

        if ($semesterAcademicYears->isEmpty()) {
            return response()->json(['message' => 'No semester academic years found'], 404);
        }

        return response()->json($semesterAcademicYears);
    }

    // Store a newly created semester academic year in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'semester_id' => 'required|exists:semester,id',
            'academicyear_id' => 'required|exists:academic_year,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $semesterAcademicYear = SemesterAcademicYear::create($request->all());
        return response()->json(['message' => 'Semester Academic Year created successfully', 'semesterAcademicYear' => $semesterAcademicYear], 201);
    }

    // Display the specified semester academic year
    public function show($id)
    {
        $semesterAcademicYear = SemesterAcademicYear::withTrashed()->find($id);
        if (!$semesterAcademicYear) {
            return response()->json(['message' => 'Semester Academic Year not found'], 404);
        }
        return response()->json($semesterAcademicYear);
    }

    // Update the specified semester academic year in storage
    public function update(Request $request, $id)
    {
        $semesterAcademicYear = SemesterAcademicYear::withTrashed()->find($id);
        if (!$semesterAcademicYear) {
            return response()->json(['message' => 'Semester Academic Year not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'semester_id' => 'required|exists:semester,id',
            'academicyear_id' => 'required|exists:academic_year,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $semesterAcademicYear->update($request->all());
        return response()->json(['message' => 'Semester Academic Year updated successfully', 'semesterAcademicYear' => $semesterAcademicYear]);
    }

    // Remove the specified semester academic year from storage
    public function destroy($id)
    {
        $semesterAcademicYear = SemesterAcademicYear::find($id);
        if (!$semesterAcademicYear) {
            return response()->json(['message' => 'Semester Academic Year not found'], 404);
        }
        
        $semesterAcademicYear->delete();
        return response()->json(['message' => 'Semester Academic Year deleted successfully']);
    }

    // Restore the specified soft-deleted semester academic year
    public function restore($id)
    {
        $semesterAcademicYear = SemesterAcademicYear::withTrashed()->find($id);
        if (!$semesterAcademicYear) {
            return response()->json(['message' => 'Semester Academic Year not found'], 404);
        }

        $semesterAcademicYear->restore();
        return response()->json(['message' => 'Semester Academic Year restored successfully']);
    }
}
