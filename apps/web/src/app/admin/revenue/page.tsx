'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RevenueRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/admin/finance/overview');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Redirecting to Financial Center...</p>
        </div>
    );
}
