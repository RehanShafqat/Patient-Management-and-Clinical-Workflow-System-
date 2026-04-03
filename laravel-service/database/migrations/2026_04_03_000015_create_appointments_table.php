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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->string('appointment_number')->unique();

            $table->foreignId('case_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();

            $table->foreignId('doctor_id')
            ->constrained('doctor_profiles')
            ->cascadeOnDelete();

            $table->date('appointment_date');
            $table->time('appointment_time');
            $table->time('end_time')->nullable(); // computed in app logic

            $table->enum('appointment_type', [
                'New Patient',
                'Follow-up',
                'Consultation',
                'Procedure',
                'Telehealth',
                'Emergency',
                'Routine Checkup',
                'Post-op Follow-up',
            ])->default('New Patient');

            $table->foreignId('specialty_id')->constrained()->cascadeOnDelete();
            $table->foreignId('practice_location_id')->constrained()->cascadeOnDelete();

            $table->integer('duration_minutes')->default(30);

            $table->enum('status', [
                'Scheduled',
                'Confirmed',
                'Checked In',
                'In Progress',
                'Completed',
                'Cancelled',
                'No Show',
                'Rescheduled'
            ])->default('Scheduled');

            $table->boolean('reminder_sent')->default(false);

            $table->enum('reminder_method', [
                'SMS',
                'Email',
                'Phone',
                'None'
            ])->nullable();

            $table->text('notes')->nullable();
            $table->text('reason_for_visit');

            // created_by -> users (FDO)
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
