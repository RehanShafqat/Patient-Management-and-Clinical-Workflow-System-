<?php
// app/Services/AppointmentService.php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class AppointmentService
{
    // Build filtered + paginated list
    public function getAll(Request $request, $user): LengthAwarePaginator
    {
        $query = Appointment::query()
            ->with([
                'patient',
                'doctor.user',
                'specialty',
                'practiceLocation',
                'patientCase',
                'createdBy',
            ]);

        // Doctor sees only their own appointments
        if ($user->role === 'doctor') {
            $query->where('doctor_id', $user->doctorProfile?->id);
        }

        // Patient Name filter
        if ($request->filled('patient_name')) {
            $query->whereHas('patient', function ($q) use ($request) {
                $q->whereRaw(
                    "CONCAT(first_name, ' ', last_name) LIKE ?",
                    ['%' . $request->patient_name . '%']
                );
            });
        }

        // Doctor Name filter
        if ($request->filled('doctor_name')) {
            $query->whereHas('doctor.user', function ($q) use ($request) {
                $q->whereRaw(
                    "CONCAT(first_name, ' ', last_name) LIKE ?",
                    ['%' . $request->doctor_name . '%']
                );
            });
        }

        // Specialty filter
        if ($request->filled('specialty_id')) {
            $query->where('specialty_id', $request->specialty_id);
        }

        // Date range filters
        if ($request->filled('date_from')) {
            $query->whereDate('appointment_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('appointment_date', '<=', $request->date_to);
        }

        // Appointment Type filter
        if ($request->filled('appointment_type')) {
            $query->where('appointment_type', $request->appointment_type);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Practice Location filter
        if ($request->filled('practice_location_id')) {
            $query->where('practice_location_id', $request->practice_location_id);
        }

        // Created By (FDO) filter
        if ($request->filled('created_by')) {
            $query->where('created_by', $request->created_by);
        }

        return $query
            ->orderBy('appointment_date', 'asc')
            ->orderBy('appointment_time', 'asc')
            ->paginate($request->get('per_page', 15));
    }

    // Get single appointment 
    public function getById(Appointment $appointment): Appointment
    {
        return $appointment->load([
            'patient',
            'doctor.user',
            'specialty',
            'practiceLocation',
            'patientCase',
            'createdBy',
            'visit',
        ]);
    }

    // Create appointment 
    public function create(array $data, int $createdBy): Appointment
    {
        // Check doctor is not double-booked
        $this->checkDoctorConflict(
            $data['doctor_id'],
            $data['appointment_date'],
            $data['appointment_time']
        );

        $data['created_by'] = $createdBy;

        $appointment = Appointment::create($data);

        return $appointment->load([
            'patient',
            'doctor.user',
            'specialty',
            'practiceLocation',
            'patientCase',
            'createdBy',
        ]);
    }

    // Update appointment     
    public function update(Appointment $appointment, array $data, string $role): Appointment
    {
        // Cannot update cancelled appointment
        if ($appointment->status === AppointmentStatus::CANCELLED) {
            throw new \Exception('Cannot update a cancelled appointment.', 422);
        }

        // Non-admin cannot update a completed appointment
        if ($appointment->status === AppointmentStatus::COMPLETED && $role !== 'admin') {
            throw new \Exception('Cannot update a completed appointment.', 422);
        }

        // If date or time is changing — check for conflicts
        if (isset($data['appointment_date']) || isset($data['appointment_time'])) {
            $this->checkDoctorConflict(
                $data['doctor_id'] ?? $appointment->doctor_id,
                $data['appointment_date'] ?? $appointment->appointment_date,
                $data['appointment_time'] ?? $appointment->appointment_time,
                $appointment->id   // exclude current appointment from conflict check
            );

            // Auto-mark as rescheduled when date/time changes (FDO or Admin)
            if ($role !== 'doctor') {
                $data['status'] = AppointmentStatus::RESCHEDULED->value;
            }
        }

        $appointment->update($data);

        return $appointment->load([
            'patient',
            'doctor.user',
            'specialty',
            'practiceLocation',
            'patientCase',
            'createdBy',
        ]);
    }

    // Cancel appointment 
    public function cancel(Appointment $appointment): void
    {
        if ($appointment->status === AppointmentStatus::COMPLETED) {
            throw new \Exception('Cannot cancel a completed appointment.', 422);
        }

        if ($appointment->status === AppointmentStatus::CANCELLED) {
            throw new \Exception('Appointment is already cancelled.', 422);
        }

        $appointment->update(['status' => AppointmentStatus::CANCELLED->value]);
    }

    // Soft delete
    public function delete(Appointment $appointment): void
    {
        $appointment->delete();
    }

    // Private: doctor conflict check 
    private function checkDoctorConflict(
        int $doctorId,
        string $date,
        string $time,
        ?int $excludeId = null
    ): void {
        $query = Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->where('appointment_time', $time)
            ->whereNotIn('status', [
                AppointmentStatus::CANCELLED->value,
                AppointmentStatus::NO_SHOW->value,
            ]);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        if ($query->exists()) {
            throw new \Exception(
                'Doctor already has an appointment at this date and time.',
                422
            );
        }
    }
}