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

        $table->integer('age')->nullable();

        $table->string('gender', 20)->nullable();

        $table->decimal('height', 5, 2)->nullable();

        $table->decimal('current_weight', 5, 2)->nullable();

        $table->decimal('target_weight', 5, 2)->nullable();

        $table->string('activity_level', 20)->nullable();

        $table->string('fitness_goal', 20)->nullable();

        $table->integer('daily_calorie_target')->nullable();

        $table->integer('water_target')->default(8);

    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('users', function (Blueprint $table) {

        $table->dropColumn([
            'age',
            'gender',
            'height',
            'current_weight',
            'target_weight',
            'activity_level',
            'fitness_goal',
            'daily_calorie_target',
            'water_target',
        ]);

    });
}
};
