<?php

namespace App\Http\Controllers;

use App\Models\Roomtag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoomTagController extends Controller
{
    // Display a listing of room tags
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $roomTags = Roomtag::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $roomTags = Roomtag::withTrashed()->get();
        } else {
            $roomTags = Roomtag::all();
        }

        if ($roomTags->isEmpty()) {
            return response()->json(['message' => 'No room tags found'], 404);
        }

        return response()->json($roomTags);
    }

    // Store a newly created room tag in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'room_tag' => 'required|string|max:50',
            'room_tag_type' => 'required|in:numerical,functional',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $roomTag = Roomtag::create($request->all());
        return response()->json(['message' => 'Room Tag created successfully', 'roomTag' => $roomTag], 201);
    }

    // Display the specified room tag
    public function show($id)
    {
        $roomTag = Roomtag::withTrashed()->find($id);
        if (!$roomTag) {
            return response()->json(['message' => 'Room Tag not found'], 404);
        }
        return response()->json($roomTag);
    }

    // Update the specified room tag in storage
    public function update(Request $request, $id)
    {
        $roomTag = Roomtag::withTrashed()->find($id);
        if (!$roomTag) {
            return response()->json(['message' => 'Room Tag not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'room_tag' => 'required|string|max:50',
            'room_tag_type' => 'required|in:numerical,functional',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $roomTag->update($request->all());
        return response()->json(['message' => 'Room Tag updated successfully', 'roomTag' => $roomTag]);
    }

    // Remove the specified room tag from storage
    public function destroy($id)
    {
        $roomTag = Roomtag::find($id);
        if (!$roomTag) {
            return response()->json(['message' => 'Room Tag not found'], 404);
        }
        
        $roomTag->delete();
        return response()->json(['message' => 'Room Tag deleted successfully']);
    }

    // Restore the specified soft-deleted room tag
    public function restore($id)
    {
        $roomTag = Roomtag::withTrashed()->find($id);
        if (!$roomTag) {
            return response()->json(['message' => 'Room Tag not found'], 404);
        }

        $roomTag->restore();
        return response()->json(['message' => 'Room Tag restored successfully']);
    }

    // Retrieve all soft-deleted room tags
    public function getDeletedRoomTags()
    {
        $deletedRoomTags = Roomtag::onlyTrashed()->get();
        if ($deletedRoomTags->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted room tags found'], 404);
        }
        return response()->json($deletedRoomTags);
    }
}
