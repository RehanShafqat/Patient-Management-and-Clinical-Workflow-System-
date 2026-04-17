<?php

namespace App\Services;

use App\Enums\Role;
use App\Enums\VisitStatus;
use App\Models\Visit;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class VisitService
{
    public function getAll(Request $request, $user): LengthAwarePaginator
    {
        $query = Visit::query()->with([
            'appointment:id,appointment_number',
            'case:id,case_number',
            'patient:id,first_name,last_name',
            'doctor:id,user_id',
            'doctor.user:id,first_name,last_name',
            'diagnoses:id,diagnoses_name',
        ]);

        if ($user->role->value === Role::DOCTOR->value) {
            $query->where('doctor_id', $user->doctorProfile?->id);
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('visit_number', 'LIKE', '%' . $search . '%')
                    ->orWhereHas('patient', function ($patientQuery) use ($search) {
                        $patientQuery->whereRaw(
                            "CONCAT(first_name, ' ', last_name) LIKE ?",
                            ['%' . $search . '%']
                        );
                    });
            });
        }

        if ($request->filled('visit_status')) {
            $query->where('visit_status', $request->input('visit_status'));
        }

        if ($request->filled('case_id')) {
            $query->where('case_id', $request->input('case_id'));
        }

        if ($request->filled('patient_id')) {
            $query->where('patient_id', $request->input('patient_id'));
        }

        if ($request->filled('doctor_id') && $user->role->value !== Role::DOCTOR->value) {
            $query->where('doctor_id', $request->input('doctor_id'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('visit_date', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('visit_date', '<=', $request->input('date_to'));
        }

        return $query
            ->orderBy('visit_date', 'desc')
            ->orderBy('visit_time', 'desc')
            ->paginate($request->get('per_page', 15));
    }

    public function getById(Visit $visit): Visit
    {
        return $visit->load([
            'appointment:id,appointment_number',
            'case:id,case_number',
            'patient:id,first_name,last_name',
            'doctor:id,user_id',
            'doctor.user:id,first_name,last_name',
            'diagnoses:id,diagnoses_name',
        ]);
    }

    public function update(Visit $visit, array $data): Visit
    {
        if (array_key_exists('visit_status', $data)) {
            if ($data['visit_status'] === VisitStatus::COMPLETED->value && !$visit->completed_at) {
                $data['completed_at'] = now();
            }

            if (in_array($data['visit_status'], [VisitStatus::DRAFT->value, VisitStatus::CANCELLED->value], true)) {
                $data['completed_at'] = null;
            }
        }

        $visit->update($data);

        return $this->getById($visit);
    }

    public function delete(Visit $visit): void
    {
        $visit->delete();
    }
}
