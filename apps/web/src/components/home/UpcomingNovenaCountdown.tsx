'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Flame, ChevronRight, Share2, Sparkles, Clock, Send } from 'lucide-react';
import { ShareButtons } from '@/components/social/ShareButtons';

interface LiturgicalFeast {
    id: string;
    novenaId: string;
    name: string;
    feastName: string;
    feastMonth: number; // 1-12
    feastDay: number;
    patronOf: string;
    description: string;
}

// Major Catholic feasts with 9-day novena ending the day before the feast
const ANNUAL_FEASTS: LiturgicalFeast[] = [
    {
        id: 'st-jude',
        novenaId: 'st-jude',
        name: 'St. Jude Thaddeus Novena',
        feastName: 'Feast of St. Jude Thaddeus',
        feastMonth: 10,
        feastDay: 28,
        patronOf: 'Hopeless & Impossible Cases',
        description: 'Pray for urgent intentions, desperate situations, and impossible breakthroughs.'
    },
    {
        id: 'holy-souls',
        novenaId: 'holy-souls',
        name: 'Holy Souls in Purgatory Novena',
        feastName: 'All Souls Day',
        feastMonth: 11,
        feastDay: 2,
        patronOf: 'Departed Loved Ones & Souls in Purgatory',
        description: 'Offer nine days of prayer and indulgences for deceased family and the faithful departed.'
    },
    {
        id: 'st-martin',
        novenaId: 'st-martin-de-porres',
        name: 'St. Martin de Porres Novena',
        feastName: 'Feast of St. Martin de Porres',
        feastMonth: 11,
        feastDay: 3,
        patronOf: 'Racial Harmony & Social Justice',
        description: 'Pray for humility, charity toward the poor, and healing of divisions.'
    },
    {
        id: 'st-cecilia',
        novenaId: 'st-cecilia',
        name: 'St. Cecilia Novena',
        feastName: 'Feast of St. Cecilia',
        feastMonth: 11,
        feastDay: 22,
        patronOf: 'Musicians & Church Choirs',
        description: 'Patroness of musicians, hymns, and sacred Catholic worship.'
    },
    {
        id: 'miraculous-medal',
        novenaId: 'miraculous-medal',
        name: 'Our Lady of the Miraculous Medal Novena',
        feastName: 'Feast of the Miraculous Medal',
        feastMonth: 11,
        feastDay: 27,
        patronOf: 'Grace, Protection & Miracles',
        description: 'O Mary conceived without sin, pray for us who have recourse to thee.'
    },
    {
        id: 'immaculate-conception',
        novenaId: 'immaculate-conception',
        name: 'Immaculate Conception Novena',
        feastName: 'Solemnity of the Immaculate Conception',
        feastMonth: 12,
        feastDay: 8,
        patronOf: 'The United States & Purity',
        description: 'Honor Our Blessed Mother under her title as Patroness of the Americas.'
    },
    {
        id: 'guadalupe',
        novenaId: 'our-lady-guadalupe',
        name: 'Our Lady of Guadalupe Novena',
        feastName: 'Feast of Our Lady of Guadalupe',
        feastMonth: 12,
        feastDay: 12,
        patronOf: 'The Americas & Unborn Children',
        description: 'Celebrate the apparition of Our Lady to St. Juan Diego at Tepeyac.'
    },
    {
        id: 'christmas-novena',
        novenaId: 'christmas',
        name: 'Traditional Christmas Novena',
        feastName: 'Solemnity of the Nativity of the Lord (Christmas)',
        feastMonth: 12,
        feastDay: 25,
        patronOf: 'Peace, Families & Expectant Mothers',
        description: 'Prepare your heart for the Nativity of Christ with nine days of joyful anticipation.'
    },
    {
        id: 'st-joseph',
        novenaId: 'st-joseph',
        name: 'Solemn Novena to St. Joseph',
        feastName: 'Solemnity of St. Joseph, Spouse of the BVM',
        feastMonth: 3,
        feastDay: 19,
        patronOf: 'Workers, Fathers & Universal Church',
        description: 'Go to Joseph for family protection, employment, housing, and holy death.'
    },
    {
        id: 'divine-mercy',
        novenaId: 'divine-mercy',
        name: 'Divine Mercy Novena',
        feastName: 'Divine Mercy Sunday',
        feastMonth: 4,
        feastDay: 27,
        patronOf: 'Divine Mercy & Sinners',
        description: 'Dictated by Jesus to St. Faustina, beginning Good Friday for abundant mercy.'
    },
    {
        id: 'st-anthony',
        novenaId: 'st-anthony',
        name: 'St. Anthony of Padua Novena',
        feastName: 'Feast of St. Anthony of Padua',
        feastMonth: 6,
        feastDay: 13,
        patronOf: 'Lost Articles, Travelers & The Poor',
        description: 'Miracle worker and Doctor of the Church for finding lost things and lost souls.'
    }
];

