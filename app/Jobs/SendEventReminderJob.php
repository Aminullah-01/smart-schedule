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

    public int $tries = 3;

    public function __construct(public User $user, public Event $event)
    {
    }

    public function handle(NotificationService $notificationService): void
    {
        $event = Event::query()->whereKey($this->event->id)->first();
        $user = User::query()->whereKey($this->user->id)->first();

        if ($event === null || $user === null) {
            Log::warning('Reminder job skipped because event or user was not found.', [
                'event_id' => $this->event->id,
                'user_id' => $this->user->id,
            ]);

            return;
        }

        if ($event->reminder_sent_at !== null) {
            return;
        }

        $notificationService->send($user, $event, ['in_app', 'email', 'sms', 'browser']);

        $event->forceFill([
            'reminder_sent_at' => now(),
        ])->save();

        Log::info('Event reminder sent.', [
            'event_id' => $event->id,
            'user_id' => $user->id,
        ]);
    }

    public function failed(Throwable $exception): void
    {
        Event::query()
            ->whereKey($this->event->id)
            ->whereNull('reminder_sent_at')
            ->update(['reminder_queued_at' => null]);

        Log::error('Event reminder job failed.', [
            'event_id' => $this->event->id,
            'user_id' => $this->user->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
