import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Smart Scheduler" />

            <div className="relative min-h-screen overflow-hidden pb-14 text-slate-900">
                <div className="pointer-events-none absolute -left-20 top-24 h-64 w-64 rounded-full bg-teal-200/60 blur-3xl" />
                <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-200/55 blur-3xl" />

                <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
                    <Link href="/" className="fade-up flex items-center transition-opacity hover:opacity-90">
                        <img src="/images/logo.png" className="h-11 w-auto" alt="SmartSchedule Logo" />
                    </Link>

                    <nav className="fade-up flex items-center gap-2">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="rounded-lg border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                            >
                                Open Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="rounded-lg border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                <main className="relative mx-auto w-full max-w-6xl px-6">
                    <section className="grid items-start gap-10 pb-14 pt-4 lg:grid-cols-[1.15fr_0.85fr] lg:pt-12">
                        <div className="fade-up space-y-6">
                            <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-teal-800">
                                BUILT FOR FOCUS
                            </span>

                            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                                Organize events, resolve conflicts, and deliver reminders from one clean command center.
                            </h1>

                            <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
                                Smart Scheduler gives teams a reliable timeline with conflict detection,
                                notification history, and API-first integrations that stay easy to maintain.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-1">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                                >
                                    {auth.user ? 'Go to Dashboard' : 'Create Account'}
                                </Link>
                                <a
                                    href="/api-docs"
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                                >
                                    View API Docs
                                </a>
                            </div>
                        </div>

                        <div className="fade-up card-lift grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-1">
                            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">SCHEDULE HEALTH</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">98%</p>
                                <p className="mt-1 text-xs text-slate-600">On-time event starts in the last 7 days.</p>
                            </article>
                            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">ACTIVE REMINDERS</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-900">24</p>
                                <p className="mt-1 text-xs text-slate-600">Email and SMS channels configured.</p>
                            </article>
                            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2 lg:col-span-1">
                                <p className="text-xs font-semibold tracking-[0.14em] text-slate-500">AUTOMATION</p>
                                <p className="mt-2 text-lg font-semibold text-slate-900">Recurring events + queue-ready jobs</p>
                                <p className="mt-1 text-xs text-slate-600">Launch quickly with authentication, events, and notifications endpoints.</p>
                            </article>
                        </div>
                    </section>

                    <section className="fade-up grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                title: 'Conflict-Aware Planning',
                                body: 'Detect overlapping time slots before events are created, not after confusion starts.',
                            },
                            {
                                title: 'Reliable Notifications',
                                body: 'Coordinate reminders across channels and keep a visible activity trail.',
                            },
                            {
                                title: 'API-First Structure',
                                body: 'Use token authentication and clean endpoints to integrate web or mobile clients.',
                            },
                        ].map((feature, index) => (
                            <article
                                key={feature.title}
                                className="card-lift p-5"
                                style={{ animationDelay: `${120 + index * 80}ms` }}
                            >
                                <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
                                <p className="mt-2 text-sm text-slate-600">{feature.body}</p>
                            </article>
                        ))}
                    </section>
                </main>
            </div>
        </>
    );
}
