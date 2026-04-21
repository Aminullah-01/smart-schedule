<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Arr;

class EventService
{
    public function __construct(private readonly EventRecurrenceService $eventRecurrenceService)
    {
    }

    public function forUser(User $user): Builder
    {
        return Event::query()
            ->where('user_id', $user->id)
            ->orderBy('date')
            ->orderBy('start_time');
    }

    public function create(User $user, array $data): Event
    {
        if (!isset($data['reminder_time']) && isset($data['date']) && isset($data['start_time'])) {
            $startTime = $this->normalizeTime($data['start_time']);
            $data['reminder_time'] = $data['date'] . ' ' . $startTime;
        }

        $event = new Event(Arr::except($data, ['_token']));
        $event->user_id = $user->id;
        $event->save();

        return $event;
    }

    public function createWithRecurrence(User $user, array $data, int $targetTotal = 10): Collection
    {
        $createdEvents = collect();
        $createdEvents->push($this->create($user, $data));

        if (! ($data['is_recurring'] ?? false)) {
            return $createdEvents;
        }

        $futureDates = $this->eventRecurrenceService->generateFutureDates(
            $data['date'],
            $data['recurrence_type'],
            120
        );

        foreach ($futureDates as $date) {
            if ($createdEvents->count() >= $targetTotal) {
                break;
            }

            $occurrenceData = $data;
            $occurrenceData['date'] = $date;

            if ($this->hasConflict($user, $occurrenceData)) {
                continue;
            }

            $createdEvents->push($this->create($user, $occurrenceData));
        }

        return $createdEvents;
    }

    public function update(Event $event, array $data): Event
    {
        if (!isset($data['reminder_time']) && (isset($data['date']) || isset($data['start_time']))) {
            $date = $data['date'] ?? $event->date->format('Y-m-d');
            $startTime = isset($data['start_time']) ? $this->normalizeTime($data['start_time']) : $event->start_time->format('H:i:s');
            $data['reminder_time'] = $date . ' ' . $startTime;
        }

        $event->fill($data);
        $event->save();

        return $event;
    }

    public function hasConflict(User $user, array $data, ?int $ignoreEventId = null): bool
    {
        $date = $data['date'];
        $startTime = $this->normalizeTime($data['start_time']);
        $endTime = $this->normalizeTime($data['end_time']);

        $query = Event::query()
            ->where('user_id', $user->id)
            ->where('date', $date)
            ->where(function (Builder $builder) use ($startTime, $endTime): void {
                // 1) New event starts inside an existing event.
                $builder->where(function (Builder $query) use ($startTime): void {
                    $query
                        ->where('start_time', '<', $startTime)
                        ->where('end_time', '>', $startTime);
                })
                // 2) New event ends inside an existing event.
                ->orWhere(function (Builder $query) use ($endTime): void {
                    $query
                        ->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $endTime);
                })
                // 3) New event fully covers an existing event.
                ->orWhere(function (Builder $query) use ($startTime, $endTime): void {
                    $query
                        ->where('start_time', '>=', $startTime)
                        ->where('end_time', '<=', $endTime);
                });
            });

        if ($ignoreEventId !== null) {
            $query->where('id', '!=', $ignoreEventId);
        }

        return $query->exists();
    }

    private function normalizeTime(string $time): string
    {
        return strlen($time) === 5 ? $time.':00' : $time;
    }
}
