<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table): void {
            $table->timestamp('reminder_queued_at')->nullable()->after('updated_at');
            $table->timestamp('reminder_sent_at')->nullable()->after('reminder_queued_at');

            $table->index(['date', 'start_time', 'user_id'], 'events_date_start_user_idx');
            $table->index(['reminder_queued_at', 'reminder_sent_at'], 'events_reminder_state_idx');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table): void {
            $table->dropIndex('events_date_start_user_idx');
            $table->dropIndex('events_reminder_state_idx');
            $table->dropColumn(['reminder_queued_at', 'reminder_sent_at']);
        });
    }
};
