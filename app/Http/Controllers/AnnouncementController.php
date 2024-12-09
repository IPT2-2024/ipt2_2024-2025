<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    // Display a listing of announcements
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $announcements = Announcement::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $announcements = Announcement::withTrashed()->get();
        } else {
            $announcements = Announcement::all();
        }

        if ($announcements->isEmpty()) {
            return response()->json(['message' => 'No announcements found'], 404);
        }

        return response()->json($announcements);
    }

    // Store a newly created announcement in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'announcement' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Sanitize the 'announcement' to ensure it's a string
        $announcement = Announcement::create([
            'announcement' => (string)$request->announcement, // Ensure it's a string
        ]);

        return response()->json([
            'message' => 'Announcement created successfully',
            'announcement' => $announcement,
        ], 201);
    }

    // Display the specified announcement
    public function show($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        // Log the announcement text to ensure it's a string
        \Log::info('Announcement text:', ['announcement' => $announcement->announcement]);

        return response()->json($announcement);
    }


    // Update the specified announcement in storage
    public function update(Request $request, $id)
    {
        $announcement = Announcement::withTrashed()->find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'announcement' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Ensure the 'announcement' field is a string before saving it
        $announcement->update([
            'announcement' => (string)$request->announcement,
        ]);

        return response()->json([
            'message' => 'Announcement updated successfully',
            'announcement' => $announcement,
        ]);
    }

    // Remove the specified announcement from storage
    public function destroy($id)
    {
        $announcement = Announcement::find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }
        
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted successfully']);
    }

    // Restore the specified soft-deleted announcement
    public function restore($id)
    {
        $announcement = Announcement::withTrashed()->find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        $announcement->restore();
        return response()->json(['message' => 'Announcement restored successfully']);
    }
}
