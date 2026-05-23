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
        Schema::table('services', function (Blueprint $table) {
            $table->string('name_mk')->nullable()->after('name');
            $table->string('short_description_mk')->nullable()->after('short_description');
            $table->text('description_mk')->nullable()->after('description');
        });

        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->string('title_mk')->nullable()->after('title');
            $table->text('description_mk')->nullable()->after('description');
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->text('content_mk')->nullable()->after('content');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn(['name_mk', 'short_description_mk', 'description_mk']);
        });

        Schema::table('portfolio_items', function (Blueprint $table) {
            $table->dropColumn(['title_mk', 'description_mk']);
        });

        Schema::table('testimonials', function (Blueprint $table) {
            $table->dropColumn(['content_mk']);
        });
    }
};
