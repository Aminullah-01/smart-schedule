<?php

namespace App\Services\Sms;

use Illuminate\Support\Facades\Http;
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
        $apiKey = (string) config('services.sms.termii.api_key');
        $senderId = (string) config('services.sms.termii.sender_id', 'N-Alert');
        $channel = (string) config('services.sms.termii.channel', 'generic');
        $type = (string) config('services.sms.termii.type', 'plain');
        $baseUrl = rtrim((string) config('services.sms.termii.base_url', 'https://api.ng.termii.com'), '/');

        if ($apiKey === '') {
            throw new \RuntimeException('Termii API key is missing. Set TERMII_API_KEY in environment.');
        }

        $response = Http::timeout(15)
            ->acceptJson()
            ->post("{$baseUrl}/api/sms/send", [
                'api_key' => $apiKey,
                'to' => $phone,
                'from' => $senderId,
                'sms' => $message,
                'type' => $type,
                'channel' => $channel,
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Termii SMS request failed: '.$response->status().' '.$response->body());
        }

        Log::info('SMS sent via Termii provider.', [
            'phone' => $phone,
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
