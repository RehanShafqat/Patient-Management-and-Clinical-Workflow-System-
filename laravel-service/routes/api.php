<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->success([
        'status' => 'OK',
        'timestamp' => now()->toDateTimeString()
    ], "Health check successful");
});
