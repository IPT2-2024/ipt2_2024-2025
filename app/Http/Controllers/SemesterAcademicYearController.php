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
        
        // Base query with join for semester and academic_year
        $query = SemesterAcademicYear::query()
            ->join('semester', 'semester_academicyear.semester_id', '=', 'semester.id')
            ->join('academic_year', 'semester_academicyear.academicyear_id', '=', 'academic_year.id')
            ->select(
                'semester_academicyear.id', 
                'academic_year.academic_year', 
                'semester.semester_period',
                'semester_academicyear.status',
                'semester_academicyear.created_at',
                'semester_academicyear.updated_at',
                'semester_academicyear.deleted_at'
            );

        if ($deleted === 'only') {
            $semesterAcademicYears = $query->onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $semesterAcademicYears = $query->withTrashed()->get();
        } else {
            $semesterAcademicYears = $query->get();
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
            'status' => 'nullable|boolean',  // Make 'status' optional
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Set the status to 0 if it's not provided in the request
        $status = $request->has('status') ? $request->status : 0;
    
        // Create the new SemesterAcademicYear record
        $semesterAcademicYear = SemesterAcademicYear::create([
            'semester_id' => $request->semester_id,
            'academicyear_id' => $request->academicyear_id,
            'status' => $status, // Ensure status is 0 if not passed in the request
        ]);
    
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
            'status' => 'required|boolean', // Add this line
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

    public function updateStatus(Request $request, $id)
    {
        $semesterAcademicYear = SemesterAcademicYear::find($id);
        if (!$semesterAcademicYear) {
            return response()->json(['message' => 'Semester Academic Year not found'], 404);
        }

        // Ensure the status is either 1 or 0
        $semesterAcademicYear->status = $request->status ? 1 : 0;
        $semesterAcademicYear->save();

        return response()->json(['message' => 'Status updated successfully']);
    }

    public function updateAllStatuses(Request $request)
    {
        // Validate that we have the 'id' and 'status' from the request
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:semester_academicyear,id',
            'status' => 'required|boolean', // Ensure status is boolean (0 or 1)
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Retrieve the record that will be turned on (status 1)
        $activeSemesterAcademicYear = SemesterAcademicYear::find($request->id);

        if (!$activeSemesterAcademicYear) {
            return response()->json(['message' => 'Semester Academic Year not found'], 404);
        }

        // Set all statuses to 0 (turning all switches off)
        SemesterAcademicYear::query()->update(['status' => 0]);

        // Update the selected record to 1 (turning the selected switch on)
        $activeSemesterAcademicYear->status = 1;
        $activeSemesterAcademicYear->save();

        return response()->json(['message' => 'Status updated successfully']);
    }

}
