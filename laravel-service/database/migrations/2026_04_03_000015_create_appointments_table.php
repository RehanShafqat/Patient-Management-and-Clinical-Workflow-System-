<?php

use App\Enums\AppointmentStatus;
use App\Enums\AppointmentType;
use App\Enums\ReminderMethod;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();

            $table->string('appointment_number')->unique();

            $table->foreignId('case_id')->constrained('patient_cases')->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();

            $table->foreignId('doctor_id')
                ->constrained('doctor_profiles')
                ->cascadeOnDelete();

            $table->date('appointment_date');
            $table->time('appointment_time');
            // $table->time('end_time')->nullable(); // computed in app logic

            $table->enum('appointment_type', array_column(AppointmentType::cases(), 'value'))
                ->default(AppointmentType::NEW_PATIENT->value);

            $table->foreignId('specialty_id')->constrained()->cascadeOnDelete();
            $table->foreignId('practice_location_id')->constrained()->cascadeOnDelete();

            $table->integer('duration_minutes')->default(30);

            $table->enum('status', array_column(AppointmentStatus::cases(), 'value'))
                ->default(AppointmentStatus::SCHEDULED->value);

            $table->boolean('reminder_sent')->default(false);

            $table->enum('reminder_method', array_column(ReminderMethod::cases(), 'value'))->nullable();

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
