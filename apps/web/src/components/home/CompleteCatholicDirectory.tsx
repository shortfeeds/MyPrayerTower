import Link from 'next/link';
import { Sparkles, BookOpen, Heart, Users, GraduationCap, MapPin, ArrowRight } from 'lucide-react';

const PILLARS = [
    {
        id: 'prayer',
        title: '1. Prayer & Devotions',
        subtitle: 'Core Soul of the Sanctuary',
        icon: Sparkles,
        accent: 'border-gold-500/40',
        links: [
            { label: 'Global Prayer Wall', href: '/prayer-wall' },
            { label: 'Prayer Library', href: '/prayers' },
            { label: 'Holy Rosary', href: '/rosary' },
            { label: 'Divine Mercy & Chaplets', href: '/chaplets' },
            { label: '9-Day Novenas', href: '/novenas' },
            { label: 'Novena Tracker', href: '/novena-tracker' },
            { label: 'Stations of the Cross', href: '/stations' },
            { label: 'Daily Examen', href: '/examen' },
            { label: 'Focus Prayer Mode', href: '/focus-mode' },
            { label: 'AI Prayer Companion', href: '/ai-companion' },
            { label: 'Prayer Journal', href: '/journal' },
            { label: 'Fasting Guide', href: '/fasting' },
            { label: 'Prayer Partners', href: '/prayer-partners' },
        ],
    },
    {
        id: 'liturgy',
        title: '2. Daily Liturgy, Mass & Word',
        subtitle: 'Scripture & Liturgical Life',
        icon: BookOpen,
        accent: 'border-gold-500/30',
        links: [
            { label: 'Daily Mass Readings', href: '/readings' },
            { label: 'Watch Live Mass', href: '/live-mass' },
            { label: 'Holy Bible', href: '/bible' },
            { label: 'Bible Reading Plans', href: '/reading-plans' },
            { label: 'Liturgy of the Hours', href: '/divine-office' },
            { label: 'Liturgical Calendar', href: '/calendar' },
            { label: 'Saints & Feasts', href: '/saints' },
            { label: '7 Sacraments', href: '/sacraments' },
            { label: 'Confession Guide', href: '/confession' },
        ],
    },
    {
        id: 'offerings',
        title: '3. Sacred Offerings & Remembrance',
        subtitle: 'Candles, Masses & Perpetual Vigils',
        icon: Heart,
        accent: 'border-crimson-500/45',
        links: [
            { label: 'Virtual Candle Altar', href: '/candles' },
            { label: 'My Sacred Vigils', href: '/my-vigils' },
            { label: 'Request a Holy Mass', href: '/mass-offerings' },
            { label: 'Sponsor Prayer Events', href: '/events' },
            { label: 'Eternal Memorials', href: '/memorials' },
            { label: 'Spiritual Bouquets', href: '/bouquets' },
            { label: 'Occasion Blessings', href: '/blessings' },
            { label: 'Sacred Anniversaries', href: '/anniversaries' },
            { label: 'Catholic Obituaries', href: '/news/obituaries' },
            { label: 'Consecration Certificates', href: '/certificates' },
            { label: 'Support & Donations', href: '/donate' },
            { label: 'Missions & Campaigns', href: '/campaigns' },
        ],
    },
    {
        id: 'community',
        title: '4. Sacred Media & Community',
        subtitle: 'Chant, Art & Fellowship',
        icon: Users,
        accent: 'border-gold-500/30',
        links: [
            { label: 'Gregorian Chant', href: '/chant' },
            { label: 'Catholic Hymns', href: '/hymns' },
            { label: 'Sacred Art Gallery', href: '/art' },
            { label: 'Catholic Podcasts', href: '/podcasts' },
            { label: 'Prayer Groups', href: '/groups' },
            { label: 'Faith Testimonies', href: '/testimonies' },
            { label: 'Spiritual Challenges', href: '/challenges' },
            { label: 'My Spiritual Journey', href: '/journey' },
            { label: 'Achievements & Badges', href: '/achievements' },
            { label: 'Community Leaderboard', href: '/leaderboard' },
        ],
    },
    {
        id: 'study',
        title: '5. Catholic Treasury & Study',
        subtitle: 'Magisterium, Doctrine & News',
        icon: GraduationCap,
        accent: 'border-gold-500/30',
        links: [
            { label: 'Catechism (CCC)', href: '/catechism' },
            { label: 'Summa Theologica', href: '/summa' },
            { label: 'Papal Encyclicals', href: '/encyclicals' },
            { label: 'Vatican II Documents', href: '/vatican-ii' },
            { label: 'Canon Law', href: '/canon-law' },
            { label: 'Church History', href: '/history' },
            { label: 'Church Hierarchy', href: '/hierarchy' },
            { label: 'Catholic Guides & How-To', href: '/guides' },
            { label: 'Catholic Glossary', href: '/glossary' },
            { label: 'Faith Quiz', href: '/quiz' },
            { label: 'Catholic Blog & News', href: '/blog' },
        ],
    },
    {
        id: 'parishes',
        title: '6. Parish & Mass Finder',
        subtitle: 'Added Advantage • Worldwide',
        icon: MapPin,
        accent: 'border-marian-600/60',
        links: [
            { label: 'Find a Catholic Church', href: '/churches' },
            { label: 'Mass Times Directory', href: '/mass-times' },
            { label: 'Global Dioceses', href: '/dioceses' },
            { label: 'Catholic Pilgrimages', href: '/pilgrimages' },
            { label: 'Parish Portal', href: '/for-churches' },
            { label: 'Ministry Partners', href: '/partners' },
        ],
    },
];

