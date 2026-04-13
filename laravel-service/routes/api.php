<?php
// routes/api.php

use App\Http\Controllers\AppointmentController;
use App\Enums\Role;
use Illuminate\Support\Facades\Route;

Route::middleware('jwt.auth')->group(function () {

    Route::prefix('appointments')->group(function () {

        // All roles can list and view
        Route::get('/', [AppointmentController::class, 'index'])->middleware('check.role:' . Role::ADMIN->value);
        Route::get('/{appointment}', [AppointmentController::class, 'show']);

        // FDO and Admin only — create
        Route::post('/', [AppointmentController::class, 'store']);

        // Role-restricted update (doctor = status only, FDO/Admin = full)
        Route::patch('/{appointment}', [AppointmentController::class, 'update']);

        // FDO and Admin only — cancel
        Route::patch('/{appointment}/cancel', [AppointmentController::class, 'cancel']);

        // Admin only — soft delete
        Route::delete('/{appointment}', [AppointmentController::class, 'destroy'])->middleware('check.role');
    });
});
