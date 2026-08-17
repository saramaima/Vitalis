<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meal_foods', function (Blueprint $table) {
            $table->unique(
                ['meal_id', 'food_id'],
                'meal_food_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::table('meal_foods', function (Blueprint $table) {
            $table->dropUnique('meal_food_unique');
        });
    }
};