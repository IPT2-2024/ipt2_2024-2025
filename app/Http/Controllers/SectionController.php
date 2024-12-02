<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    // Display a listing of sections
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $sections = Section::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $sections = Section::withTrashed()->get();
        } else {
            $sections = Section::all();
        }

        if ($sections->isEmpty()) {
            return response()->json(['message' => 'No sections found'], 404);
        }

        return response()->json($sections);
    }

    // Store a newly created section in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section_name' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $section = Section::create($request->all());
        return response()->json(['message' => 'Section created successfully', 'section' => $section], 201);
    }

    // Display the specified section
    public function show($id)
    {
        $section = Section::withTrashed()->find($id);
        if (!$section) {
            return response()->json(['message' => 'Section not found'], 404);
        }
        return response()->json($section);
    }

    // Update the specified section in storage
    public function update(Request $request, $id)
    {
        $section = Section::withTrashed()->find($id);
        if (!$section) {
            return response()->json(['message' => 'Section not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'section_name' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $section->update($request->all());
        return response()->json(['message' => 'Section updated successfully', 'section' => $section]);
    }

    // Soft delete the specified section
    public function destroy($id)
    {
        $section = Section::find($id);
        if (!$section) {
            return response()->json(['message' => 'Section not found'], 404);
        }
        
        $section->delete();
        return response()->json(['message' => 'Section deleted successfully']);
    }

    // Restore the specified soft-deleted section
    public function restore($id)
    {
        $section = Section::withTrashed()->find($id);
        if (!$section) {
            return response()->json(['message' => 'Section not found'], 404);
        }

        $section->restore();
        return response()->json(['message' => 'Section restored successfully']);
    }
}
