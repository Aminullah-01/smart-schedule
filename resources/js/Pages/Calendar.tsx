import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';

type CalendarProps = PageProps<{
    month: string;
    monthLabel: string;
    previousMonth: string;
    nextMonth: string;
    eventsByDate: Record<
        string,
        Array<{
            id: number;
            title: string;
            category: string;
            priority: 'low' | 'medium' | 'high';
            startTime: string;
            endTime: string;
            timeLabel: string;
        }>
    >;
}>;

export default function Calendar({ monthLabel, previousMonth, nextMonth, eventsByDate }: CalendarProps) {
    const dateKeys = Object.keys(eventsByDate).sort();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-teal-700">PLANNING VIEW</p>
                        <h2 className="text-3xl font-semibold leading-tight text-slate-900">Calendar</h2>
                        <p className="mt-1 text-sm text-slate-500">{monthLabel}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route('calendar', { month: previousMonth })}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                        >
                            Previous Month
                        </Link>
                        <Link
                            href={route('calendar', { month: nextMonth })}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                        >
                            Next Month
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Calendar" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="card-lift p-6">
                        {dateKeys.length === 0 && (
                            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
                                No events scheduled for this month.
                            </div>
                        )}

                        <div className="space-y-5">
                            {dateKeys.map((dateKey) => (
                                <section key={dateKey} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            {new Date(`${dateKey}T00:00:00`).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </h3>
                                        <span className="text-xs text-slate-500">
                                            {eventsByDate[dateKey].length} event(s)
                                        </span>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                        {eventsByDate[dateKey].map((event) => (
                                            <article key={event.id} className="rounded-lg border border-slate-200 bg-white p-3">
                                                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                                                <p className="mt-1 text-xs text-slate-500">{event.category}</p>
                                                <p className="mt-2 text-xs text-slate-700">{event.timeLabel}</p>
                                                <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                                                    {event.priority}
                                                </span>
                                            </article>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
