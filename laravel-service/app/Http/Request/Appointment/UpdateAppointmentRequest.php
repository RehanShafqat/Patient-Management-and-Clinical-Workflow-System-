<?php

namespace App\Http\Request\Appointment;

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Enums\ReminderMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        if (auth()->user()->role->value === 'doctor') {
            return [
                'status' => [
                    'required',
                    new Enum(AppointmentStatus::class),
                    'in:Checked In,In Progress,Completed',
                ],
            ];
        }

        return [
            'doctor_id' => ['sometimes', 'integer', 'exists:doctor_profiles,id'],
            'appointment_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'appointment_time' => ['sometimes', 'date_format:H:i'],
            'appointment_type' => ['sometimes', new Enum(AppointmentType::class)],
            'specialty_id' => ['sometimes', 'integer', 'exists:specialties,id'],
            'practice_location_id' => ['sometimes', 'integer', 'exists:practice_locations,id'],
            'duration_minutes' => ['sometimes', 'integer', 'min:5', 'max:480'],
            'status' => ['sometimes', new Enum(AppointmentStatus::class)],
            'reminder_method' => ['nullable', new Enum(ReminderMethod::class)],
            'notes' => ['nullable', 'string'],
            'reason_for_visit' => ['sometimes', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'appointment_date.after_or_equal' => 'Appointment date cannot be in the past.',
            'case_id.exists' => 'The selected case does not exist.',
            'doctor_id.exists' => 'The selected doctor does not exist.',
            'status.in' => 'Doctors can only set status to Checked In, In Progress, or Completed.',
        ];
    }
}