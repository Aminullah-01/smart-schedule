<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event;
use App\Services\EventService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function __construct(private readonly EventService $eventService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $events = $this->eventService
            ->forUser($request->user())
            ->get();

        return response()->json([
            'data' => $events,
        ]);
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $user = $request->user();
        $payload = $request->validated();

        if ($this->eventService->hasConflict($user, $payload)) {
            return response()->json([
                'message' => 'Event time conflicts with an existing event.',
            ], 409);
        }

        $events = $this->eventService->createWithRecurrence($user, $payload);

        return response()->json([
            'message' => 'Event created successfully.',
            'data' => $events,
        ], 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $event = $this->findUserEvent($request, $id);

        return response()->json([
            'data' => $event,
        ]);
    }

    public function update(UpdateEventRequest $request, int $id): JsonResponse
    {
        $event = $this->findUserEvent($request, $id);

        $payload = array_merge($event->only(['date', 'start_time', 'end_time']), $request->validated());

        if ($this->eventService->hasConflict($request->user(), $payload, $event->id)) {
            return response()->json([
                'message' => 'Event time conflicts with an existing event.',
            ], 409);
        }

        $event = $this->eventService->update($event, $request->validated());

        return response()->json([
            'message' => 'Event updated successfully.',
            'data' => $event,
        ]);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $event = $this->findUserEvent($request, $id);
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully.',
        ]);
    }

    private function findUserEvent(Request $request, int $id): Event
    {
        return $this->eventService
            ->forUser($request->user())
            ->where('id', $id)
            ->firstOrFail();
    }
}
