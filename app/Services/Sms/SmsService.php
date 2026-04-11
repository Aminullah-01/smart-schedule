<?php

namespace App\Services\Sms;

use Illuminate\Support\Facades\Log;

class SmsService
{
    public function sendSMS(string $phone, string $message): void
    {
        $driver = (string) config('services.sms.driver', 'log');

        match ($driver) {
            'termii' => $this->sendViaTermii($phone, $message),
            'log' => $this->sendViaLog($phone, $message),
            default => throw new \RuntimeException("Unsupported SMS driver: {$driver}"),
        };
    }

    private function sendViaTermii(string $phone, string $message): void
    {
        // Placeholder provider structure for future Termii integration.
        Log::info('SMS queued for Termii provider.', [
            'phone' => $phone,
            'message' => $message,
            'provider' => 'termii',
        ]);
    }

    private function sendViaLog(string $phone, string $message): void
    {
        Log::info('SMS notification sent via log driver.', [
            'phone' => $phone,
            'message' => $message,
            'provider' => 'log',
        ]);
    }
}
