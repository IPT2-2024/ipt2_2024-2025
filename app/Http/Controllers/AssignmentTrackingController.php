<?php

namespace App\Http\Controllers;

use App\Models\AssignmentTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssignmentTrackingController extends Controller
{
    // Display a listing of assignment trackings
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $assignmentTrackings = AssignmentTracking::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $assignmentTrackings = AssignmentTracking::withTrashed()->get();
        } else {
            $assignmentTrackings = AssignmentTracking::all();
        }

        if ($assignmentTrackings->isEmpty()) {
            return response()->json(['message' => 'No assignment trackings found'], 404);
        }

        return response()->json($assignmentTrackings);
    }

    // Store a newly created assignment tracking in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'classschedule_id' => 'required|exists:class_schedules,id',
            'enlistment_id' => 'required|exists:enlistments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $assignmentTracking = AssignmentTracking::create($request->all());
        return response()->json(['message' => 'Assignment Tracking created successfully', 'assignmentTracking' => $assignmentTracking], 201);
    }

    // Display the specified assignment tracking
    public function show($id)
    {
        $assignmentTracking = AssignmentTracking::withTrashed()->find($id);
        if (!$assignmentTracking) {
            return response()->json(['message' => 'Assignment Tracking not found'], 404);
        }
        return response()->json($assignmentTracking);
    }

    // Update the specified assignment tracking in storage
    public function update(Request $request, $id)
    {
        $assignmentTracking = AssignmentTracking::withTrashed()->find($id);
        if (!$assignmentTracking) {
            return response()->json(['message' => 'Assignment Tracking not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'classschedule_id' => 'required|exists:class_schedules,id',
            'enlistment_id' => 'required|exists:enlistments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $assignmentTracking->update($request->all());
        return response()->json(['message' => 'Assignment Tracking updated successfully', 'assignmentTracking' => $assignmentTracking]);
    }

    // Remove the specified assignment tracking from storage
    public function destroy($id)
    {
        $assignmentTracking = AssignmentTracking::find($id);
        if (!$assignmentTracking) {
            return response()->json(['message' => 'Assignment Tracking not found'], 404);
        }
        
        $assignmentTracking->delete();
        return response()->json(['message' => 'Assignment Tracking deleted successfully']);
    }

    // Restore the specified soft-deleted assignment tracking
    public function restore($id)
    {
        $assignmentTracking = AssignmentTracking::withTrashed()->find($id);
        if (!$assignmentTracking) {
            return response()->json(['message' => 'Assignment Tracking not found'], 404);
        }

        $assignmentTracking->restore();
        return response()->json(['message' => 'Assignment Tracking restored successfully']);
    }
}
