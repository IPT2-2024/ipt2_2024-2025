<?php

namespace App\Http\Controllers;

use App\Models\EnrollmentTracking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EnrollmentTrackingController extends Controller
{
    // Display a listing of enrollment trackings
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $enrollmentTrackings = EnrollmentTracking::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $enrollmentTrackings = EnrollmentTracking::withTrashed()->get();
        } else {
            $enrollmentTrackings = EnrollmentTracking::all();
        }

        if ($enrollmentTrackings->isEmpty()) {
            return response()->json(['message' => 'No enrollment trackings found'], 404);
        }

        return response()->json($enrollmentTrackings);
    }

    // Store a newly created enrollment tracking in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'enlistment_id' => 'required|exists:enlistments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $enrollmentTracking = EnrollmentTracking::create($request->all());
        return response()->json(['message' => 'Enrollment Tracking created successfully', 'enrollmentTracking' => $enrollmentTracking], 201);
    }

    // Display the specified enrollment tracking
    public function show($id)
    {
        $enrollmentTracking = EnrollmentTracking::withTrashed()->find($id);
        if (!$enrollmentTracking) {
            return response()->json(['message' => 'Enrollment Tracking not found'], 404);
        }
        return response()->json($enrollmentTracking);
    }

    // Update the specified enrollment tracking in storage
    public function update(Request $request, $id)
    {
        $enrollmentTracking = EnrollmentTracking::withTrashed()->find($id);
        if (!$enrollmentTracking) {
            return response()->json(['message' => 'Enrollment Tracking not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'enlistment_id' => 'required|exists:enlistments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $enrollmentTracking->update($request->all());
        return response()->json(['message' => 'Enrollment Tracking updated successfully', 'enrollmentTracking' => $enrollmentTracking]);
    }

    // Remove the specified enrollment tracking from storage
    public function destroy($id)
    {
        $enrollmentTracking = EnrollmentTracking::find($id);
        if (!$enrollmentTracking) {
            return response()->json(['message' => 'Enrollment Tracking not found'], 404);
        }

        $enrollmentTracking->delete();
        return response()->json(['message' => 'Enrollment Tracking deleted successfully']);
    }

    // Restore the specified soft-deleted enrollment tracking
    public function restore($id)
    {
        $enrollmentTracking = EnrollmentTracking::withTrashed()->find($id);
        if (!$enrollmentTracking) {
            return response()->json(['message' => 'Enrollment Tracking not found'], 404);
        }

        $enrollmentTracking->restore();
        return response()->json(['message' => 'Enrollment Tracking restored successfully']);
    }
}
