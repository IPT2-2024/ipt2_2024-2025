<?php

namespace App\Http\Controllers;

use App\Models\Enlistment;
use App\Models\Profile;
use App\Models\Subject;
use App\Models\ClassSchedule;
use App\Models\SemesterAcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class EnlistmentController extends Controller
{
    // Display a listing of enlistments
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        // Determine query for deleted and active enlistments
        if ($deleted === 'only') {
            $query = Enlistment::onlyTrashed();
        } elseif ($deleted === 'true') {
            $query = Enlistment::withTrashed();
        } else {
            $query = Enlistment::query();
        }

        // Eager load relationships and filter by role_id = 4
        $enlistments = $query->whereHas('profile.user', function ($query) {
            $query->where('role_id', 4); // Only retrieve users with role_id = 4
        })->with([
            'profile.user.role',
            'profile.college_program_department.collegeprogram', // Load college program
            'profile.yearLevel', // Load year level
            'classSchedule',
            'academicYear',
        ])->get();

        // Debugging: Log the raw enlistments data with relationships
        \Log::info('Filtered Enlistments Data:', $enlistments->toArray());

        // Format data for response
        $formattedData = $enlistments->map(function ($enlistment) {
            $profile = $enlistment->profile;

            // Handle missing profile gracefully
            if (!$profile) {
                \Log::warning("Profile missing for Enlistment ID: {$enlistment->id}");
                return null;
            }

            $user = $profile->user;

            // Profile ID formatting
            $admissionYear = optional($profile->admission_date)->year ?? '0000'; // Fallback to '0000' if null
            $formattedId = str_pad($profile->id, 4, '0', STR_PAD_LEFT);
            $profileIdFormatted = "S{$admissionYear}{$formattedId}";

            // Full Name formatting
            $middleInitial = $profile->middle_initial ? strtoupper($profile->middle_initial) . '.' : '';
            $suffix = $profile->suffix ? ", {$profile->suffix}" : '';
            $fullName = "{$profile->last_name}, {$profile->first_name} {$middleInitial}{$suffix}";

            // Status determination
            $status = $user->status ?? 'Unknown';

            // Program and Year Level
            $program = optional(optional($profile->college_program_department)->collegeprogram)->college_programs ?? 'N/A';
            $yearLevel = optional($profile->yearLevel)->year_level ?? 'N/A';

            return [
                'id' => $enlistment->id,
                'raw_profile_id' => $profile->id,
                'profile_id' => $profileIdFormatted,
                'full_name' => $fullName,
                'program' => $program,
                'year_level' => $yearLevel,
                'status' => $status,
                'created_at' => $enlistment->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $enlistment->updated_at->format('Y-m-d H:i:s'),
            ];
        })->filter();

        return $formattedData->isEmpty()
            ? response()->json(['message' => 'No enlistments found'], 404)
            : response()->json($formattedData);
    }








    // Store a newly created enlistment in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'profile_id' => 'nullable|exists:profiles,id',
            'classschedules_id' => 'nullable|exists:class_schedules,id',
            'academicyear_id' => 'nullable|exists:academic_year,id',
            'semester_id' => 'nullable|exists:semester,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $enlistment = Enlistment::create($request->all());
        return response()->json(['message' => 'Enlistment created successfully', 'enlistment' => $enlistment], 201);
    }

    // Display the specified enlistment
    public function show($id)
{
    $enlistment = Enlistment::withTrashed()->with([
        'profile.user.role',
        'profile.college_program_department.collegeprogram',
        'profile.yearLevel',
        'classSchedule',
        'academicYear',
    ])->find($id);

    if (!$enlistment) {
        return response()->json(['message' => 'Enlistment not found'], 404);
    }

    $profile = $enlistment->profile;

    // Handle missing profile gracefully
    if (!$profile) {
        \Log::warning("Profile missing for Enlistment ID: {$enlistment->id}");
        return response()->json(['message' => 'Profile missing for this enlistment'], 404);
    }

    $user = $profile->user;

    // Profile ID formatting
    $admissionYear = optional($profile->admission_date)->year ?? '0000'; // Fallback to '0000' if null
    $formattedId = str_pad($profile->id, 4, '0', STR_PAD_LEFT);
    $profileIdFormatted = "S{$admissionYear}{$formattedId}";

    // Full Name formatting
    $middleInitial = $profile->middle_initial ? strtoupper($profile->middle_initial) . '.' : '';
    $suffix = $profile->suffix ? ", {$profile->suffix}" : '';
    $fullName = "{$profile->last_name}, {$profile->first_name} {$middleInitial}{$suffix}";

    // Status determination
    $status = $user->status ?? 'Unknown';

    // Program and Year Level
    $program = optional(optional($profile->college_program_department)->collegeprogram)->college_programs ?? 'N/A';
    $yearLevel = optional($profile->yearLevel)->year_level ?? 'N/A';

    // Format the enlistment data
    $formattedEnlistment = [
        'id' => $enlistment->id,
        'raw_profile_id' => $profile->id,
        'profile_id' => $profileIdFormatted,
        'full_name' => $fullName,
        'program' => $program,
        'year_level' => $yearLevel,
        'status' => $status,
        'classschedules_id' => $enlistment->classschedules_id,
        'academicyear_id' => $enlistment->academicyear_id,
        'semester_id' => $enlistment->semester_id,
        'created_at' => $enlistment->created_at->format('Y-m-d H:i:s'),
        'updated_at' => $enlistment->updated_at->format('Y-m-d H:i:s'),
    ];

    return response()->json($formattedEnlistment);
}


    // Update the specified enlistment in storage
    public function update(Request $request, $id)
    {
        $enlistment = Enlistment::find($id);
        if (!$enlistment) {
            return response()->json(['message' => 'Enlistment not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'profile_id' => 'nullable|exists:profiles,id',
            'classschedules_id' => 'nullable|exists:class_schedules,id',
            'academicyear_id' => 'nullable|exists:academic_year,id',
            'semester_id' => 'nullable|exists:semester,id',
            'status' => 'nullable|in:active,archived,regular,irregular',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            \DB::beginTransaction();

            // Update the user's status
            $profile = Profile::findOrFail($request->profile_id);
            $user = $profile->user;
            $user->status = $request->status;
            $user->save();

            // Update the enlistment record
            $enlistment->update([
                'profile_id' => $request->profile_id,
                'classschedules_id' => $request->classschedules_id,
                'academicyear_id' => $request->academicyear_id,
                'semester_id' => $request->semester_id,
            ]);

            \DB::commit();

            return response()->json(['message' => 'Enlistment updated successfully', 'enlistment' => $enlistment]);
        } catch (\Exception $e) {
            \DB::rollBack();

            // Log error for debugging
            \Log::error('Error updating enlistment', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Failed to update enlistment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    // Remove the specified enlistment from storage
    public function destroy($id)
    {
        $enlistment = Enlistment::find($id);
        if (!$enlistment) {
            return response()->json(['message' => 'Enlistment not found'], 404);
        }

        $enlistment->delete();
        return response()->json(['message' => 'Enlistment deleted successfully']);
    }

    // Restore the specified soft-deleted enlistment
    public function restore($id)
    {
        $enlistment = Enlistment::withTrashed()->find($id);
        if (!$enlistment) {
            return response()->json(['message' => 'Enlistment not found'], 404);
        }

        $enlistment->restore();
        return response()->json(['message' => 'Enlistment restored successfully']);
    }

    public function getEnlistmentData(Request $request)
    {
        $type = $request->query('type');
        $subjectId = $request->query('subject_id'); // For filtering sections and schedules

        if ($type === 'profiles') {
            // Fetch profiles with role_id = 4 and not already enlisted
            $alreadyEnlistedProfileIds = Enlistment::pluck('profile_id')->toArray();
        
            $profiles = Profile::whereHas('user', function ($query) {
                $query->where('role_id', 4); // Assuming role_id = 4 is for students
            })
            ->whereNotIn('id', $alreadyEnlistedProfileIds) // Exclude already enlisted profiles
            ->select('id', 'last_name', 'first_name', 'middle_initial', 'suffix', 'admission_date')
            ->get()
            ->map(function ($profile) {
                $admissionYear = $profile->admission_date ? date('Y', strtotime($profile->admission_date)) : '0000';
                $formattedId = sprintf('S%s%04d', $admissionYear, $profile->id);
        
                $middleInitial = $profile->middle_initial ? strtoupper($profile->middle_initial) . '.' : '';
                $suffix = $profile->suffix ? ', ' . $profile->suffix : '';
                $fullName = "{$profile->last_name}, {$profile->first_name} {$middleInitial}{$suffix}";
        
                return [
                    'id' => $profile->id,
                    'formatted_profile_id' => $formattedId,
                    'full_name' => $fullName,
                ];
            });
        
            return response()->json($profiles);
        }        
        

        if ($type === 'subjects') {
            // Fetch all subjects with subject_code and subject_name
            $subjects = Subject::select('id', 'subject_code', 'subject_name')
                ->get()
                ->map(function ($subject) {
                    return [
                        'id' => $subject->id,
                        'formatted_subject' => "{$subject->subject_code} - {$subject->subject_name}",
                    ];
                });

            return response()->json($subjects);
        }

        if ($type === 'sections_and_schedules' && $subjectId) {
            $classSchedules = ClassSchedule::whereHas('academicProgram.subjectCurriculum.subject', function ($query) use ($subjectId) {
                $query->where('id', $subjectId);
            })
            ->with(['classifiedSection.section'])
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'section' => $schedule->classifiedSection->section->section_name,
                    'day_of_week' => $schedule->day_of_week,
                    'start_time' => $schedule->start_time,
                    'end_time' => $schedule->end_time,
                ];
            });

            return response()->json($classSchedules);
        }

        return response()->json(['message' => 'Invalid request type or missing parameters'], 400);
    }





    public function storeMultiple(Request $request)
{

    \Log::info('Incoming Payload:', $request->all());
    // Validate the request payload
    $validator = Validator::make($request->all(), [
        '*.profile_id' => 'nullable|exists:profiles,id',
        '*.subject_id' => 'nullable|exists:subjects,id',
        '*.section_and_schedule_id' => 'nullable|exists:class_schedules,id',
        '*.status' => 'nullable|in:active,archived,regular,irregular', // Validate status
    ]);

    if ($validator->fails()) {
        return response()->json(['message' => 'Validation error', 'errors' => $validator->errors()], 422);
    }

    // Check for duplicate enlistments
    $duplicateCheck = collect($request->all())->filter(function ($enlistmentData) {
        return Enlistment::where('profile_id', $enlistmentData['profile_id'])
            ->where('classschedules_id', $enlistmentData['section_and_schedule_id'])
            ->exists();
    });

    if ($duplicateCheck->isNotEmpty()) {
        return response()->json([
            'message' => 'Duplicate enlistments detected',
            'duplicates' => $duplicateCheck,
        ], 422);
    }

    try {
        // Use a database transaction for atomicity
        \DB::beginTransaction();

        // Create enlistments
        $enlistments = collect($request->all())->map(function ($enlistmentData) {

            $profile = Profile::findOrFail($enlistmentData['profile_id']);
            $user = $profile->user;
            $user->status = $enlistmentData['status'];
            $user->save();
            return Enlistment::create([
                'profile_id' => $enlistmentData['profile_id'],
                'classschedules_id' => $enlistmentData['section_and_schedule_id'],
                'academicyear_id' => $enlistmentData['academicyear_id'] ?? null,
                'semester_id' => $enlistmentData['semester_id'] ?? null,
            ]);
        });

        \DB::commit();

        return response()->json([
            'message' => 'Enlistments created successfully',
            'enlistments' => $enlistments,
        ], 201);
    } catch (\Exception $e) {
        \DB::rollBack();

        // Log the error for debugging
        \Log::error('Error creating enlistments', ['error' => $e->getMessage()]);

        return response()->json([
            'message' => 'Failed to create enlistments',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    public function getActiveAcademicYearAndSemester()
    {
        $activeRecord = SemesterAcademicYear::where('status', 1)
            ->with(['academicYear', 'semester'])
            ->first();

        if (!$activeRecord) {
            return response()->json(['message' => 'No active academic year and semester found'], 404);
        }

        return response()->json([
            'academic_year_id' => $activeRecord->academicyear_id,
            'academic_year' => $activeRecord->academicYear->academic_year,
            'semester_id' => $activeRecord->semester_id,
            'semester' => $activeRecord->semester->semester_period,
        ]);
    }

    public function getEnlistedSubjectsByProfile($profileId)
    {
        $subjects = DB::table('enlistments')
            ->join('class_schedules', 'class_schedules.id', '=', 'enlistments.classschedules_id')
            ->join('academic_programs', 'academic_programs.id', '=', 'class_schedules.academicprogram_id')
            ->join('subject_curriculums', 'subject_curriculums.id', '=', 'academic_programs.subjectcurriculum_id')
            ->join('subjects', 'subjects.id', '=', 'subject_curriculums.subject_id')
            ->where('enlistments.profile_id', $profileId)
            ->select(
                'enlistments.id as enlistment_id',
                'subjects.id as subject_id',
                'subjects.subject_code',
                'subjects.subject_name',
                'class_schedules.day_of_week',
                'class_schedules.start_time',
                'class_schedules.end_time',
                'academic_programs.id as academic_program_id',
                'class_schedules.classifiedsection_id'
            )
            ->get();

        if ($subjects->isEmpty()) {
            return response()->json(['message' => 'No subjects found for this profile'], 404);
        }

        return response()->json($subjects);
    }


}
