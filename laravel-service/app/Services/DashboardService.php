<?php

namespace App\Services;

use App\Models\Patient;
use App\Models\PatientCase;
use App\Models\Appointment;
use App\Models\Visit;
use App\Models\DoctorProfile;
use App\Enums\AppointmentStatus;
use App\Enums\CaseStatus;
use App\Enums\VisitStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getStats(): array
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth();
        $startOfLastMonth = $lastMonth->copy()->startOfMonth();
        $endOfLastMonth = $lastMonth->copy()->endOfMonth();

        // Total Patients & Monthly Change
        $totalPatients = Patient::count();
        $patientsThisMonth = Patient::where('created_at', '>=', $startOfMonth)->count();
        $patientsLastMonth = Patient::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $patientChangePercent = 0;
        if ($patientsLastMonth > 0) {
            $patientChangePercent = round((($patientsThisMonth - $patientsLastMonth) / $patientsLastMonth) * 100, 1);
        }

        // Active Cases & Today's New Cases
        $activeCases = PatientCase::where('case_status', CaseStatus::ACTIVE)->count();
        $newCasesToday = PatientCase::whereDate('created_at', $today)->count();

        // Today's Appointments
        $todayAppointments = Appointment::whereDate('appointment_date', $today)->count();

        // Completed Visits & Completion Rate
        $completedVisits = Visit::where('visit_status', VisitStatus::COMPLETED)->count();
        $totalVisits = Visit::count();
        $completionRate = $totalVisits > 0 ? round(($completedVisits / $totalVisits) * 100) : 0;

        // Appointments Trend (Last 30 Days)
        $appointmentsTrend = Appointment::select(DB::raw('DATE(appointment_date) as date'), DB::raw('count(*) as count'))
            ->where('appointment_date', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Case Categories
        $caseCategories = PatientCase::select('category', DB::raw('count(*) as count'))
            ->where('case_status', CaseStatus::ACTIVE)
            ->groupBy('category')
            ->get();

        // Recent Patients
        $recentPatients = Patient::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($patient) {
                $firstName = $patient->first_name ?? '';
                $lastName = $patient->last_name ?? '';
                $fullName = trim("{$firstName} {$lastName}");

                return [
                    'id' => $patient->id,
                    'full_name' => $fullName !== '' ? $fullName : 'Unknown Patient',
                    'registration_date' => $patient->created_at->format('M d, Y'),
                    'status' => $patient->patient_status,
                ];
            });

        // Staff Performance (Top Doctors by Completed Visits)
        $staffPerformance = DoctorProfile::with(['user', 'specialty'])
            ->withCount(['visits' => function ($query) {
                $query->where('visit_status', VisitStatus::COMPLETED);
            }])
            ->orderBy('visits_count', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($doctor) {
                $firstName = $doctor->user?->first_name ?? '';
                $lastName = $doctor->user?->last_name ?? '';
                $doctorName = trim("{$firstName} {$lastName}");

                return [
                    'name' => $doctorName !== '' ? "Dr. {$doctorName}" : 'Unassigned Doctor',
                    'department' => $doctor->specialty?->specialty_name ?? 'General',
                    'patients_handled' => $doctor->visits_count,
                ];
            });

        return [
            'totalPatients' => $totalPatients,
            'patientChangePercent' => $patientChangePercent,
            'activeCasesCount' => $activeCases,
            'newCasesToday' => $newCasesToday,
            'todayAppointmentsCount' => $todayAppointments,
            'completedVisitsCount' => $completedVisits,
            'completionRate' => $completionRate,
            'appointmentsTrend' => $appointmentsTrend,
            'caseCategories' => $caseCategories,
            'recentPatients' => $recentPatients,
            'staffPerformance' => $staffPerformance,
        ];
    }
}
