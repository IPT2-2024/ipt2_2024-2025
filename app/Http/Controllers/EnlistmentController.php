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

    // Determine query for deleted and active enlistments
    if ($deleted === 'only') {
        $query = Enlistment::onlyTrashed();
    } elseif ($deleted === 'true') {
        $query = Enlistment::withTrashed();
    } else {
        $query = Enlistment::query();
    }

    // Eager load relationships and filter by role_id = 4
    $enlistments = $query->whereHas('profile.user', function ($query) {
        $query->where('role_id', 4); // Only retrieve users with role_id = 4
    })->with([
        'profile.user.role',
        'profile.college_program_department.collegeprogram', // Load college program
        'profile.yearLevel', // Load year level
        'classSchedule',
        'academicYear',
    ])->get();

    // Debugging: Log the raw enlistments data with relationships
    \Log::info('Filtered Enlistments Data:', $enlistments->toArray());

    // Format data for response
    $formattedData = $enlistments->map(function ($enlistment) {
        $profile = $enlistment->profile;

        // Handle missing profile gracefully
        if (!$profile) {
            \Log::warning("Profile missing for Enlistment ID: {$enlistment->id}");
            return null;
        }

        $user = $profile->user;

        // Profile ID formatting
        $admissionYear = optional($profile->admission_date)->year ?? '0000'; // Fallback to '0000' if null
        $formattedId = str_pad($profile->id, 4, '0', STR_PAD_LEFT);
        $profileIdFormatted = "S{$admissionYear}{$formattedId}";

        // Full Name formatting
        $middleInitial = $profile->middle_initial ? strtoupper($profile->middle_initial) . '.' : '';
        $suffix = $profile->suffix ? ", {$profile->suffix}" : '';
        $fullName = "{$profile->last_name}, {$profile->first_name} {$middleInitial}{$suffix}";

        // Status determination
        $status = $user->status ?? 'Unknown';

        // Program and Year Level
        $program = optional(optional($profile->college_program_department)->collegeprogram)->college_programs ?? 'N/A';
        $yearLevel = optional($profile->yearLevel)->year_level ?? 'N/A';

        return [
            'id' => $enlistment->id,
            'profile_id' => $profileIdFormatted,
            'full_name' => $fullName,
            'program' => $program,
            'year_level' => $yearLevel,
            'status' => $status,
            'created_at' => $enlistment->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $enlistment->updated_at->format('Y-m-d H:i:s'),
        ];
    })->filter();

    return $formattedData->isEmpty()
        ? response()->json(['message' => 'No enlistments found'], 404)
        : response()->json($formattedData);
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
