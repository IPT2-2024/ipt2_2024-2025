<?php

namespace App\Http\Controllers;

use App\Models\Enlistment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EnlistmentController extends Controller
{
    // Display a listing of enlistments
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $enlistments = Enlistment::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $enlistments = Enlistment::withTrashed()->get();
        } else {
            $enlistments = Enlistment::all();
        }

        if ($enlistments->isEmpty()) {
            return response()->json(['message' => 'No enlistments found'], 404);
        }

        return response()->json($enlistments);
    }

    // Store a newly created enlistment in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_id' => 'required|exists:profiles,id',
            'classschedules_id' => 'required|exists:class_schedules,id',
            'academicyear_id' => 'required|exists:academic_year,id',
            'semester_id' => 'required|exists:semester,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $enlistment = Enlistment::create($request->all());
        return response()->json(['message' => 'Enlistment created successfully', 'enlistment' => $enlistment], 201);
    }

    // Display the specified enlistment
    public function show($id)
    {
        $enlistment = Enlistment::withTrashed()->find($id);
        if (!$enlistment) {
            return response()->json(['message' => 'Enlistment not found'], 404);
        }
        return response()->json($enlistment);
    }

    // Update the specified enlistment in storage
    public function update(Request $request, $id)
    {
        $enlistment = Enlistment::withTrashed()->find($id);
        if (!$enlistment) {
            return response()->json(['message' => 'Enlistment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'profile_id' => 'required|exists:profiles,id',
            'classschedules_id' => 'required|exists:class_schedules,id',
            'academicyear_id' => 'required|exists:academic_year,id',
            'semester_id' => 'required|exists:semester,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $enlistment->update($request->all());
        return response()->json(['message' => 'Enlistment updated successfully', 'enlistment' => $enlistment]);
    }

    // Remove the specified enlistment from storage
    public function destroy($id)
    {
        $enlistment = Enlistment::find($id);
        if (!$enlistment) {
            return response()->json(['message' => 'Enlistment not found'], 404);
        }

        $enlistment->delete();
        return response()->json(['message' => 'Enlistment deleted successfully']);
    }

    // Restore the specified soft-deleted enlistment
    public function restore($id)
    {
        $enlistment = Enlistment::withTrashed()->find($id);
        if (!$enlistment) {
            return response()->json(['message' => 'Enlistment not found'], 404);
        }

        $enlistment->restore();
        return response()->json(['message' => 'Enlistment restored successfully']);
    }
}
