<?php
// 2026_04_03_000014_create_visits_table.php

use App\Enums\VisitStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
      public function up(): void
      {
            Schema::create('visits', function (Blueprint $table) {
                  $table->id();
                  $table->string('visit_number')->unique();

                  $table->foreignId('appointment_id')->unique()
                        ->constrained('appointments')
                        ->onDelete('restrict');

                  $table->foreignId('case_id')
                        ->constrained('patient_cases')
                        ->onDelete('restrict');

                  $table->foreignId('patient_id')
                        ->constrained('patients')
                        ->onDelete('restrict');

                  $table->foreignId('doctor_id')
                        ->constrained('doctor_profiles')
                        ->onDelete('restrict');

                  $table->date('visit_date');
                  $table->time('visit_time')->nullable();

                  $table->integer('visit_duration_minutes')->nullable();
                  $table->foreignId('diagnoses_id')->nullable()
                        ->constrained('diagnoses')
                        ->onDelete('restrict');

                  // nullable: treatment is filled in later by the doctor via Visit CRUD
                  $table->text('treatment')->nullable();
                  $table->text('treatment_plan')->nullable();

                  $table->text('prescription')->nullable();
                  $table->json('prescription_documents')->nullable();

                  $table->text('notes')->nullable();
                  $table->json('vital_signs')->nullable();

                  $table->text('symptoms')->nullable();
                  $table->boolean('follow_up_required')->default(false);

                  $table->date('follow_up_date')->nullable();
                  $table->boolean('referral_made')->default(false);

                  $table->string('referral_to')->nullable();
                  $table->enum('visit_status', array_column(VisitStatus::cases(), 'value'))
                        ->default(VisitStatus::DRAFT->value);

                  $table->datetime('completed_at')->nullable();
                  $table->timestamps();

                  $table->softDeletes();
            });
      }

      public function down(): void
      {
            Schema::dropIfExists('visits');
      }
};
