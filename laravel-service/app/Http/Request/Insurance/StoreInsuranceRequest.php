<?php

namespace App\Http\Request\Insurance;

use Illuminate\Foundation\Http\FormRequest;

class StoreInsuranceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'insurance_name' => ['required', 'string', 'max:255', 'unique:insurances,insurance_name'],
            'insurance_code' => ['required', 'string', 'max:50', 'unique:insurances,insurance_code'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
