import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { BreadcrumbJsonLd } from './JsonLd';

interface BreadcrumbItem {
    label: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@id': `https://myprayertower.com${item.href}`,
                name: item.label,
            },
        })),
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <BreadcrumbJsonLd data={jsonLd as any} />
            <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                <li>
                    <Link href="/" className="hover:text-gold-600 transition-colors">
                        Home
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={item.href} className="flex items-center">
                        <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                        {index === items.length - 1 ? (
                            <span className="font-medium text-gray-900" aria-current="page">
                                {item.label}
                            </span>
                        ) : (
                            <Link href={item.href} className="hover:text-gold-600 transition-colors">
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
