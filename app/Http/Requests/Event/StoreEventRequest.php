<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'string', 'max:100'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'is_recurring' => ['required', 'boolean'],
            'recurrence_type' => [
                'nullable',
                Rule::in(['daily', 'weekly', 'monthly']),
                'required_if:is_recurring,true',
            ],
        ];
    }

    protected function prepareForValidation(): void
    {
        if (! $this->has('is_recurring')) {
            $this->merge(['is_recurring' => false]);
        }
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $isRecurring = $this->boolean('is_recurring');
            $recurrenceType = $this->input('recurrence_type');

            if (! $isRecurring && $recurrenceType !== null) {
                $validator->errors()->add('recurrence_type', 'The recurrence type must be null when event is not recurring.');
            }
        });
    }
}
