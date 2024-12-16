<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserWithProfileController extends Controller
{
    // Create a new user and profile in storage
    public function store(Request $request)
    {
        // Validate the input data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'nullable|email|unique:users,email|max:100',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id', // Foreign key reference
            //Profile Data
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'middle_initial' => 'nullable|string|max:20',
            'sex' => 'nullable|string|max:20',
            'marital_status' => 'nullable|string|max:20',
            'religion' => 'nullable|string|max:50',
            'age' => 'nullable|integer|min:0',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        // If validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Start a database transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Create the user
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $request->role_id,
            ]);

            // Create the profile and associate it with the user
            $profile = Profile::create([
                'user_id' => $user->id, // Link the profile to the user
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'middle_initial' => $request->middle_initial,
                'sex' => $request->sex,
                'marital_status' => $request->marital_status,
                'religion' => $request->religion,
                'age' => $request->age,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
            ]);

            // Commit the transaction
            DB::commit();

            // Return a success response
            return response()->json([
                'message' => 'User and Profile created successfully!',
                'user' => $user,
                'profile' => $profile
            ], 201);

        } catch (\Exception $e) {
            // If something goes wrong, roll back the transaction
            DB::rollBack();
            return response()->json(['error' => 'Failed to create user and profile: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        // Fetch the user with its associated profile
        $user = User::with('profile')->find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Return the user along with the associated profile
        return response()->json([
            'user' => $user,
            'profile' => $user->profile // Assuming the profile is related to the user
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username,' . $id,  // Ignore the current user's username during update
            'email' => 'nullable|email|unique:users,email,' . $id,  // Ignore the current user's email during update
            'password' => 'nullable|string|min:8', // Only validate if password is provided
            'status' => 'nullable|string|in:active,archived',
            'role' => 'required|exists:roles,id',  // Ensure the role exists
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'admission_date' => 'required|date',
            'religion' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'address' => 'required|string|max:255',
            'sex' => 'required|string|in:male,female,other',
            'phone_number' => 'required|string|max:15',
            'marital_status' => 'required|string|in:single,married,divorced',
            'program_department_id' => 'required|exists:college_program_departments,id',
            'yearlevel_id' => 'required|exists:year_levels,id',
        ]);

        // If validation fails, return the errors
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            // Start transaction to ensure atomicity
            DB::beginTransaction();

            // Find the user by ID or return an error if not found
            $user = User::findOrFail($id);

            // Update the user's fields with the request data
            $user->username = $request->input('username');
            $user->email = $request->input('email');
            $user->status = $request->input('status');
            $user->role_id = $request->input('role');

            // If a password is provided, hash and update it
            if ($request->has('password') && $request->input('password')) {
                $user->password = Hash::make($request->input('password'));
            }

            // Save the updated user
            $user->save();

            // Now update the profile linked to this user
            $profile = Profile::where('user_id', $user->id)->firstOrFail();

            // Update the profile with the request data
            $profile->first_name = $request->input('first_name');
            $profile->last_name = $request->input('last_name');
            $profile->middle_initial = $request->input('middle_initial');
            $profile->suffix = $request->input('suffix');
            $profile->admission_date = $request->input('admission_date');
            $profile->religion = $request->input('religion');
            $profile->date_of_birth = $request->input('date_of_birth');
            $profile->address = $request->input('address');
            $profile->sex = $request->input('sex');
            $profile->phone_number = $request->input('phone_number');
            $profile->marital_status = $request->input('marital_status');
            $profile->program_department_id = $request->input('program_department_id');
            $profile->yearlevel_id = $request->input('yearlevel_id');

            // Save the updated profile
            $profile->save();

            // Commit the transaction
            DB::commit();

            // Return a success response
            return response()->json([
                'message' => 'User and profile updated successfully!',
                'user' => $user,
                'profile' => $profile
            ], 200);

        } catch (\Exception $e) {
            // If an error occurs, rollback the transaction
            DB::rollBack();
            return response()->json(['error' => 'Failed to update user and profile: ' . $e->getMessage()], 500);
        }
    }

    public function createStudentProfile(Request $request)
{
    $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'admission_date' => 'required|date',
        'religion' => 'required|string|max:255',
        'date_of_birth' => 'required|date',
        'address' => 'required|string|max:255',
        'sex' => 'required|string|in:male,female,other',
        'phone_number' => 'required|string|max:15',
        'marital_status' => 'required|string|in:single,married,divorced',
        'program_department_id' => 'required|exists:college_program_departments,id', // Foreign key validation
        'yearlevel_id' => 'required|exists:year_levels,id', // Foreign key validation for year_levels table
    ]);


    DB::beginTransaction();
        try {
            // Step 1: Auto-generate username and email
            $username = strtolower($request->first_name) . '.' . strtolower($request->last_name);
            $email = $username . '@urios.edu.ph';
            $schoolEmail = $email; // School email for profiles table

            // Step 2: Generate password based on first name and hash it
            $password = bcrypt(strtolower($request->first_name) . '@123'); // Password as firstname@123, then hashed

            // Step 3: Create user in `users` table with the generated password
            $user = User::create([
                'username' => $username,
                'email' => $email,
                'role_id' => 4, // Assign role_id for a student
                'password' => $password, // Use hashed password
            ]);

            // Step 4: Create profile in `profiles` table
            $profile = Profile::create([
                'user_id' => $user->id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'middle_initial' => $request->middle_initial,
                'suffix' => $request->suffix,
                'admission_date' => $request->admission_date,
                'religion' => $request->religion,
                'date_of_birth' => $request->date_of_birth,
                'address' => $request->address,
                'sex' => $request->sex,
                'phone_number' => $request->phone_number,
                'marital_status' => $request->marital_status,
                'school_email' => $schoolEmail,
                'yearlevel_id' => $request->yearlevel_id,
                'program_department_id' => $request->program_department_id,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Student profile created successfully.',
                'user' => $user,
                'profile' => $profile,
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            \Log::error('Error creating student profile: ' . $e->getMessage()); // Log the error
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


}
