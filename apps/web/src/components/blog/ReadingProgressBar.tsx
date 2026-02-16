'use client';

import { useEffect, useState } from 'react';

export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const article = document.getElementById('article-body');
            if (!article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollY = window.scrollY;

            const start = articleTop;
            const end = articleTop + articleHeight - windowHeight;
            const current = scrollY - start;
            const total = end - start;

            if (total <= 0) {
                setProgress(100);
                return;
            }

            const pct = Math.min(Math.max((current / total) * 100, 0), 100);
            setProgress(pct);
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
            <div
                className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-sacred-500 transition-all duration-150 ease-out shadow-sm shadow-gold-400/30"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
