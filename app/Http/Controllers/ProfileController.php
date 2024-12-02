<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

        // Handle file upload
        $photoPath = null;
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $photoPath = $request->file('photo')->store('profile_photos', 'public'); // Store the file in 'storage/app/public/photos'
        }

        $profile = Profile::create($request->all());
        return response()->json($profile, 201);
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

    public function uploadPhoto(Request $request, $id)
{
    // Validate the incoming request to ensure 'photo' is an image
    $validator = Validator::make($request->all(), [
        'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
    ]);

    if ($validator->fails()) {
        return response()->json([
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    // Handle the file upload and store it in public/profile_photos directory
    $photo = $request->file('photo');
    $photoPath = $photo->getClientOriginalName(); // Get the original filename
    $photo->move(public_path('profile_photos'), $photoPath); // Save it directly in the public/profile_photos folder

    // Store the file path in the database (assuming you have a Profile model)
    $profile = Profile::find($id);
    $profile->photo_path = 'profile_photos/' . $photoPath; // Store relative path
    $profile->save();

    return response()->json([
        'message' => 'Profile photo uploaded successfully',
        'photo_path' => 'profile_photos/' . $photoPath
    ], 200);
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

}
