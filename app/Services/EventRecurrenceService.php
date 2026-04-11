<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use InvalidArgumentException;

class EventRecurrenceService
{
    /**
     * @return list<string>
     */
    public function generateFutureDates(string $startDate, string $recurrenceType, int $maxDates = 120): array
    {
        $dates = [];
        $current = CarbonImmutable::parse($startDate);

        for ($i = 0; $i < $maxDates; $i++) {
            $current = $this->nextDate($current, $recurrenceType);
            $dates[] = $current->toDateString();
        }

        return $dates;
    }

    private function nextDate(CarbonImmutable $date, string $recurrenceType): CarbonImmutable
    {
        return match ($recurrenceType) {
            'daily' => $date->addDay(),
            'weekly' => $date->addWeek(),
            'monthly' => $date->addMonth(),
            default => throw new InvalidArgumentException('Unsupported recurrence type.'),
        };
    }
}
