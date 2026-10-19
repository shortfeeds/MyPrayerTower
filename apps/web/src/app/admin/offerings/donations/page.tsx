'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OfferingsDonationsRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/donations');
    }, [router]);

    return (
        <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );
}
