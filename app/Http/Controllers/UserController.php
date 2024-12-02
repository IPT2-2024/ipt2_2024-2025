<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Display a listing of users
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $users = User::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $users = User::withTrashed()->get();
        } else {
            $users = User::all();
        }

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found'], 404);
        }

        return response()->json($users);
    }

    // Create a new user in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email|max:100',
            'password' => 'required|string|min:8',
            'status' => 'nullable|string|in:regular,irregular',
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create($request->all());
        return response()->json($user, 201);
    }

    // Update an existing user in storage
    public function update(Request $request, $id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username,' . $id,
            'email' => 'required|email|unique:users,email,' . $id . '|max:100',
            'password' => 'nullable|string|min:8',
            'status' => 'nullable|string|in:regular,irregular',
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user->update($request->all());
        return response()->json($user, 200);
    }

    // Display the specified user
    public function show($id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    // Soft delete the specified user
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Restore the specified soft-deleted user
    public function restore($id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->restore();
        return response()->json(['message' => 'User restored successfully']);
    }
}
