<?php

namespace App\Services;

use App\Jobs\SendEventReminderJob;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class EventReminderService
{
    /**
     * Dispatch reminder jobs for all events whose reminder_time is due and have
     * not yet been queued or sent. Uses an optimistic-lock pattern to prevent
     * duplicate dispatches when multiple scheduler processes run concurrently.
     *
     * @return int Number of jobs dispatched.
     */
    public function dispatchDueReminders(): int
    {
        // Always work in UTC. The APP_TIMEZONE env keeps Carbon::now() UTC unless
        // changed; reminder_time values are stored as UTC timestamps in MySQL.
        $now = Carbon::now('UTC');
        $dispatched = 0;
        $skipped = 0;

        // Rescue any jobs that were queued but the worker died before processing
        // them (i.e. queued > 10 minutes ago but still not sent). Reset so they
        // can be re-queued on the next scheduler tick.
        $this->resetStaleLocks($now);

        Event::query()
            ->with('user')
            ->whereNull('reminder_sent_at')
            ->whereNull('reminder_queued_at')
            ->whereNotNull('reminder_time')
            ->where('reminder_time', '<=', $now->toDateTimeString())
            ->orderBy('id')
            ->chunkById(200, function ($events) use (&$dispatched, &$skipped, $now): void {
                foreach ($events as $event) {
                    // Atomic lock: only update if nobody else locked it first.
                    $locked = Event::query()
                        ->whereKey($event->id)
                        ->whereNull('reminder_queued_at')
                        ->whereNull('reminder_sent_at')
                        ->update(['reminder_queued_at' => $now]);

                    if ($locked !== 1) {
                        // Another scheduler process grabbed it first.
                        $skipped++;
                        continue;
                    }

                    if ($event->user === null) {
                        Log::channel('reminders')->warning('Skipping reminder — event has no associated user.', [
                            'event_id' => $event->id,
                        ]);
                        $skipped++;
                        continue;
                    }

                    SendEventReminderJob::dispatch($event->user, $event);
                    $dispatched++;

                    Log::channel('reminders')->info('Reminder job queued.', [
                        'event_id'      => $event->id,
                        'event_title'   => $event->title,
                        'user_id'       => $event->user_id,
                        'reminder_time' => $event->reminder_time?->toDateTimeString(),
                        'queued_at'     => $now->toDateTimeString(),
                    ]);
                }
            });

        Log::channel('reminders')->info('Reminder scheduler tick complete.', [
            'checked_at'      => $now->toDateTimeString(),
            'jobs_dispatched' => $dispatched,
            'skipped'         => $skipped,
        ]);

        return $dispatched;
    }

    /**
     * Reset the reminder_queued_at lock for jobs that were queued more than
     * 10 minutes ago but have not yet been sent (worker failure recovery).
     */
    private function resetStaleLocks(Carbon $now): void
    {
        $staleThreshold = $now->copy()->subMinutes(10);

        $reset = Event::query()
            ->whereNull('reminder_sent_at')
            ->whereNotNull('reminder_queued_at')
            ->where('reminder_queued_at', '<=', $staleThreshold->toDateTimeString())
            ->update(['reminder_queued_at' => null]);

        if ($reset > 0) {
            Log::channel('reminders')->warning('Reset stale reminder locks — will retry these events.', [
                'count'     => $reset,
                'threshold' => $staleThreshold->toDateTimeString(),
            ]);
        }
    }
}
