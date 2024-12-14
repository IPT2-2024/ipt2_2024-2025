<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    // Display a listing of departments

    
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $departments = Department::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $departments = Department::withTrashed()->get();
        } else {
            $departments = Department::all();
        }

        if ($departments->isEmpty()) {
            return response()->json(['message' => 'No departments found'], 404);
        }

        return response()->json($departments);
    }
    


    // Store a newly created department in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'department_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $department = Department::create($request->all());
        return response()->json(['message' => 'Department created successfully', 'department' => $department], 201);
    }

    // Display the specified department
    public function show($id)
    {
        $department = Department::withTrashed()->find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }
        return response()->json($department);
    }

    // Update the specified department in storage
    public function update(Request $request, $id)
    {
        $department = Department::withTrashed()->find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'department_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $department->update($request->all());
        return response()->json(['message' => 'Department updated successfully', 'department' => $department]);
    }

    // Soft delete the specified department
    public function destroy($id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }
        
        $department->delete();
        return response()->json(['message' => 'Department deleted successfully']);
    }

    // Restore the specified soft-deleted department
    public function restore($id)
    {
        $department = Department::withTrashed()->find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $department->restore();
        return response()->json(['message' => 'Department restored successfully']);
    }
}
