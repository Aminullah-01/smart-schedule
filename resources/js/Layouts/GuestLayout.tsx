import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
            <div className="fade-up w-full max-w-md">
                <div className="mb-10 flex flex-col items-center justify-center">
                    <Link href="/">
                        <ApplicationLogo className="h-16 w-auto" />
                    </Link>
                    <p className="mt-4 text-sm text-slate-500">Secure account access</p>
                </div>

                <div className="card-lift overflow-hidden px-6 py-6 sm:rounded-2xl">
                {children}
                </div>
            </div>
        </div>
    );
}
