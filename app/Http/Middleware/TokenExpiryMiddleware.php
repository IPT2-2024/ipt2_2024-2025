<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class TokenExpiryMiddleware
{
    /**
     * The token expiry duration in minutes.
     *
     * @var int
     */
    protected $expiryMinutes = 30;

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user) {
            $token = $user->currentAccessToken();

            if ($token) {
                $tokenCreationTime = $token->created_at;
                $now = Carbon::now();

                if ($tokenCreationTime->diffInMinutes($now) > $this->expiryMinutes) {
                    // Revoke the token
                    $token->delete();

                    return response()->json(['message' => 'Session expired. Please log in again.'], 401);
                }
            }
        }

        return $next($request);
    }
}
