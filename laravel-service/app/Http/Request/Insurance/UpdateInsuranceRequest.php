<?php

namespace App\Http\Request\Insurance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInsuranceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $insurance = $this->route('insurance');

        return [
            'insurance_name' => [
                'sometimes',
                'string',
                'max:255',
                'unique:insurances,insurance_name,' . ($insurance ? $insurance->id : '')
            ],
            'insurance_code' => [
                'sometimes',
                'string',
                'max:50',
                'unique:insurances,insurance_code,' . ($insurance ? $insurance->id : '')
            ],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
