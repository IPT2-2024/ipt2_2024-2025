<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    // Display a listing of notifications
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $notifications = Notification::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $notifications = Notification::withTrashed()->get();
        } else {
            $notifications = Notification::all();
        }

        if ($notifications->isEmpty()) {
            return response()->json(['message' => 'No notifications found'], 404);
        }

        return response()->json($notifications);
    }

    // Store a newly created notification in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'event_id' => 'nullable|exists:events,id',
            'announcement_id' => 'nullable|exists:announcements,id',
            'enrollmenttracking_id' => 'nullable|exists:enrollment_tracking,id',
            'assignmenttracking_id' => 'nullable|exists:assignment_tracking,id',
            'profile_id' => 'nullable|exists:profiles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $notification = Notification::create($request->all());
        return response()->json(['message' => 'Notification created successfully', 'notification' => $notification], 201);
    }

    // Display the specified notification
    public function show($id)
    {
        $notification = Notification::withTrashed()->find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        return response()->json($notification);
    }

    // Update the specified notification in storage
    public function update(Request $request, $id)
    {
        $notification = Notification::withTrashed()->find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'event_id' => 'nullable|exists:events,id',
            'announcement_id' => 'nullable|exists:announcements,id',
            'enrollmenttracking_id' => 'nullable|exists:enrollment_tracking,id',
            'assignmenttracking_id' => 'nullable|exists:assignment_tracking,id',
            'profile_id' => 'nullable|exists:profiles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $notification->update($request->all());
        return response()->json(['message' => 'Notification updated successfully', 'notification' => $notification]);
    }

    // Remove the specified notification from storage
    public function destroy($id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }
        
        $notification->delete();
        return response()->json(['message' => 'Notification deleted successfully']);
    }

    // Restore the specified soft-deleted notification
    public function restore($id)
    {
        $notification = Notification::withTrashed()->find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->restore();
        return response()->json(['message' => 'Notification restored successfully']);
    }
}
