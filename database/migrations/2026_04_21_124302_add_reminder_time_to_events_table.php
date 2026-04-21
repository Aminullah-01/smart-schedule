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
        Schema::table('events', function (Blueprint $table) {
            $table->timestamp('reminder_time')->nullable()->after('end_time');
            $table->index('reminder_time', 'events_reminder_time_idx');
        });

        // Backfill existing records
        \Illuminate\Support\Facades\DB::statement('UPDATE events SET reminder_time = TIMESTAMP(date, start_time)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropIndex('events_reminder_time_idx');
            $table->dropColumn('reminder_time');
        });
    }
};
