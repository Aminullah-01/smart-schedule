<?php

namespace App\Services;

use App\Jobs\SendEventReminderJob;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EventReminderService
{
    public function dispatchDueReminders(): int
    {
        $now = Carbon::now();
        // Match events that are about one hour away, with a one-minute tolerance for scheduler drift.
        $targetWindowStart = $now->copy()->addMinutes(59)->startOfMinute();
        $targetWindowEnd = $now->copy()->addHour()->endOfMinute();
        $dispatched = 0;

        Event::query()
            ->with('user')
            ->whereNull('reminder_sent_at')
            ->whereNull('reminder_queued_at')
            ->whereBetween(
                DB::raw('TIMESTAMP(`date`, `start_time`)'),
                [$targetWindowStart->toDateTimeString(), $targetWindowEnd->toDateTimeString()]
            )
            ->orderBy('id')
            ->chunkById(200, function ($events) use (&$dispatched, $now): void {
                foreach ($events as $event) {
                    $locked = Event::query()
                        ->whereKey($event->id)
                        ->whereNull('reminder_queued_at')
                        ->whereNull('reminder_sent_at')
                        ->update(['reminder_queued_at' => $now]);

                    if ($locked !== 1 || $event->user === null) {
                        continue;
                    }

                    SendEventReminderJob::dispatchSync($event->user, $event);
                    $dispatched++;

                    Log::info('Queued event reminder job.', [
                        'event_id' => $event->id,
                        'user_id' => $event->user_id,
                    ]);
                }
            });

        Log::info('Event reminder scheduler executed.', [
            'target_window_start' => $targetWindowStart->toDateTimeString(),
            'target_window_end' => $targetWindowEnd->toDateTimeString(),
            'jobs_dispatched' => $dispatched,
        ]);

        return $dispatched;
    }
}
