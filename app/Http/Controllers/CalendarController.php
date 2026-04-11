<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $monthInput = (string) $request->query('month', now()->format('Y-m'));

        if (! preg_match('/^\d{4}-\d{2}$/', $monthInput)) {
            $monthInput = now()->format('Y-m');
        }

        $monthDate = Carbon::createFromFormat('Y-m', $monthInput)->startOfMonth();
        $monthStart = $monthDate->copy()->startOfMonth();
        $monthEnd = $monthDate->copy()->endOfMonth();

        $eventsByDate = $request->user()
            ->events()
            ->whereBetween('date', [$monthStart->toDateString(), $monthEnd->toDateString()])
            ->orderBy('date')
            ->orderBy('start_time')
            ->get([
                'id',
                'title',
                'category',
                'priority',
                'date',
                'start_time',
                'end_time',
            ])
            ->map(function ($event): array {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'category' => $event->category,
                    'priority' => $event->priority,
                    'date' => $event->date->toDateString(),
                    'startTime' => $event->start_time->format('H:i'),
                    'endTime' => $event->end_time->format('H:i'),
                    'timeLabel' => $event->start_time->format('h:i A').' - '.$event->end_time->format('h:i A'),
                ];
            })
            ->groupBy(fn (array $event) => $event['date'])
            ->map(fn ($events) => collect($events)
                ->map(fn (array $event) => [
                    'id' => $event['id'],
                    'title' => $event['title'],
                    'category' => $event['category'],
                    'priority' => $event['priority'],
                    'startTime' => $event['startTime'],
                    'endTime' => $event['endTime'],
                    'timeLabel' => $event['timeLabel'],
                ])
                ->values()
            );

        return Inertia::render('Calendar', [
            'month' => $monthDate->format('Y-m'),
            'monthLabel' => $monthDate->format('F Y'),
            'previousMonth' => $monthDate->copy()->subMonth()->format('Y-m'),
            'nextMonth' => $monthDate->copy()->addMonth()->format('Y-m'),
            'eventsByDate' => $eventsByDate,
        ]);
    }
}
