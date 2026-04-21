<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $today = now()->toDateString();
        $currentTime = now()->format('H:i:s');

        $totalEvents = $user->events()->count();
        $todayEventsCount = $user->events()->whereDate('date', $today)->count();
        $upcomingTodayCount = $user->events()
            ->whereDate('date', $today)
            ->whereTime('start_time', '>=', $currentTime)
            ->count();

        $sentNotificationsCount = $user->notifications()->where('status', 'sent')->count();
        $notificationsByChannel = $user->notifications()
            ->selectRaw('channel, COUNT(*) as total')
            ->groupBy('channel')
            ->pluck('total', 'channel');

        $conflictAlertsCount = $this->countConflicts($user->events()
            ->whereDate('date', '>=', $today)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get(['date', 'start_time', 'end_time'])
        );

        $timeline = $user->events()
            ->whereDate('date', $today)
            ->orderBy('start_time')
            ->limit(6)
            ->get([
                'id',
                'title',
                'description',
                'category',
                'priority',
                'date',
                'start_time',
                'end_time',
                'is_recurring',
                'recurrence_type',
                'reminder_time',
                'reminder_queued_at',
                'reminder_sent_at',
            ])
            ->map(function ($event): array {
                return [
                    'id'               => $event->id,
                    'title'            => $event->title,
                    'description'      => $event->description,
                    'category'         => $event->category,
                    'priority'         => $event->priority,
                    'date'             => $event->date->toDateString(),
                    'startTime'        => $event->start_time->format('H:i'),
                    'endTime'          => $event->end_time->format('H:i'),
                    'isRecurring'      => $event->is_recurring,
                    'recurrenceType'   => $event->recurrence_type,
                    'time'             => $event->start_time->format('h:i A'),
                    'reminderTime'     => $event->reminder_time?->toDateTimeString(),
                    'reminderQueuedAt' => $event->reminder_queued_at?->toDateTimeString(),
                    'reminderSentAt'   => $event->reminder_sent_at?->toDateTimeString(),
                ];
            })
            ->values();

        $recentNotifications = $user->notifications()
            ->with('event:id,title')
            ->latest()
            ->limit(6)
            ->get(['id', 'event_id', 'status', 'channel', 'message', 'created_at'])
            ->map(function ($notification): array {
                return [
                    'id' => $notification->id,
                    'title' => $notification->event?->title ?? ucfirst(str_replace('_', ' ', $notification->channel)).' notification',
                    'detail' => $notification->message,
                    'status' => $notification->status,
                    'time' => $notification->created_at->diffForHumans(),
                ];
            })
            ->values();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalEvents' => $totalEvents,
                'todayEvents' => $todayEventsCount,
                'upcomingTodayEvents' => $upcomingTodayCount,
                'remindersSent' => $sentNotificationsCount,
                'conflictAlerts' => $conflictAlertsCount,
                'emailChannelPercent' => $this->channelPercent($notificationsByChannel, 'email'),
                'smsChannelPercent' => $this->channelPercent($notificationsByChannel, 'sms'),
            ],
            'timeline' => $timeline,
            'recentNotifications' => $recentNotifications,
        ]);
    }

    private function countConflicts(Collection $events): int
    {
        $conflicts = 0;

        $events->groupBy(fn ($event) => $event->date->toDateString())
            ->each(function (Collection $dayEvents) use (&$conflicts): void {
                $previousEnd = null;

                foreach ($dayEvents as $event) {
                    $start = $event->start_time->format('H:i:s');
                    $end = $event->end_time->format('H:i:s');

                    if ($previousEnd !== null && $start < $previousEnd) {
                        $conflicts++;
                    }

                    if ($previousEnd === null || $end > $previousEnd) {
                        $previousEnd = $end;
                    }
                }
            });

        return $conflicts;
    }

    private function channelPercent(Collection $channelTotals, string $channel): int
    {
        $total = (int) $channelTotals->sum();

        if ($total === 0) {
            return 0;
        }

        return (int) round(((int) ($channelTotals[$channel] ?? 0) / $total) * 100);
    }
}
