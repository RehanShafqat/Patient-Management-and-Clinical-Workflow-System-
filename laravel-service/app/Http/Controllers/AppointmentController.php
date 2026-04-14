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
use App\Enums\FdoPermission;
use App\Enums\HttpStatus;
class AppointmentController extends Controller
{
    public function __construct(
        private AppointmentService $appointmentService
    ) {}

    // LIST
    public function index(Request $request)
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
                return response()->failure('Unauthorized.', 403);
            }
        }

        $appointment = $this->appointmentService->getById($appointment);

        return response()->success(new AppointmentResource($appointment));
    }

    // STORE
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $user = auth()->user();
        if (user->role->value === Role::FDO) {
            if (!user->hasPermission(FdoPermission::CREATE_APPOINTMENT->value)) {
                return response()->failure('You dont have permission to create appointment.', HttpStatus::FORBIDDEN->value);
            }
        }

        try {
            $validated = $request->validated();

            $appointment = $this->appointmentService->create(
                $validated,
                auth()->id()
            );


            return response()->success(
                ['appointment' => new AppointmentResource($appointment)],
                'Appointment scheduled successfully.',
                201
            );
        } catch (\Exception $e) {
            return response()->failure($e->getMessage(), $e->getCode() ?: 500);
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

            return response()->success(
                ['appointment' => new AppointmentResource($appointment)],
                'Appointment updated successfully.'
            );
        } catch (\Exception $e) {
            return response()->failure($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    // CANCEL
    public function cancel(Appointment $appointment): JsonResponse
    {
        if (auth()->user()->role->value === 'doctor') {
            return response()->failure('Doctors cannot cancel appointments.', 403);
        }

        try {
            $this->appointmentService->cancel($appointment);

            return response()->success([], 'Appointment cancelled successfully.');
        } catch (\Exception $e) {
            return response()->failure($e->getMessage(), $e->getCode() ?: 500);
        }
    }

    // DELETE (soft)
    public function destroy(Appointment $appointment): JsonResponse
    {
        if (auth()->user()->role->value !== 'admin') {
            return response()->failure('Only admins can delete appointments.', 403);
        }

        $this->appointmentService->delete($appointment);

        return response()->success([], 'Appointment deleted successfully.');
    }
}
