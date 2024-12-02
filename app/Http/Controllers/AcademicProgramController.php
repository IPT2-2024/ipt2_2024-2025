<?php

namespace App\Http\Controllers;

use App\Models\AcademicProgram;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicProgramController extends Controller
{
    // Display a listing of academic programs
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $academicPrograms = AcademicProgram::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $academicPrograms = AcademicProgram::withTrashed()->get();
        } else {
            $academicPrograms = AcademicProgram::all();
        }

        if ($academicPrograms->isEmpty()) {
            return response()->json(['message' => 'No academic programs found'], 404);
        }

        return response()->json($academicPrograms);
    }

    // Store a newly created academic program in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subjectcurriculum_id' => 'required|exists:subject_curriculums,id',
            'program_department_id' => 'required|exists:college_program_departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $academicProgram = AcademicProgram::create($request->all());
        return response()->json(['message' => 'Academic Program created successfully', 'academicProgram' => $academicProgram], 201);
    }

    // Display the specified academic program
    public function show($id)
    {
        $academicProgram = AcademicProgram::withTrashed()->find($id);
        if (!$academicProgram) {
            return response()->json(['message' => 'Academic Program not found'], 404);
        }
        return response()->json($academicProgram);
    }

    // Update the specified academic program in storage
    public function update(Request $request, $id)
    {
        $academicProgram = AcademicProgram::withTrashed()->find($id);
        if (!$academicProgram) {
            return response()->json(['message' => 'Academic Program not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'subjectcurriculum_id' => 'required|exists:subject_curriculums,id',
            'program_department_id' => 'required|exists:college_program_departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $academicProgram->update($request->all());
        return response()->json(['message' => 'Academic Program updated successfully', 'academicProgram' => $academicProgram]);
    }

    // Soft delete the specified academic program
    public function destroy($id)
    {
        $academicProgram = AcademicProgram::find($id);
        if (!$academicProgram) {
            return response()->json(['message' => 'Academic Program not found'], 404);
        }
        
        $academicProgram->delete();
        return response()->json(['message' => 'Academic Program deleted successfully']);
    }

    // Restore the specified soft-deleted academic program
    public function restore($id)
    {
        $academicProgram = AcademicProgram::withTrashed()->find($id);
        if (!$academicProgram) {
            return response()->json(['message' => 'Academic Program not found'], 404);
        }

        $academicProgram->restore();
        return response()->json(['message' => 'Academic Program restored successfully']);
    }
}
