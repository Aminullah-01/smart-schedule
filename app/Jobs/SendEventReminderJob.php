<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendEventReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** Retry up to 3 times before marking as failed. */
    public int $tries = 3;

    /** Exponential back-off: wait 30s, 60s, then 120s between retries. */
    public int $backoff = 30;

    public function __construct(public User $user, public Event $event)
    {
    }

    public function handle(NotificationService $notificationService): void
    {
        // Re-fetch from DB to get the freshest state (model may have changed since dispatch).
        $event = Event::query()->whereKey($this->event->id)->first();
        $user  = User::query()->whereKey($this->user->id)->first();

        if ($event === null || $user === null) {
            Log::channel('reminders')->warning('Reminder job skipped — event or user no longer exists.', [
                'event_id' => $this->event->id,
                'user_id'  => $this->user->id,
            ]);

            return;
        }

        // Guard: if already sent (e.g. manual button was clicked), bail out.
        if ($event->reminder_sent_at !== null) {
            Log::channel('reminders')->info('Reminder job skipped — already sent (manual or duplicate).', [
                'event_id'        => $event->id,
                'reminder_sent_at' => $event->reminder_sent_at,
            ]);

            return;
        }

        // Dispatch SMS + Email + In-App + Browser via NotificationService.
        $notificationService->send($user, $event, ['in_app', 'email', 'sms', 'browser']);

        // Stamp the event as sent so the scheduler never re-processes it.
        $event->forceFill([
            'reminder_sent_at' => now(),
        ])->save();

        Log::channel('reminders')->info('Event reminder sent successfully.', [
            'event_id'    => $event->id,
            'event_title' => $event->title,
            'user_id'     => $user->id,
            'user_email'  => $user->email,
            'sent_at'     => now()->toDateTimeString(),
        ]);
    }

    public function failed(Throwable $exception): void
    {
        // Reset the queued lock so the scheduler can retry on the next cycle.
        Event::query()
            ->whereKey($this->event->id)
            ->whereNull('reminder_sent_at')
            ->update(['reminder_queued_at' => null]);

        Log::channel('reminders')->error('Event reminder job failed — lock released for retry.', [
            'event_id'  => $this->event->id,
            'user_id'   => $this->user->id,
            'error'     => $exception->getMessage(),
            'attempts'  => $this->attempts(),
        ]);
    }
}
