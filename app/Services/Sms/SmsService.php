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

        // Format phone number to international format, removing '+' or converting local '0' prefix
        $formattedPhone = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($formattedPhone) === 11 && str_starts_with($formattedPhone, '0')) {
            $formattedPhone = '234' . substr($formattedPhone, 1);
        }

        $response = Http::timeout(15)
            ->acceptJson()
            ->post("{$baseUrl}/api/sms/send", [
                'api_key' => $apiKey,
                'to' => $formattedPhone,
                'from' => $senderId,
                'sms' => $message,
                'type' => $type,
                'channel' => $channel,
            ]);

        if (! $response->successful()) {
            $body = $response->json();
            $providerMessage = is_array($body)
                ? (string) ($body['message'] ?? $response->body())
                : $response->body();

            if (str_contains($providerMessage, 'ApplicationSenderId not found')) {
                throw new \RuntimeException(
                    'Termii sender ID is not registered for this account. Update TERMII_SENDER_ID to an approved Sender ID from your Termii dashboard.'
                );
            }

            throw new \RuntimeException('Termii SMS request failed: '.$response->status().' '.$providerMessage);
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
