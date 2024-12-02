<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassScheduleController extends Controller
{
    // Display a listing of class schedules
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $classSchedules = ClassSchedule::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $classSchedules = ClassSchedule::withTrashed()->get();
        } else {
            $classSchedules = ClassSchedule::all();
        }

        if ($classSchedules->isEmpty()) {
            return response()->json(['message' => 'No class schedules found'], 404);
        }

        return response()->json($classSchedules);
    }

    // Store a newly created class schedule in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'classifiedsection_id' => 'required|exists:classified_sections,id',
            'academicprogram_id' => 'required|exists:academic_programs,id',
            'classroomscheduling_id' => 'required|exists:classroom_scheduling,id',
            'profile_id' => 'nullable|exists:profiles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classSchedule = ClassSchedule::create($request->all());
        return response()->json(['message' => 'Class Schedule created successfully', 'classSchedule' => $classSchedule], 201);
    }

    // Display the specified class schedule
    public function show($id)
    {
        $classSchedule = ClassSchedule::withTrashed()->find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }
        return response()->json($classSchedule);
    }

    // Update the specified class schedule in storage
    public function update(Request $request, $id)
    {
        $classSchedule = ClassSchedule::withTrashed()->find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'classifiedsection_id' => 'required|exists:classified_sections,id',
            'academicprogram_id' => 'required|exists:academic_programs,id',
            'classroomscheduling_id' => 'required|exists:classroom_scheduling,id',
            'profile_id' => 'nullable|exists:profiles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classSchedule->update($request->all());
        return response()->json(['message' => 'Class Schedule updated successfully', 'classSchedule' => $classSchedule]);
    }

    // Remove the specified class schedule from storage
    public function destroy($id)
    {
        $classSchedule = ClassSchedule::find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }
        
        $classSchedule->delete();
        return response()->json(['message' => 'Class Schedule deleted successfully']);
    }

    // Restore the specified soft-deleted class schedule
    public function restore($id)
    {
        $classSchedule = ClassSchedule::withTrashed()->find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }

        $classSchedule->restore();
        return response()->json(['message' => 'Class Schedule restored successfully']);
    }
}
