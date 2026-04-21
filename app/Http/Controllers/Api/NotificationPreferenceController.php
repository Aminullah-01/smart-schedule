<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificationPreference;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();

        $preference = NotificationPreference::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'email_enabled' => true,
                'sms_enabled' => false,
                'browser_enabled' => true,
                'in_app_enabled' => true,
            ]
        );

        return response()->json([
            'data' => $preference,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $payload = $request->validate([
            'email_enabled' => ['required', 'boolean'],
            'sms_enabled' => ['required', 'boolean'],
            'browser_enabled' => ['required', 'boolean'],
            'in_app_enabled' => ['required', 'boolean'],
        ]);

        $preference = NotificationPreference::query()->updateOrCreate(
            ['user_id' => $user->id],
            $payload
        );

        return response()->json([
            'message' => 'Reminder rule saved successfully.',
            'data' => $preference,
        ]);
    }

    public function testSms(Request $request, NotificationService $notificationService): JsonResponse
    {
        $user = $request->user();

        $preference = NotificationPreference::query()->firstOrCreate(
            ['user_id' => $user->id],
            [
                'email_enabled' => true,
                'sms_enabled' => false,
                'browser_enabled' => true,
                'in_app_enabled' => true,
            ]
        );

        if (! $preference->sms_enabled) {
            return response()->json([
                'message' => 'Enable SMS reminders in your reminder rule first.',
            ], 422);
        }

        if (empty($user->phone)) {
            return response()->json([
                'message' => 'Phone number is missing on your profile.',
            ], 422);
        }

        $notificationService->send($user, null, ['sms']);

        return response()->json([
            'message' => 'Test SMS sent successfully.',
        ]);
    }
}
