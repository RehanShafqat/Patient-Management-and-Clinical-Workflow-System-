<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    /**
     * Get real-time dashboard statistics.
     *
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = $this->dashboardService->getStats();
            
            return response()->success($stats, 'Dashboard statistics fetched successfully.');
        } catch (\Exception $e) {
            return response()->failure($e->getMessage(), 500);
        }
    }
}
