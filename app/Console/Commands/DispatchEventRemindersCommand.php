<?php

namespace App\Console\Commands;

use App\Services\EventReminderService;
use Illuminate\Console\Command;

class DispatchEventRemindersCommand extends Command
{
    protected $signature = 'events:send-reminders';

    protected $description = 'Dispatch reminder jobs for events starting in one hour';

    public function handle(EventReminderService $eventReminderService): int
    {
        $count = $eventReminderService->dispatchDueReminders();

        $this->info("Dispatched {$count} event reminder job(s).");

        return self::SUCCESS;
    }
}
