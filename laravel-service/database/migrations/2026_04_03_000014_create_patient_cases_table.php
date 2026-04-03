<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cases', function (Blueprint $table) {
            $table->id();

            $table->string('case_number')->unique();

            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('practice_location_id')->constrained()->cascadeOnDelete();

            $table->enum('category', [
                'General Medicine',
                'Surgery',
                'Pediatrics',
                'Cardiology',
                'Orthopedics',
                'Neurology',
                'Dermatology',
                'Gynecology',
                'Ophthalmology',
                'ENT',
                'Dental',
                'Psychiatry',
                'Physical Therapy',
                'Emergency',
                'Other'
            ]);

            $table->text('purpose_of_visit');

            $table->enum('case_type', [
                'Initial Consultation',
                'Follow-up',
                'Emergency',
                'Chronic Care',
                'Preventive Care',
                'Pre-surgical',
                'Post-surgical'
            ]);

            $table->enum('priority', [
                'Low',
                'Normal',
                'High',
                'Urgent'
            ])->default('Normal');

            $table->enum('case_status', [
                'Active',
                'On Hold',
                'Closed',
                'Transferred',
                'Cancelled'
            ])->default('Active');

            $table->date('date_of_accident')->nullable();

            $table->foreignId('insurance_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('firm_id')->nullable()->constrained()->nullOnDelete();

            $table->string('referred_by')->nullable();
            $table->string('referred_doctor_name')->nullable();

            $table->date('opening_date');
            $table->date('closing_date')->nullable();

            $table->text('clinical_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};