<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\NotificationPreferenceController;
use App\Http\Controllers\Api\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('/register', fn () => response()->json([
    'message' => 'Use POST /api/register to create an account.',
], 405));

Route::post('/register', [AuthController::class, 'register']);

Route::get('/login', fn () => response()->json([
    'message' => 'Use POST /api/login to authenticate.',
], 405));

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::get('/events/{id}', [EventController::class, 'show']);
    Route::post('/events/{id}/send-reminder', [EventController::class, 'sendReminderNow']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notification-preferences', [NotificationPreferenceController::class, 'show']);
    Route::put('/notification-preferences', [NotificationPreferenceController::class, 'update']);
    Route::post('/notification-preferences/test-sms', [NotificationPreferenceController::class, 'testSms']);
});


