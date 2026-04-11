<?php

namespace App\Services;

use App\Jobs\SendEmailNotificationJob;
use App\Jobs\SendSMSNotificationJob;
use App\Models\Event;
use App\Models\Notification;
use App\Models\NotificationPreference;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class NotificationService
{
    /**
     * @param list<string> $channels
     * @return Collection<int, Notification>
     */
    public function send(User $user, ?Event $event, array $channels = []): Collection
    {
        $resolvedChannels = $channels === []
            ? ['in_app', 'email', 'sms', 'browser']
            : $channels;

        $preferences = $this->getOrCreatePreferences($user);
        $message = $this->buildMessage($event);
        $savedNotifications = collect();

        foreach ($resolvedChannels as $channel) {
            if (! in_array($channel, ['in_app', 'email', 'sms', 'browser'], true)) {
                continue;
            }

            if (! $this->isChannelEnabled($preferences, $channel)) {
                continue;
            }

            if ($channel === 'in_app') {
                $savedNotifications->push($this->saveInAppNotification($user, $event, $message));
                continue;
            }

            $savedNotifications->push($this->savePendingNotification($user, $event, $channel, $message));

            match ($channel) {
                'email' => $this->sendEmail($savedNotifications->last()),
                'sms' => $this->sendSMS($savedNotifications->last()),
                'browser' => $this->sendBrowserPush($user, $event, $message),
                default => null,
            };
        }

        return $savedNotifications;
    }

    private function getOrCreatePreferences(User $user): NotificationPreference
    {
        return NotificationPreference::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'email_enabled' => true,
                'sms_enabled' => false,
                'browser_enabled' => true,
                'in_app_enabled' => true,
            ]
        );
    }

    private function isChannelEnabled(NotificationPreference $preferences, string $channel): bool
    {
        return match ($channel) {
            'in_app' => $preferences->in_app_enabled,
            'email' => $preferences->email_enabled,
            'sms' => $preferences->sms_enabled,
            'browser' => $preferences->browser_enabled,
            default => false,
        };
    }

    private function buildMessage(?Event $event): string
    {
        if ($event === null) {
            return 'You have a new notification.';
        }

        $eventDate = Carbon::parse($event->date)->toDateString();

        return sprintf(
            'Event "%s" is scheduled on %s from %s to %s.',
            $event->title,
            $eventDate,
            $event->start_time,
            $event->end_time
        );
    }

    private function savePendingNotification(User $user, ?Event $event, string $channel, string $message): Notification
    {
        return Notification::query()->create([
            'user_id' => $user->id,
            'event_id' => $event?->id,
            'channel' => $channel,
            'message' => $message,
            'status' => 'pending',
            'sent_at' => null,
        ]);
    }

    public function saveInAppNotification(User $user, ?Event $event, string $message): Notification
    {
        return Notification::query()->create([
            'user_id' => $user->id,
            'event_id' => $event?->id,
            'channel' => 'in_app',
            'message' => $message,
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    public function sendEmail(Notification $notification): void
    {
        SendEmailNotificationJob::dispatchSync($notification->id);
    }

    public function sendSMS(Notification $notification): void
    {
        SendSMSNotificationJob::dispatchSync($notification->id);
    }

    public function sendBrowserPush(User $user, ?Event $event, string $message): void
    {
        // Placeholder for integration with a browser push provider.
    }
}
