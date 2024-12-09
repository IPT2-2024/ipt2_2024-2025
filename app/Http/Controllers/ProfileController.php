<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage; 

class ProfileController extends Controller
{
    // Display a listing of profiles
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $profiles = Profile::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $profiles = Profile::withTrashed()->get();
        } else {
            $profiles = Profile::all();
        }

        if ($profiles->isEmpty()) {
            return response()->json(['message' => 'No profiles found'], 404);
        }

        return response()->json($profiles);
    }

    // Create a new profile in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'middle_initial' => 'nullable|string|max:20',
            'suffix' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'school_email' => 'nullable|email|unique:profiles,school_email|max:50',
            'sex' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'admission_date' => 'nullable|date',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'religion' => 'nullable|in:catholic,muslim,protestant,hindu',
            'photo_path' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048', // Add validation for the image
        ]);
    
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
    
        // Handle file upload if exists
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $path = $photo->store('profile_photos', 'public'); // Store photo in the "profile_photos" directory
    
            // Save the file path in the profile
            $profile = Profile::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                // Other fields here
                'photo_path' => $path, // Save the photo path in the database
            ]);
        } else {
            $profile = Profile::create($request->all());
        }
    
        return response()->json(['message' => 'Profile created successfully', 'profile' => $profile], 201);
    }
    
    // Update an existing profile in storage
    public function update(Request $request, $id)
    {
        $profile = Profile::withTrashed()->find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'middle_initial' => 'nullable|string|max:20',
            'suffix' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'school_email' => 'nullable|email|unique:profiles,school_email,' . $id . '|max:50',
            'sex' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'admission_date' => 'nullable|date',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'religion' => 'nullable|string',
            'photo_path' => 'nullable|string',
            'emer_full_name' => 'nullable|string|max:100',
            'relationship' => 'nullable|string|max:50',
            'emer_contact_no' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
            'program_department_id' => 'nullable|exists:college_program_departments,id',
            'yearlevel_id' => 'nullable|exists:year_levels,id',
            'parent_info_id' => 'nullable|exists:parent_infos,id',
            'department_id' => 'nullable|exists:departments,id',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate photo upload
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Handle file upload (if any)
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            // Delete the old photo if exists
            if ($profile->photo_path && Storage::exists('public/' . $profile->photo_path)) {
                Storage::delete('public/' . $profile->photo_path);
            }

            // Store the new photo
            $photoPath = $request->file('photo')->store('photos', 'public');
            $profile->photo_path = $photoPath;
        }

        $profile->update($request->all());
        return response()->json($profile, 200);
    }

    public function uploadPhoto(Request $request)
    {
        // Validate the file upload and profile_id
        $request->validate([
            'photo' => 'required|file|image|max:2048', // File validation
            'profile_id' => 'required|exists:profiles,id', // Ensure profile_id exists in the database
        ]);

        $profileId = $request->input('profile_id');  // Get the profile ID from the request

        // Retrieve the profile using the profile_id
        $profile = Profile::find($profileId);

        // Check if the profile exists
        if (!$profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        // Handle file upload logic
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $path = $request->file('photo')->store('photos', 'public');  // Store photo in the "photos" directory

            // Save the file path in the profile's photo_path field
            $profile->photo_path = $path;
            $profile->save();  // Save the profile with the updated photo_path

            return response()->json(['message' => 'Photo uploaded successfully!', 'path' => $path]);
        }

        return response()->json(['message' => 'Failed to upload photo.'], 400);
    }

    

    // Display the specified profile
    public function show($id)
    {
        try {
            // Retrieve profile including soft-deleted ones using withTrashed
            $profile = Profile::withTrashed()->find($id);

            // Check if the profile exists
            if (!$profile) {
                return response()->json(['message' => 'Profile not found'], 404);
            }

            // Return the profile data as a JSON response
            return response()->json($profile);
        } catch (\Exception $e) {
            // Log any errors for debugging purposes
            \Log::error('Error retrieving profile: ' . $e->getMessage());
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }


    // Soft delete the specified profile
    public function destroy($id)
    {
        $profile = Profile::find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        
        $profile->delete();
        return response()->json(['message' => 'Profile deleted successfully']);
    }

    // Restore the specified soft-deleted profile
    public function restore($id)
    {
        $profile = Profile::withTrashed()->find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->restore();
        return response()->json(['message' => 'Profile restored successfully']);
    }

    public function showByProfileId($profileId)
    {
        // Fetch the profile using the profileId
        $profile = Profile::find($profileId);

        // Check if the profile exists
        if ($profile) {
            return response()->json($profile);
        } else {
            return response()->json(['message' => 'Profile not found.'], 404);
        }
    }

    public function getTotalInstructors()
    {
        // Count instructors excluding soft-deleted users and profiles
        $totalInstructors = Profile::join('users', 'profiles.user_id', '=', 'users.id')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.role_name', 'teacher')
            ->whereNull('users.deleted_at')
            ->whereNull('profiles.deleted_at')
            ->count();

        return response()->json(['totalInstructors' => $totalInstructors]);
    }

    public function getTotalStudents()
    {

        $studentRoleId = 4;
        // Count students excluding soft-deleted users and profiles
        $totalStudents = Profile::join('users', 'profiles.user_id', '=', 'users.id')
            ->where('users.role_id', $studentRoleId)
            ->whereNull('users.deleted_at') // Exclude soft-deleted users
            ->whereNull('profiles.deleted_at') // Exclude soft-deleted profiles
            ->count();

        return response()->json(['totalStudents' => $totalStudents]);
    }

    public function deletePhoto($profileId)
    {
        $profile = Profile::find($profileId);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        if ($profile->photo_path && Storage::exists('public/' . $profile->photo_path)) {
            Storage::delete('public/' . $profile->photo_path);
        }

        $profile->photo_path = null;  // Remove the photo path from the profile
        $profile->save();

        return response()->json(['message' => 'Old photo deleted successfully']);
    }

}
