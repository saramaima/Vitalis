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
        Schema::create('foods', function (Blueprint $table) {
    $table->id();

    $table->string('name', 150);

    $table->string('serving_size', 50);

    $table->integer('calories');

    $table->decimal('protein', 6, 2);

    $table->decimal('carbs', 6, 2);

    $table->decimal('fat', 6, 2);

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
