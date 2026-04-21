<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Automated Reminder Scheduler
|--------------------------------------------------------------------------
|
| This runs every minute. The command checks the 'events' table for any
| rows where reminder_time <= now() AND reminder_sent_at IS NULL AND
| reminder_queued_at IS NULL, then dispatches SendEventReminderJob for
| each. withoutOverlapping() prevents a second instance from running if
| the previous tick is still processing a large batch.
|
| To activate this scheduler on your server, add this single cron entry:
|   * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
|
*/
Schedule::command('events:send-reminders')
    ->everyMinute()
    ->withoutOverlapping(5)
    ->runInBackground()
    ->appendOutputTo(storage_path('logs/scheduler.log'));
