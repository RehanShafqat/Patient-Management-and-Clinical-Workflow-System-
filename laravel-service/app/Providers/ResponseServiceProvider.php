<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Response;

class ResponseServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Response::macro('success', function ($data = [], int $status = 200) {
            return Response::json([
                'success' => true,
                'data' => $data
            ], $status);
        });
        Response::macro('failure', function (string $message, int $status = 400) {
            return Response::json([
                'success' => false,
                'message' => $message
            ], $status);
        });
    }
}
