'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

interface BreadcrumbItem {
    label: string;
    href: string;
}

const PATH_LABELS: Record<string, string> = {
    churches: 'Churches',
    saints: 'Saints',
    prayers: 'Prayers',
    readings: 'Daily Readings',
    rosary: 'Rosary',
    confession: 'Confession',
    bible: 'Bible',
    'prayer-wall': 'Prayer Wall',
    about: 'About',
    contact: 'Contact',
    dashboard: 'Dashboard',
    profile: 'Profile',
    catechism: 'Catechism',
    glossary: 'Glossary',
    calendar: 'Calendar',
};

export function Breadcrumbs() {
    const pathname = usePathname();

    const breadcrumbs = useMemo(() => {
        if (!pathname || pathname === '/') return [];

        const segments = pathname.split('/').filter(Boolean);
        const items: BreadcrumbItem[] = [];

        let currentPath = '';
        for (const segment of segments) {
            currentPath += `/${segment}`;
            const label = PATH_LABELS[segment] || decodeURIComponent(segment).replace(/-/g, ' ');
            items.push({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                href: currentPath,
            });
        }

        return items;
    }, [pathname]);

    if (breadcrumbs.length === 0) return null;

    // Generate JSON-LD for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://myprayertower.com',
            },
            ...breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: crumb.label,
                item: `https://myprayertower.com${crumb.href}`,
            })),
        ],
    };

    return (
        <>
            {/* JSON-LD for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Visual Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="py-3 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <ol className="container mx-auto flex items-center gap-2 text-sm flex-wrap">
                    <li>
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </li>
                    {breadcrumbs.map((crumb, index) => (
                        <li key={crumb.href} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                            {index === breadcrumbs.length - 1 ? (
                                <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
                                    {crumb.label}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                                >
                                    {crumb.label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
