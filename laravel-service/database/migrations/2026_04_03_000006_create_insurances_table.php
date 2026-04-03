<?php

use App\Models\InsuranceAddress;
use App\Models\PatientCase;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insurance', function (Blueprint $table) {
            $table->id();
            $table->string('insurance_name');
            $table->string('insurance_code')->nullable();
            $table->boolean('is_active')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insurance');
    }

    public function insurance_address()
    {
        return $this->hasMany(InsuranceAddress::class);
    }

    public function patient_cases()
    {
        return $this->hasMany(PatientCase::class);
    }
};