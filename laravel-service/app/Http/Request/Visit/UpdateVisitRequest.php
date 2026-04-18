<?php

namespace App\Http\Request\Visit;

use App\Enums\Role;
use App\Enums\VisitStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class UpdateVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return in_array(Auth::user()->role->value, [Role::ADMIN->value, Role::DOCTOR->value], true);
    }

    public function rules(): array
    {
        $isDoctor = Auth::user()?->role?->value === Role::DOCTOR->value;

        if ($isDoctor) {
            return [
                'diagnoses_id' => ['nullable', 'uuid', 'exists:diagnoses,id'],
                'treatment' => ['nullable', 'string'],
                'prescription' => ['nullable', 'string'],
                'notes' => ['nullable', 'string'],
            ];
        }

        return [
            'visit_date' => ['sometimes', 'date'],
            'visit_time' => ['sometimes', 'date_format:H:i'],
            'visit_duration_minutes' => ['sometimes', 'integer', 'min:1', 'max:1440'],
            'diagnoses_id' => ['nullable', 'uuid', 'exists:diagnoses,id'],
            'treatment' => ['nullable', 'string'],
            'treatment_plan' => ['nullable', 'string'],
            'prescription' => ['nullable', 'string'],
            'prescription_documents' => ['nullable', 'array'],
            'prescription_documents.*' => ['string'],
            'notes' => ['nullable', 'string'],
            'vital_signs' => ['nullable', 'array'],
            'symptoms' => ['nullable', 'string'],
            'follow_up_required' => ['sometimes', 'boolean'],
            'follow_up_date' => ['nullable', 'date', 'required_if:follow_up_required,true'],
            'referral_made' => ['sometimes', 'boolean'],
            'referral_to' => ['nullable', 'string', 'required_if:referral_made,true'],
            'visit_status' => [
                'sometimes',
                new Enum(VisitStatus::class),
                Rule::in(array_map(fn($status) => $status->value, VisitStatus::cases())),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'follow_up_date.required_if' => 'Follow-up date is required when follow-up is marked as required.',
            'referral_to.required_if' => 'Referral target is required when referral is marked as made.',
            'visit_time.date_format' => 'Visit time must be in HH:MM format.',
            'visit_status.in' => 'Invalid visit status transition for your role.',
        ];
    }
}
