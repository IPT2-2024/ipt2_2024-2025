<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Display a listing of users
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        // Eager load the 'role' relationship to get the role_name
        if ($deleted === 'only') {
            $users = User::onlyTrashed()->with('role')->get();
        } elseif ($deleted === 'true') {
            $users = User::withTrashed()->with('role')->get();
        } else {
            $users = User::with('role')->get();
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
            'status' => 'nullable|string|in:regular,irregular, active, archived',
            'role_id' => 'required|exists:roles,id', // Validating role_id
            'profile_id' => 'required|exists:profiles,id', // Profile field
            'first_name' => 'required|string|max:50',
            'middle_initial' => 'nullable|string|max:10',
            'last_name' => 'required|string|max:50',
            'sex' => 'required|string|in:male,female',
            'marital_status' => 'nullable|string',
            'religion' => 'nullable|string',
            'age' => 'nullable|integer',
            'phone_number' => 'nullable|string|max:15',
            'address' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create user in the users table
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'status' => $request->status,
            'role_id' => $request->role_id,  // Store selected role_id
        ]);

        // Create profile in the profile table
        $user->profile()->create([
            'first_name' => $request->first_name,
            'middle_initial' => $request->middle_initial,
            'last_name' => $request->last_name,
            'sex' => $request->sex,
            'marital_status' => $request->marital_status,
            'religion' => $request->religion,
            'age' => $request->age,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
        ]);

        return response()->json($user, 201);
    }



    // Update an existing user in storage
    public function update(Request $request, $id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Validate the input fields
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username,' . $id,
            'email' => 'required|email|unique:users,email,' . $id . '|max:100',
            'password' => 'nullable|string|min:8', // Password is optional in the update
            'status' => 'nullable|string|in:active,archived,regular,irregular',  // Updated status validation
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Prepare the update data
        $updatedData = [
            'username' => $request->username,
            'email' => $request->email,
            'status' => $request->status,
            'role_id' => $request->role_id,
        ];

        // If password is provided, hash it and update
        if ($request->password) {
            $updatedData['password'] = Hash::make($request->password);
        }

        // Handle the soft delete logic based on status
        if ($request->status === 'archived') {
            // Soft delete: set the 'deleted_at' timestamp to the current time
            $user->delete();
        } elseif ($user->status === 'archived' && $request->status !== 'archived') {
            // Restore user if the status is changed from 'archived' to another status
            $user->restore();
        }

        // Update user with the validated data
        $user->update($updatedData);

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

    public function getActiveUserCount()
    {
        // Count only non-soft-deleted users
        $activeUserCount = User::whereNull('deleted_at')->count();

        return response()->json(['totalUsersNotDeleted' => $activeUserCount]);
    }
    

}
