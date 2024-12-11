<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EnlistmentController extends Controller
{
    public function getEnlistments()
    {
        $enlistments = DB::table('profiles')  // replace 'enlistments' with your actual table name
            ->get();
        return response()->json($enlistments);
    }
}
