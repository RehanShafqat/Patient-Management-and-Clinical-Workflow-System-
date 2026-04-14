<?php

namespace App\Services;

use App\Models\Insurance;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class InsuranceService
{
    public function getAll(Request $request): LengthAwarePaginator
    {
        $query = Insurance::query();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('insurance_name', 'LIKE', '%' . $search . '%')
                  ->orWhere('insurance_code', 'LIKE', '%' . $search . '%');
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return $query->orderBy('insurance_name', 'asc')
            ->paginate($request->get('per_page', 15));
    }

    public function getById(Insurance $insurance): Insurance
    {
        return $insurance;
    }

    public function create(array $data): Insurance
    {
        if (!array_key_exists('is_active', $data)) {
            $data['is_active'] = true;
        }

        return Insurance::create($data);
    }

    public function update(Insurance $insurance, array $data): Insurance
    {
        $insurance->update($data);
        return $insurance;
    }

    public function delete(Insurance $insurance): void
    {
        $insurance->delete();
    }
}
