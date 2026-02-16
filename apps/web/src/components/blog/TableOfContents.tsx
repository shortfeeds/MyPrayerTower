'use client';

import { useEffect, useState } from 'react';
import { List } from 'lucide-react';

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        const article = document.getElementById('article-body');
        if (!article) return;

        const elements = article.querySelectorAll('h2, h3');
        const items: TocItem[] = Array.from(elements).map((el, i) => {
            if (!el.id) {
                el.id = el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `heading-${i}`;
            }
            return {
                id: el.id,
                text: el.textContent || '',
                level: parseInt(el.tagName[1]),
            };
        });
        setHeadings(items);
    }, []);

    useEffect(() => {
        if (headings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Find the first heading that is intersecting
                const visible = entries.filter(e => e.isIntersecting);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
        );

        headings.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [headings]);

    if (headings.length < 2) return null;

    return (
        <nav aria-label="Table of Contents">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                    <List className="w-3.5 h-3.5" />
                    On This Page
                </h4>
                <ul className="space-y-1">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`block text-[13px] leading-relaxed py-1.5 transition-all duration-200 border-l-2 ${heading.level === 3 ? 'pl-6' : 'pl-4'
                                    } ${activeId === heading.id
                                        ? 'text-gold-600 font-semibold border-gold-500'
                                        : 'text-gray-400 hover:text-gray-700 border-transparent hover:border-gray-200'
                                    }`}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
