<?php

namespace App\Http\Controllers;

use App\Http\Request\Appointment\StoreAppointmentRequest;
use App\Http\Request\Appointment\UpdateAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Routing\Controller;
use App\Enums\Role;

class AppointmentController extends Controller
{
    public function __construct(
        private AppointmentService $appointmentService
    ) {
    }

    // LIST
    public function index(Request $request): AnonymousResourceCollection
    {
        $appointments = $this->appointmentService->getAll($request, auth()->user());

        return AppointmentResource::collection($appointments);
    }

    // SHOW
    public function show(Appointment $appointment): JsonResponse
    {
        // Doctor can only view their own appointments
        if (auth()->user()->role->value === 'doctor') {
            $doctorId = auth()->user()->doctorProfile?->id;
            if ($appointment->doctor_id !== $doctorId) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }
        }

        $appointment = $this->appointmentService->getById($appointment);

        return response()->json(new AppointmentResource($appointment));
    }

    // STORE 
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        // Role check — only FDO and Admin
        if (!in_array(auth()->user()->role->value, ['admin', 'fdo'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        try {
            $validated = $request->validated();

            $appointment = $this->appointmentService->create(
                $validated,
                auth()->id()
            );

            return response()->json([
                'message' => 'Appointment scheduled successfully.',
                'appointment' => new AppointmentResource($appointment),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    // UPDATE
    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        try {
            $validated = $request->validated();
            $role = auth()->user()->role->value;

            $appointment = $this->appointmentService->update(
                $appointment,
                $validated,
                $role
            );

            return response()->json([
                'message' => 'Appointment updated successfully.',
                'appointment' => new AppointmentResource($appointment),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], $e->getCode() ?: 500);
        }
    }

    // CANCEL
    public function cancel(Appointment $appointment): JsonResponse
    {
        if (auth()->user()->role->value === 'doctor') {
            return response()->json(['message' => 'Doctors cannot cancel appointments.'], 403);
        }

        try {
            $this->appointmentService->cancel($appointment);

            return response()->json(['message' => 'Appointment cancelled successfully.']);

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode() ?: 500);
        }
    }

    // DELETE (soft) 
    public function destroy(Appointment $appointment): JsonResponse
    {
        if (auth()->user()->role->value !== 'admin') {
            return response()->json(['message' => 'Only admins can delete appointments.'], 403);
        }

        $this->appointmentService->delete($appointment);

        return response()->json(['message' => 'Appointment deleted successfully.']);
    }
}