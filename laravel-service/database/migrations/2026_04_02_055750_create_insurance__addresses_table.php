<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('insurance_addresses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('insurance_id')->constrained()->cascadeOnDelete();

            $table->text('address');
            $table->string('phone')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('insurance_addresses');
    }
};