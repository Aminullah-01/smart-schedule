<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Scheduler is ready for future recurring jobs.
Schedule::command('inspire')->hourly();
Schedule::command('events:send-reminders')->everyMinute()->withoutOverlapping();
