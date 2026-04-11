<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Services\Sms\SmsService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class SendSMSNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public int $notificationId)
    {
    }

    public function handle(SmsService $smsService): void
    {
        $notification = Notification::query()->with('user')->find($this->notificationId);

        if ($notification === null || $notification->user === null) {
            return;
        }

        $phone = $notification->user->phone;

        if (empty($phone)) {
            throw new \RuntimeException('User phone is missing for SMS notification.');
        }

        $smsService->sendSMS($phone, $notification->message);

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

        Log::error('SMS notification job failed.', [
            'notification_id' => $this->notificationId,
            'error' => $exception->getMessage(),
        ]);
    }
}
