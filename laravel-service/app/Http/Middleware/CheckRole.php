<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Enums\Role;
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->failure('Unauthenticated.', 401);
        }

        $userRole = $user->role?->value;

        if ($userRole === Role::ADMIN->value || in_array($userRole, $roles)) {
            return $next($request);
        }

        return response()->failure('Forbidden. You do not have the required role.', 403);
    }
}
