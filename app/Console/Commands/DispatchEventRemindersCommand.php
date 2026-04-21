<?php

namespace App\Console\Commands;

use App\Services\EventReminderService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DispatchEventRemindersCommand extends Command
{
    protected $signature = 'events:send-reminders';

    protected $description = 'Check for due event reminders and dispatch notification jobs (runs every minute via scheduler).';

    public function handle(EventReminderService $eventReminderService): int
    {
        $this->info('[' . now()->toDateTimeString() . '] Checking for due reminders…');

        $count = $eventReminderService->dispatchDueReminders();

        if ($count > 0) {
            $this->info("✅ Dispatched {$count} reminder job(s).");
        } else {
            $this->line('   No reminders due at this time.');
        }

        return self::SUCCESS;
    }
}
