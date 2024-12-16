<?php

namespace App\Http\Controllers;

use App\Models\CollegeProgramDepartment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CollegeProgramDepartmentController extends Controller
{
    // Display a listing of college program departments
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $collegeProgramDepartments = CollegeProgramDepartment::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $collegeProgramDepartments = CollegeProgramDepartment::withTrashed()->get();
        } else {
            $collegeProgramDepartments = CollegeProgramDepartment::all();
        }

        if ($collegeProgramDepartments->isEmpty()) {
            return response()->json(['message' => 'No college program departments found'], 404);
        }

        return response()->json($collegeProgramDepartments);
    }

    // Store a newly created college program department in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
            'collegeprogram_id' => 'required|array|min:1',
            'collegeprogram_id.*' => 'exists:college_programs,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $departmentId = $request->department_id;
        $programIds = $request->program_ids;

        foreach ($programIds as $programId) {
            CollegeProgramDepartment::create([
                'department_id' => $departmentId,
                'collegeprogram_id' => $programId,
            ]);
        }

        return response()->json(['message' => 'Programs successfully assigned to the department'], 201);
    }


    // Display the specified college program department
    public function show($id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::withTrashed()->find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }
        return response()->json($collegeProgramDepartment);
    }

    // Update the specified college program department in storage
    public function update(Request $request, $id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::withTrashed()->find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
            'collegeprogram_id' => 'required|exists:college_programs,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $collegeProgramDepartment->update($request->all());
        return response()->json(['message' => 'College Program Department updated successfully', 'collegeProgramDepartment' => $collegeProgramDepartment]);
    }

    // Remove the specified college program department from storage
    public function destroy($id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }
        
        $collegeProgramDepartment->delete();
        return response()->json(['message' => 'College Program Department deleted successfully']);
    }

    // Restore the specified soft-deleted college program department
    public function restore($id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::withTrashed()->find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }

        $collegeProgramDepartment->restore();
        return response()->json(['message' => 'College Program Department restored successfully']);
    }

    public function getFilteredPrograms(Request $request)
{
    $search = $request->query('search', ''); // Optional search parameter

    $programs = CollegeProgramDepartment::join('departments', 'college_program_departments.department_id', '=', 'departments.id')
        ->join('college_programs', 'college_program_departments.collegeprogram_id', '=', 'college_programs.id')
        ->select(
            'college_program_departments.id as program_department_id',
            'departments.department_name as department_name',
            'college_programs.college_programs as program_name'
        )
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('departments.department_name', 'LIKE', "%$search%")
                  ->orWhere('college_programs.college_programs', 'LIKE', "%$search%");
            });
        })
        ->get();

    if ($programs->isEmpty()) {
        return response()->json(['message' => 'No programs found'], 404);
    }

    return response()->json(['programs' => $programs]);
}

}
