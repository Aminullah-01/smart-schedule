<?php

namespace App\Http\Requests\Event;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'category' => ['sometimes', 'required', 'string', 'max:100'],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high'])],
            'date' => ['sometimes', 'required', 'date'],
            'start_time' => ['sometimes', 'required', 'date_format:H:i'],
            'end_time' => ['sometimes', 'required', 'date_format:H:i'],
            'is_recurring' => ['sometimes', 'required', 'boolean'],
            'recurrence_type' => [
                'sometimes',
                'nullable',
                Rule::in(['daily', 'weekly', 'monthly']),
                'required_if:is_recurring,true',
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $event = Event::query()
                ->where('id', $this->route('id'))
                ->where('user_id', $this->user()?->id)
                ->first();

            $start = $this->input('start_time');
            $end = $this->input('end_time');
            $isRecurring = $this->has('is_recurring')
                ? $this->boolean('is_recurring')
                : $event?->is_recurring;
            $recurrenceType = $this->has('recurrence_type')
                ? $this->input('recurrence_type')
                : $event?->recurrence_type;

            if ($start === null || $end === null) {
                if ($event !== null) {
                    $start ??= $event->start_time;
                    $end ??= $event->end_time;
                }
            }

            if ($start !== null && $end !== null && strtotime((string) $end) <= strtotime((string) $start)) {
                $validator->errors()->add('end_time', 'The end time must be after start time.');
            }

            if ($isRecurring === false && $recurrenceType !== null) {
                $validator->errors()->add('recurrence_type', 'The recurrence type must be null when event is not recurring.');
            }

            if ($isRecurring === true && $recurrenceType === null) {
                $validator->errors()->add('recurrence_type', 'The recurrence type field is required when event is recurring.');
            }
        });
    }
}