export function UpcomingNovenaCountdown() {
    const activeFeast = useMemo(() => {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Find the next upcoming feast or one currently in progress
        const feastWithDates = ANNUAL_FEASTS.map(f => {
            let feastDate = new Date(currentYear, f.feastMonth - 1, f.feastDay);
            // Novena typically starts 9 days before the feast
            let novenaStartDate = new Date(feastDate);
            novenaStartDate.setDate(feastDate.getDate() - 9);

            // If the feast already passed this year, check next year
            if (feastDate.getTime() < now.getTime() - (24 * 60 * 60 * 1000)) {
                feastDate = new Date(currentYear + 1, f.feastMonth - 1, f.feastDay);
                novenaStartDate = new Date(feastDate);
                novenaStartDate.setDate(feastDate.getDate() - 9);
            }

            const msToStart = novenaStartDate.getTime() - now.getTime();
            const daysToStart = Math.ceil(msToStart / (1000 * 60 * 60 * 24));
            const msToFeast = feastDate.getTime() - now.getTime();
            const daysToFeast = Math.ceil(msToFeast / (1000 * 60 * 60 * 24));

            const isInProgress = daysToStart <= 0 && daysToFeast >= 0;
            const currentDayOfNovena = isInProgress ? Math.min(9, Math.max(1, 10 - daysToFeast)) : 0;

            return {
                ...f,
                feastDate,
                novenaStartDate,
                daysToStart,
                daysToFeast,
                isInProgress,
                currentDayOfNovena,
            };
        });

        // Sort by soonest (in progress first, then upcoming)
        feastWithDates.sort((a, b) => {
            if (a.isInProgress && !b.isInProgress) return -1;
            if (!a.isInProgress && b.isInProgress) return 1;
            return a.daysToStart - b.daysToStart;
        });

        return feastWithDates[0];
    }, []);

    if (!activeFeast) return null;

    const feastDateFormatted = activeFeast.feastDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });

    const novenaUrl = `/novenas/${activeFeast.novenaId}`;

    return (
        <section
            aria-label="Upcoming Novena & Catholic Feast Day"
            className="my-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-2xl border border-indigo-500/20"
        >
            {/* Glowing Amber Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="relative p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Left: Feast & Novena Info */}
                <div className="max-w-2xl space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {activeFeast.isInProgress ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider animate-pulse">
                                <Flame className="w-3.5 h-3.5 fill-current" />
                                Novena In Progress: Day {activeFeast.currentDayOfNovena} of 9
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/20 text-amber-300 uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5" />
                                Starts in {activeFeast.daysToStart} {activeFeast.daysToStart === 1 ? 'day' : 'days'}
                            </span>
                        )}
                        <span className="text-xs text-indigo-200">
                            Feast Day: <strong>{feastDateFormatted}</strong>
                        </span>
                    </div>

                    <div>
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                            {activeFeast.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-1">
                            Patron of {activeFeast.patronOf}
                        </p>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                        {activeFeast.description} Pray together with thousands of Catholic faithful in our global communion.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <Link
                            href={novenaUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-lg"
                        >
                            <Flame className="w-4 h-4 fill-current" />
                            {activeFeast.isInProgress ? `Pray Day ${activeFeast.currentDayOfNovena}` : 'Preview & Pray Novena'}
                            <ChevronRight className="w-4 h-4" />
                        </Link>

                        <a
                            href="https://t.me/myprayertower"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs backdrop-blur transition-all"
                        >
                            <Send className="w-4 h-4 text-sky-400" />
                            Join Daily Novena on Telegram
                        </a>
                    </div>
                </div>

                {/* Right: Liturgical Mini Card with Share */}
                <div className="lg:w-80 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between text-xs text-indigo-200 border-b border-white/10 pb-3">
                        <span className="uppercase tracking-widest font-semibold">Liturgical Calendar</span>
                        <Calendar className="w-4 h-4 text-amber-400" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Feast Celebration</p>
                        <p className="font-serif font-bold text-base text-white">{activeFeast.feastName}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider">Devotional Tradition</p>
                        <p className="text-xs text-slate-300">9 Days of Holy Communion, Rosary &amp; Intercession</p>
                    </div>

                    <div className="pt-3 border-t border-white/10">
                        <p className="text-[11px] text-slate-400 mb-2">Invite family to pray:</p>
                        <ShareButtons
                            url={`https://www.myprayertower.com${novenaUrl}`}
                            title={`Join me in praying the ${activeFeast.name} on MyPrayerTower.`}
                            description={activeFeast.description}
                            variant="cta"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
