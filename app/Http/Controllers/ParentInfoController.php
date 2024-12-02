<?php

namespace App\Http\Controllers;

use App\Models\ParentInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ParentInfoController extends Controller
{
    // Display a listing of parent infos
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $parentInfos = ParentInfo::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $parentInfos = ParentInfo::withTrashed()->get();
        } else {
            $parentInfos = ParentInfo::all();
        }

        if ($parentInfos->isEmpty()) {
            return response()->json(['message' => 'No parent infos found'], 404);
        }

        return response()->json($parentInfos);
    }

    // Create a new parent info in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'father_first_name' => 'nullable|string|max:100',
            'father_last_name' => 'nullable|string|max:50',
            'father_middle_initial' => 'nullable|string|max:20',
            'father_suffix' => 'nullable|string|max:20',
            'father_occupation' => 'nullable|string|max:50',
            'father_address' => 'nullable|string',
            'father_contact_no' => 'nullable|string|max:20',
            'mother_first_name' => 'nullable|string|max:100',
            'mother_last_name' => 'nullable|string|max:50',
            'mother_middle_initial' => 'nullable|string|max:20',
            'mother_occupation' => 'nullable|string|max:50',
            'mother_address' => 'nullable|string',
            'mother_contact_no' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $parentInfo = ParentInfo::create($request->all());
        return response()->json($parentInfo, 201);
    }

    // Update an existing parent info in storage
    public function update(Request $request, $id)
    {
        $parentInfo = ParentInfo::withTrashed()->find($id);
        if (!$parentInfo) {
            return response()->json(['message' => 'Parent Info not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'father_first_name' => 'nullable|string|max:100',
            'father_last_name' => 'nullable|string|max:50',
            'father_middle_initial' => 'nullable|string|max:20',
            'father_suffix' => 'nullable|string|max:20',
            'father_occupation' => 'nullable|string|max:50',
            'father_address' => 'nullable|string',
            'father_contact_no' => 'nullable|string|max:20',
            'mother_first_name' => 'nullable|string|max:100',
            'mother_last_name' => 'nullable|string|max:50',
            'mother_middle_initial' => 'nullable|string|max:20',
            'mother_occupation' => 'nullable|string|max:50',
            'mother_address' => 'nullable|string',
            'mother_contact_no' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $parentInfo->update($request->all());
        return response()->json($parentInfo, 200);
    }

    // Display the specified parent info
    public function show($id)
    {
        $parentInfo = ParentInfo::withTrashed()->find($id);
        if (!$parentInfo) {
            return response()->json(['message' => 'Parent Info not found'], 404);
        }
        return response()->json($parentInfo);
    }

    // Soft delete the specified parent info
    public function destroy($id)
    {
        $parentInfo = ParentInfo::find($id);
        if (!$parentInfo) {
            return response()->json(['message' => 'Parent Info not found'], 404);
        }
        
        $parentInfo->delete();
        return response()->json(['message' => 'Parent Info deleted successfully']);
    }

    // Restore the specified soft-deleted parent info
    public function restore($id)
    {
        $parentInfo = ParentInfo::withTrashed()->find($id);
        if (!$parentInfo) {
            return response()->json(['message' => 'Parent Info not found'], 404);
        }

        $parentInfo->restore();
        return response()->json(['message' => 'Parent Info restored successfully']);
    }
}
