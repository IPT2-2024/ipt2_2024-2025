<?php

namespace App\Http\Controllers;

use App\Models\ClassroomScheduling;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassroomSchedulingController extends Controller
{
    // Display a listing of classroom schedules
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $classroomSchedules = ClassroomScheduling::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $classroomSchedules = ClassroomScheduling::withTrashed()->get();
        } else {
            $classroomSchedules = ClassroomScheduling::all();
        }

        if ($classroomSchedules->isEmpty()) {
            return response()->json(['message' => 'No classroom schedules found'], 404);
        }

        return response()->json($classroomSchedules);
    }

    // Store a newly created classroom schedule in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'time_start' => 'required|string|max:50',
            'time_end' => 'required|string|max:50',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classroomSchedule = ClassroomScheduling::create($request->all());
        return response()->json(['message' => 'Classroom Schedule created successfully', 'classroomSchedule' => $classroomSchedule], 201);
    }

    // Display the specified classroom schedule
    public function show($id)
    {
        $classroomSchedule = ClassroomScheduling::withTrashed()->find($id);
        if (!$classroomSchedule) {
            return response()->json(['message' => 'Classroom Schedule not found'], 404);
        }
        return response()->json($classroomSchedule);
    }

    // Update the specified classroom schedule in storage
    public function update(Request $request, $id)
    {
        $classroomSchedule = ClassroomScheduling::withTrashed()->find($id);
        if (!$classroomSchedule) {
            return response()->json(['message' => 'Classroom Schedule not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'time_start' => 'required|string|max:50',
            'time_end' => 'required|string|max:50',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classroomSchedule->update($request->all());
        return response()->json(['message' => 'Classroom Schedule updated successfully', 'classroomSchedule' => $classroomSchedule]);
    }

    // Remove the specified classroom schedule from storage
    public function destroy($id)
    {
        $classroomSchedule = ClassroomScheduling::find($id);
        if (!$classroomSchedule) {
            return response()->json(['message' => 'Classroom Schedule not found'], 404);
        }
        
        $classroomSchedule->delete();
        return response()->json(['message' => 'Classroom Schedule deleted successfully']);
    }

    // Restore the specified soft-deleted classroom schedule
    public function restore($id)
    {
        $classroomSchedule = ClassroomScheduling::withTrashed()->find($id);
        if (!$classroomSchedule) {
            return response()->json(['message' => 'Classroom Schedule not found'], 404);
        }

        $classroomSchedule->restore();
        return response()->json(['message' => 'Classroom Schedule restored successfully']);
    }
}
