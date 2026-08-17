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
    Schema::table('users', function (Blueprint $table) {
        $table->boolean('water_reminder')->default(true);
        $table->boolean('meal_reminder')->default(true);
        $table->boolean('exercise_reminder')->default(true);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn([
            'water_reminder',
            'meal_reminder',
            'exercise_reminder',
        ]);
    });
}
};
