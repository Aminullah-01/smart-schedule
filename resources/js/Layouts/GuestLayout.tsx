import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
            <div className="fade-up w-full max-w-md">
                <div className="mb-6 flex items-center justify-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-teal-200 bg-teal-50">
                            <ApplicationLogo className="h-7 w-7 fill-current text-teal-700" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold tracking-[0.2em] text-slate-500">
                                SMART SCHEDULER
                            </p>
                            <p className="text-sm text-slate-700">Secure account access</p>
                        </div>
                    </Link>
                </div>

                <div className="card-lift overflow-hidden px-6 py-6 sm:rounded-2xl">
                {children}
                </div>
            </div>
        </div>
    );
}
