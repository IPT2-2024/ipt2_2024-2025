<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;
use Validator;

class AuthController extends Controller
{
    /**
     * Handle login request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        // Validate input
        $credentials = $request->only('username', 'password');
        $validator = Validator::make($credentials, [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }
    
        // Check if username exists
        $user = User::where('username', $request->username)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }
    
        // Authenticate user and generate token
        $token = $user->createToken('YourAppName')->plainTextToken;
    
        // Retrieve the profile associated with the user
        $profile = Profile::where('user_id', $user->id)->first();
        
        // Check if profile exists and get profile_id and user_id from profile
        if ($profile) {
            $profileId = $profile->id;  // This is the profile's ID (primary key)
            $profileUserId = $profile->user_id;  // This is the user_id in the Profile model (foreign key)
        } else {
            $profileId = null;  // If profile doesn't exist
            $profileUserId = null;  // If profile doesn't exist
        }
    
        // Return response with token, profile_id, and user_id (from Profile)
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'role' => optional($user->role)->role_name,
            'user_id' => $profileUserId,  // user_id from Profile model
            'profile_id' => $profileId,  // profile_id from Profile model
        ]);
    }
    

    /**
     * Handle logout request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        // Check if the user is authenticated
        if ($request->user()) {
            // Revoke (delete) the current access token
            $request->user()->currentAccessToken()->delete();
    
            return response()->json(['message' => 'Logged out successfully']);
        }
    
        return response()->json(['message' => 'Unauthenticated'], 401);
    }
    

    /**
     * Get the authenticated user details.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function user(Request $request)
    {
        // Return authenticated user data
        return response()->json($request->user());
    }
}

