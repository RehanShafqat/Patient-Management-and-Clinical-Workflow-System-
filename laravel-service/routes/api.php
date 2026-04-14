<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PracticeLocationController;
use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\FirmController;
use App\Enums\Role;
use Illuminate\Support\Facades\Route;

Route::middleware('jwt.auth')->group(function () {   

    Route::prefix('appointments')->group(function () {

        // All roles can list and view
        Route::get('/', [AppointmentController::class, 'index'])->middleware('check.role:' . Role::FDO->value . ',' . Role::DOCTOR->value);
        Route::get('/{appointment}', [AppointmentController::class, 'show'])->middleware('check.role:' . Role::FDO->value . ',' . Role::DOCTOR->value);

        // FDO and Admin only — create
        Route::post('/', [AppointmentController::class, 'store'])->middleware('check.role:' . Role::FDO->value);

        // Role-restricted update (doctor = status only, FDO/Admin = full)
        Route::patch('/{appointment}', [AppointmentController::class, 'update'])->middleware('check.role:' . Role::FDO->value . ',' . Role::DOCTOR->value);

        // FDO and Admin only — cancel
        Route::patch('/{appointment}/cancel', [AppointmentController::class, 'cancel'])->middleware('check.role:' . Role::FDO->value);

        // Admin only — soft delete
        Route::delete('/{appointment}', [AppointmentController::class, 'destroy'])->middleware('check.role');
    });

    Route::prefix('practice-locations')->group(function () {
        Route::get('/', [PracticeLocationController::class, 'index'])->middleware('check.role:' . Role::FDO->value);
        Route::get('/{practiceLocation}', [PracticeLocationController::class, 'show'])->middleware('check.role:' . Role::FDO->value);
        Route::post('/', [PracticeLocationController::class, 'store'])->middleware('check.role');
        Route::patch('/{practiceLocation}', [PracticeLocationController::class, 'update'])->middleware('check.role');
        Route::delete('/{practiceLocation}', [PracticeLocationController::class, 'destroy'])->middleware('check.role');
    });

    Route::prefix('insurances')->group(function () {
        Route::get('/', [InsuranceController::class, 'index'])->middleware('check.role:' . Role::FDO->value);
        Route::get('/{insurance}', [InsuranceController::class, 'show'])->middleware('check.role:' . Role::FDO->value);
        Route::post('/', [InsuranceController::class, 'store'])->middleware('check.role');
        Route::patch('/{insurance}', [InsuranceController::class, 'update'])->middleware('check.role');
        Route::delete('/{insurance}', [InsuranceController::class, 'destroy'])->middleware('check.role');
    });

    Route::prefix('firms')->group(function () {
        Route::get('/', [FirmController::class, 'index'])->middleware('check.role:' . Role::FDO->value);
        Route::get('/{firm}', [FirmController::class, 'show'])->middleware('check.role:' . Role::FDO->value);
        Route::post('/', [FirmController::class, 'store'])->middleware('check.role');
        Route::patch('/{firm}', [FirmController::class, 'update'])->middleware('check.role');
        Route::delete('/{firm}', [FirmController::class, 'destroy'])->middleware('check.role');
    });
});
