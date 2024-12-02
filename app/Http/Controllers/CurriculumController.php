<?php

namespace App\Http\Controllers;

use App\Models\Curriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CurriculumController extends Controller
{
    // Display a listing of curriculums
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $curriculums = Curriculum::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $curriculums = Curriculum::withTrashed()->get();
        } else {
            $curriculums = Curriculum::all();
        }

        if ($curriculums->isEmpty()) {
            return response()->json(['message' => 'No curriculums found'], 404);
        }

        return response()->json($curriculums);
    }

    // Store a newly created curriculum in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'objective' => 'required|string',
            'curriculum_type' => 'required|in:formal,informal',
            'resources' => 'required|in:non-lab,laboratory',
            'prerequisite' => 'required|in:yes,no',
            'assessment' => 'required|string',
            'method' => 'required|string',
            'content' => 'required|string',
            'number_of_hours' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $curriculum = Curriculum::create($request->all());
        return response()->json(['message' => 'Curriculum created successfully', 'curriculum' => $curriculum], 201);
    }

    // Display the specified curriculum
    public function show($id)
    {
        $curriculum = Curriculum::withTrashed()->find($id);
        if (!$curriculum) {
            return response()->json(['message' => 'Curriculum not found'], 404);
        }
        return response()->json($curriculum);
    }

    // Update the specified curriculum in storage
    public function update(Request $request, $id)
    {
        $curriculum = Curriculum::withTrashed()->find($id);
        if (!$curriculum) {
            return response()->json(['message' => 'Curriculum not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'objective' => 'required|string',
            'curriculum_type' => 'required|in:formal,informal',
            'resources' => 'required|in:non-lab,laboratory',
            'prerequisite' => 'required|in:yes,no',
            'assessment' => 'required|string',
            'method' => 'required|string',
            'content' => 'required|string',
            'number_of_hours' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $curriculum->update($request->all());
        return response()->json(['message' => 'Curriculum updated successfully', 'curriculum' => $curriculum]);
    }

    // Soft delete the specified curriculum
    public function destroy($id)
    {
        $curriculum = Curriculum::find($id);
        if (!$curriculum) {
            return response()->json(['message' => 'Curriculum not found'], 404);
        }
        
        $curriculum->delete();
        return response()->json(['message' => 'Curriculum deleted successfully']);
    }

    // Restore the specified soft-deleted curriculum
    public function restore($id)
    {
        $curriculum = Curriculum::withTrashed()->find($id);
        if (!$curriculum) {
            return response()->json(['message' => 'Curriculum not found'], 404);
        }

        $curriculum->restore();
        return response()->json(['message' => 'Curriculum restored successfully']);
    }
}