export function CompleteCatholicDirectory() {
    return (
        <section className="py-16 bg-[#120E0A] border-t border-gold-500/20">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Added-Advantage Parish Finder Highlight Band */}
                <div className="mb-14 rounded-3xl bg-gradient-to-r from-[#172844] via-[#13223A] to-[#0E1A2F] border border-gold-500/35 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="inline-block px-3 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/30 text-gold-300 text-[10px] font-bold uppercase tracking-widest">
                            Added Sanctuary Advantage
                        </span>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#FAF6EE]">
                            Find a Catholic Parish &amp; Mass Times Near You
                        </h3>
                        <p className="text-sm text-[#CFC5B4] max-w-xl">
                            Traveling or seeking Confession, Adoration, and Sunday Mass? Explore our global Catholic Church &amp; Diocese directory.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
                        <Link
                            href="/churches"
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>Find Churches Near Me</span>
                        </Link>
                        <Link
                            href="/mass-times"
                            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 text-[#FAF6EE] border border-white/20 font-semibold text-xs sm:text-sm"
                        >
                            Mass Times
                        </Link>
                    </div>
                </div>

                {/* 6-Pillar Directory Header */}
                <div className="text-center mb-10">
                    <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-bold">
                        ✠ Complete Catholic Sanctuary Index ✠
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#FAF6EE] mt-2">
                        Every Sacred Resource, Organized for Your Soul
                    </h2>
                    <p className="font-serif italic text-[#CFC5B4] mt-2 max-w-2xl mx-auto">
                        Explore all 6 pillars of MyPrayerTower — from daily prayer and liturgical readings to offerings, study, and local parishes.
                    </p>
                </div>

                {/* 6-Pillar Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PILLARS.map((pillar) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={pillar.id}
                                className={`rounded-2xl bg-[#18120D] border ${pillar.accent} p-6 shadow-xl flex flex-col`}
                            >
                                <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gold-500/15">
                                    <div className="w-10 h-10 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-300 shrink-0">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-display text-base font-bold text-[#FAF6EE]">{pillar.title}</h3>
                                        <p className="text-[11px] text-gold-300/80">{pillar.subtitle}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                                    {pillar.links.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="group flex items-center gap-1.5 text-xs text-[#CFC5B4] hover:text-gold-300 transition-colors py-1"
                                        >
                                            <ArrowRight className="w-3 h-3 text-gold-500/50 group-hover:text-gold-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                                            <span className="truncate">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
