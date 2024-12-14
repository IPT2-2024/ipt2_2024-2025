<?php

namespace App\Http\Controllers;

use App\Models\SubjectCurriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectCurriculumController extends Controller
{
    // Display a listing of subject curriculums
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $subjectCurriculums = SubjectCurriculum::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $subjectCurriculums = SubjectCurriculum::withTrashed()->get();
        } else {
            $subjectCurriculums = SubjectCurriculum::all();
        }

        if ($subjectCurriculums->isEmpty()) {
            return response()->json(['message' => 'No subject curriculums found'], 404);
        }

        return response()->json($subjectCurriculums);
    }

    public function getCurriculumsForSubject($subjectId)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $subjectCurriculums = SubjectCurriculum::where('subject_id', $subjectId)
            ->with('curriculum')
            ->get();

        if ($subjectCurriculums->isEmpty()) {
            return response()->json(['message' => 'No curriculums found for this subject'], 404);
        }

        return response()->json($subjectCurriculums);
    }




    // Store a newly created subject curriculum in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'curriculum_id' => 'required|exists:curriculums,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subjectCurriculum = SubjectCurriculum::create($request->all());
        return response()->json(['message' => 'Subject Curriculum created successfully', 'subjectCurriculum' => $subjectCurriculum], 201);
    }

    // Display the specified subject curriculum
    public function show($id)
    {
        $subjectCurriculum = SubjectCurriculum::withTrashed()->find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }
        return response()->json($subjectCurriculum);
    }

    // Update the specified subject curriculum in storage
    public function update(Request $request, $id)
    {
        $subjectCurriculum = SubjectCurriculum::withTrashed()->find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'curriculum_id' => 'required|exists:curriculums,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subjectCurriculum->update($request->all());
        return response()->json(['message' => 'Subject Curriculum updated successfully', 'subjectCurriculum' => $subjectCurriculum]);
    }

    // Soft delete the specified subject curriculum
    public function destroy($id)
    {
        $subjectCurriculum = SubjectCurriculum::find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }
        
        $subjectCurriculum->delete();
        return response()->json(['message' => 'Subject Curriculum deleted successfully']);
    }

    // Restore the specified soft-deleted subject curriculum
    public function restore($id)
    {
        $subjectCurriculum = SubjectCurriculum::withTrashed()->find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }

        $subjectCurriculum->restore();
        return response()->json(['message' => 'Subject Curriculum restored successfully']);
    }
}
