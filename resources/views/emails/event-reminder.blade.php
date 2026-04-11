<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Reminder</title>
</head>
<body>
    <h2>Event Reminder</h2>

    @if($event)
        <p><strong>Event:</strong> {{ $event->title }}</p>
        <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($event->date)->toDateString() }}</p>
        <p><strong>Start Time:</strong> {{ \Carbon\Carbon::parse($event->start_time)->format('H:i') }}</p>
    @endif

    <p>Your event starts in 1 hour.</p>
    <p>{{ $reminderMessage }}</p>
</body>
</html>
