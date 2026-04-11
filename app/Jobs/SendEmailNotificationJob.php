<?php

namespace App\Jobs;

use App\Mail\EventReminderMail;
use App\Models\Notification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class SendEmailNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $notificationId)
    {
    }

    public function handle(): void
    {
        $notification = Notification::query()->with(['user', 'event'])->find($this->notificationId);

        if ($notification === null || $notification->user === null) {
            return;
        }

        if (empty($notification->user->email)) {
            throw new \RuntimeException('User email is missing for email notification.');
        }

        Mail::to($notification->user->email)
            ->send(new EventReminderMail($notification->event, $notification->message));

        $notification->forceFill([
            'status' => 'sent',
            'sent_at' => now(),
        ])->save();
    }

    public function failed(Throwable $exception): void
    {
        Notification::query()
            ->whereKey($this->notificationId)
            ->update([
                'status' => 'failed',
                'sent_at' => null,
            ]);

        Log::error('Email notification job failed.', [
            'notification_id' => $this->notificationId,
            'error' => $exception->getMessage(),
        ]);
    }
}
