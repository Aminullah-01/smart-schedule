<?php

namespace App\Mail;

use App\Models\Event;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ?Event $event, public string $reminderMessage)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Event Reminder',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.event-reminder',
            with: [
                'event' => $this->event,
                'reminderMessage' => $this->reminderMessage,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
