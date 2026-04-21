import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import axios from 'axios';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type DashboardProps = PageProps<{
    stats: {
        totalEvents: number;
        todayEvents: number;
        upcomingTodayEvents: number;
        remindersSent: number;
        conflictAlerts: number;
        emailChannelPercent: number;
        smsChannelPercent: number;
    };
    timeline: Array<{
        id: number;
        title: string;
        description: string | null;
        category: string;
        priority: 'low' | 'medium' | 'high';
        date: string;
        startTime: string;
        endTime: string;
        isRecurring: boolean;
        recurrenceType: 'daily' | 'weekly' | 'monthly' | null;
        time: string;
        reminderTime: string | null;
        reminderQueuedAt: string | null;
        reminderSentAt: string | null;
    }>;
    recentNotifications: Array<{
        id: number;
        title: string;
        detail: string;
        status: string;
        time: string;
    }>;
}>;

export default function Dashboard({ stats, timeline, recentNotifications }: DashboardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const notifiedBrowserIds = useRef<Set<number>>(new Set());
    const [ruleData, setRuleData] = useState({
        email_enabled: true,
        sms_enabled: false,
        browser_enabled: true,
        in_app_enabled: true,
    });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'General',
        priority: 'medium' as 'low' | 'medium' | 'high',
        date: new Date().toISOString().slice(0, 10),
        start_time: '09:00',
        end_time: '10:00',
        is_recurring: false,
        recurrence_type: '' as '' | 'daily' | 'weekly' | 'monthly',
    });

    const modalTitle = useMemo(
        () => (editingEventId === null ? 'Create Event' : 'Edit Event'),
        [editingEventId],
    );

    const openCreateModal = () => {
        setEditingEventId(null);
        setErrorMessage('');
        setSuccessMessage('');
        setFormData({
            title: '',
            description: '',
            category: 'General',
            priority: 'medium',
            date: new Date().toISOString().slice(0, 10),
            start_time: '09:00',
            end_time: '10:00',
            is_recurring: false,
            recurrence_type: '',
        });
        setIsModalOpen(true);
    };

    const openEditModal = (event: DashboardProps['timeline'][number]) => {
        setEditingEventId(event.id);
        setErrorMessage('');
        setSuccessMessage('');
        setFormData({
            title: event.title,
            description: event.description ?? '',
            category: event.category,
            priority: event.priority,
            date: event.date,
            start_time: event.startTime,
            end_time: event.endTime,
            is_recurring: event.isRecurring,
            recurrence_type: (event.recurrenceType ?? '') as '' | 'daily' | 'weekly' | 'monthly',
        });
        setIsModalOpen(true);
    };

    const refreshDashboard = () => {
        router.reload({
            only: ['stats', 'timeline', 'recentNotifications'],
        });
    };

    const closeModal = () => {
        if (!isSaving) {
            setIsModalOpen(false);
        }
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsSaving(true);

        const payload = {
            ...formData,
            description: formData.description || null,
            recurrence_type: formData.is_recurring ? formData.recurrence_type : null,
        };

        try {
            if (editingEventId === null) {
                await axios.post('/api/events', payload);
            } else {
                await axios.put(`/api/events/${editingEventId}`, payload);
            }

            setIsModalOpen(false);
            setSuccessMessage(editingEventId === null ? 'Event created successfully.' : 'Event updated successfully.');
            refreshDashboard();
        } catch (error: any) {
            setErrorMessage(
                error?.response?.data?.message ??
                    'Unable to save event. Please check your input and try again.',
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (eventId: number) => {
        const confirmed = window.confirm('Delete this event? This action cannot be undone.');

        if (!confirmed) {
            return;
        }

        try {
            await axios.delete(`/api/events/${eventId}`);
            setSuccessMessage('Event deleted successfully.');
            refreshDashboard();
        } catch (error: any) {
            setErrorMessage(
                error?.response?.data?.message ?? 'Unable to delete event right now.',
            );
        }
    };

    /**
     * Derive a reminder status label + style from the event's DB fields.
     * - reminderSentAt set   → Sent
     * - reminderQueuedAt set → Scheduled
     * - reminderTime set     → Auto-enabled (waiting for scheduler)
     * - otherwise            → no reminder
     */
    const getReminderStatus = (
        event: DashboardProps['timeline'][number],
    ): { label: string; className: string; dot: string } => {
        if (event.reminderSentAt) {
            return {
                label: '✓ Sent',
                className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                dot: 'bg-emerald-500',
            };
        }
        if (event.reminderQueuedAt) {
            return {
                label: '⏳ Scheduled',
                className: 'bg-sky-50 text-sky-700 border border-sky-200',
                dot: 'bg-sky-500',
            };
        }
        if (event.reminderTime) {
            return {
                label: '🔔 Auto-enabled',
                className: 'bg-teal-50 text-teal-700 border border-teal-200',
                dot: 'bg-teal-500',
            };
        }
        return {
            label: 'No reminder',
            className: 'bg-slate-100 text-slate-500 border border-slate-200',
            dot: 'bg-slate-400',
        };
    };

    const openRuleModal = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.get('/api/notification-preferences');
            setRuleData({
                email_enabled: Boolean(response.data?.data?.email_enabled),
                sms_enabled: Boolean(response.data?.data?.sms_enabled),
                browser_enabled: Boolean(response.data?.data?.browser_enabled),
                in_app_enabled: Boolean(response.data?.data?.in_app_enabled),
            });
            setIsRuleModalOpen(true);
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message ?? 'Unable to load reminder rule settings.');
        }
    };

    const saveRuleSettings = async () => {
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await axios.put('/api/notification-preferences', ruleData);
            setSuccessMessage('Reminder rule saved successfully.');
            setIsRuleModalOpen(false);
            refreshDashboard();
        } catch (error: any) {
            setErrorMessage(error?.response?.data?.message ?? 'Unable to save reminder rule settings.');
        }
    };

    const today = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    }).format(new Date());

    useEffect(() => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'default') {
            void Notification.requestPermission();
        }

        const fetchBrowserNotifications = async () => {
            if (Notification.permission !== 'granted') {
                return;
            }

            try {
                const response = await axios.get('/api/notifications?limit=30');
                const notifications = Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];

                notifications
                    .filter((item: any) => item.channel === 'browser' && item.status === 'sent')
                    .forEach((item: any) => {
                        const id = Number(item.id);

                        if (Number.isNaN(id) || notifiedBrowserIds.current.has(id)) {
                            return;
                        }

                        notifiedBrowserIds.current.add(id);

                        const title = item.event_id
                            ? 'Event Reminder'
                            : 'Scheduler Notification';

                        new Notification(title, {
                            body: item.message,
                        });
                    });
            } catch {
                // Non-blocking: browser notifications should not break dashboard rendering.
            }
        };

        void fetchBrowserNotifications();
        const interval = window.setInterval(fetchBrowserNotifications, 30000);

        return () => {
            window.clearInterval(interval);
        };
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-teal-700">
                            CONTROL CENTER
                        </p>
                        <h2 className="text-3xl font-semibold leading-tight text-slate-900">
                            Scheduler Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">{today}</p>
                    </div>
                    <div className="flex gap-2">
                        <a
                            href="/api-docs"
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                        >
                            API Docs
                        </a>
                        <button
                            onClick={openCreateModal}
                            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                        >
                            New Event
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {successMessage && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            {successMessage}
                        </div>
                    )}

                    {errorMessage && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            {errorMessage}
                        </div>
                    )}

                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <article className="card-lift fade-up p-5">
                            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                                TOTAL EVENTS
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.totalEvents}</p>
                            <p className="mt-2 text-xs text-teal-700">All scheduled records</p>
                        </article>

                        <article className="card-lift fade-up p-5" style={{ animationDelay: '80ms' }}>
                            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                                TODAY'S EVENTS
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.todayEvents}</p>
                            <p className="mt-2 text-xs text-sky-700">{stats.upcomingTodayEvents} upcoming today</p>
                        </article>

                        <article className="card-lift fade-up p-5" style={{ animationDelay: '140ms' }}>
                            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                                REMINDERS SENT
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.remindersSent}</p>
                            <p className="mt-2 text-xs text-amber-700">Across email and SMS</p>
                        </article>

                        <article className="card-lift fade-up p-5" style={{ animationDelay: '200ms' }}>
                            <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">
                                CONFLICT ALERTS
                            </p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{stats.conflictAlerts}</p>
                            <p className="mt-2 text-xs text-rose-700">Needs reschedule</p>
                        </article>
                    </section>

                    <section className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
                        <article className="card-lift fade-up p-6" style={{ animationDelay: '120ms' }}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Today's Timeline</h3>
                                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">3 Focus Blocks</span>
                            </div>

                            <div className="mt-5 space-y-4">
                                {timeline.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                                        No events scheduled for today yet.
                                    </div>
                                )}

                                {timeline.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                            <p className="mt-1 text-xs text-slate-500">{item.category}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                                                {item.time}
                                            </span>
                                            {/* Reminder Status Badge */}
                                            {(() => {
                                                const status = getReminderStatus(item);
                                                return (
                                                    <span
                                                        title="Automatic reminder status"
                                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.className}`}
                                                    >
                                                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                                        {status.label}
                                                    </span>
                                                );
                                            })()}
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 transition hover:bg-white"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-50"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="card-lift fade-up p-6" style={{ animationDelay: '180ms' }}>
                            <h3 className="text-lg font-semibold text-slate-900">Execution Panel</h3>
                            <div className="mt-4 space-y-3">
                                <a
                                    href="/api-docs"
                                    className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
                                >
                                    Open API Documentation
                                </a>
                                <a
                                    href="/profile"
                                    className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
                                >
                                    Update Profile
                                </a>
                                <button
                                    onClick={openRuleModal}
                                    className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                                >
                                    Create Reminder Rule
                                </button>
                            </div>

                            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold tracking-[0.12em] text-slate-700">
                                    DELIVERY HEALTH
                                </p>
                                <p className="mt-2 text-sm text-slate-700">
                                    92% of reminders were acknowledged within 15 minutes this week.
                                </p>
                            </div>

                            <div className="mt-4 space-y-2">
                                {[
                                    { label: 'Email channel', value: stats.emailChannelPercent },
                                    { label: 'SMS channel', value: stats.smsChannelPercent },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                            <span>{item.label}</span>
                                            <span>{item.value}%</span>
                                        </div>
                                        <div className="h-2 rounded-full bg-slate-200">
                                            <div
                                                className="h-2 rounded-full bg-teal-600"
                                                style={{ width: `${item.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>

                    <section className="card-lift fade-up p-6" style={{ animationDelay: '240ms' }}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Recent Notifications</h3>
                            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                Live Feed
                            </span>
                        </div>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            {recentNotifications.length === 0 && (
                                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 md:col-span-3">
                                    No notifications yet. Trigger reminders to populate this feed.
                                </div>
                            )}

                            {recentNotifications.map((notification) => (
                                <div key={notification.id} className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-sm font-semibold text-slate-800">{notification.title}</p>
                                    <p className="mt-1 text-xs text-slate-500">{notification.detail}</p>
                                    <p className="mt-2 text-[11px] uppercase tracking-[0.1em] text-slate-400">
                                        {notification.status} • {notification.time}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {isRuleModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-slate-900">Reminder Rule</h3>
                            <button
                                type="button"
                                onClick={() => setIsRuleModalOpen(false)}
                                className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600"
                            >
                                Close
                            </button>
                        </div>

                        <p className="mb-4 text-sm text-slate-600">
                            Choose how users receive event reminders.
                        </p>

                        <div className="space-y-3">
                            {[
                                { key: 'email_enabled', label: 'Email reminders' },
                                { key: 'sms_enabled', label: 'SMS reminders' },
                                { key: 'browser_enabled', label: 'Browser reminders' },
                                { key: 'in_app_enabled', label: 'In-app reminders' },
                            ].map((item) => (
                                <label key={item.key} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <span className="text-sm text-slate-700">{item.label}</span>
                                    <input
                                        type="checkbox"
                                        checked={ruleData[item.key as keyof typeof ruleData]}
                                        onChange={(event) =>
                                            setRuleData((previous) => ({
                                                ...previous,
                                                [item.key]: event.target.checked,
                                            }))
                                        }
                                    />
                                </label>
                            ))}
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsRuleModalOpen(false)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveRuleSettings}
                                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
                            >
                                Save Rule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 px-4 py-8">
                    <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-slate-900">{modalTitle}</h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="rounded-md border border-slate-300 px-2 py-1 text-sm text-slate-600"
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                            <label className="sm:col-span-2">
                                <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">TITLE</span>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={(event) =>
                                        setFormData((previous) => ({ ...previous, title: event.target.value }))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </label>

                            <label className="sm:col-span-2">
                                <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">DESCRIPTION</span>
                                <textarea
                                    value={formData.description}
                                    onChange={(event) =>
                                        setFormData((previous) => ({ ...previous, description: event.target.value }))
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </label>

                            <label>
                                <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">CATEGORY</span>
                                <input
                                    required
                                    value={formData.category}
                                    onChange={(event) =>
                                        setFormData((previous) => ({ ...previous, category: event.target.value }))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </label>

                            <label>
                                <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">PRIORITY</span>
                                <select
                                    value={formData.priority}
                                    onChange={(event) =>
                                        setFormData((previous) => ({
                                            ...previous,
                                            priority: event.target.value as 'low' | 'medium' | 'high',
                                        }))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </label>

                            <label>
                                <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">DATE</span>
                                <input
                                    required
                                    type="date"
                                    value={formData.date}
                                    onChange={(event) =>
                                        setFormData((previous) => ({ ...previous, date: event.target.value }))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </label>

                            <label>
                                <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">START TIME</span>
                                <input
                                    required
                                    type="time"
                                    value={formData.start_time}
                                    onChange={(event) =>
                                        setFormData((previous) => ({ ...previous, start_time: event.target.value }))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </label>

                            <label>
                                <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">END TIME</span>
                                <input
                                    required
                                    type="time"
                                    value={formData.end_time}
                                    onChange={(event) =>
                                        setFormData((previous) => ({ ...previous, end_time: event.target.value }))
                                    }
                                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                />
                            </label>

                            <label className="flex items-center gap-2 sm:col-span-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_recurring}
                                    onChange={(event) =>
                                        setFormData((previous) => ({
                                            ...previous,
                                            is_recurring: event.target.checked,
                                            recurrence_type: event.target.checked
                                                ? previous.recurrence_type || 'weekly'
                                                : '',
                                        }))
                                    }
                                />
                                <span className="text-sm text-slate-700">Recurring event</span>
                            </label>

                            {formData.is_recurring && (
                                <label className="sm:col-span-2">
                                    <span className="mb-1 block text-xs font-semibold tracking-[0.12em] text-slate-500">RECURRENCE TYPE</span>
                                    <select
                                        value={formData.recurrence_type}
                                        onChange={(event) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                recurrence_type: event.target.value as
                                                    | ''
                                                    | 'daily'
                                                    | 'weekly'
                                                    | 'monthly',
                                            }))
                                        }
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                    >
                                        <option value="weekly">Weekly</option>
                                        <option value="daily">Daily</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </label>
                            )}

                            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isSaving}
                                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {isSaving ? 'Saving...' : editingEventId === null ? 'Create Event' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
