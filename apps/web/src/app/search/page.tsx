import { Metadata } from 'next';
import Link from 'next/link';
import { 
    Search, Heart, Star, Sparkles, Building2, BookOpen, 
    Cross, ArrowRight, Flame, Shield, Compass, ChevronRight 
} from 'lucide-react';
import { db } from '@/lib/db';
import { NOVENAS } from '@/lib/novenas';
import { getAllPosts, getAllGuides } from '@/lib/content';
import { JsonLd } from '@/components/seo/JsonLd';
import SearchClientInterface from './SearchClientInterface';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const q = typeof searchParams.q === 'string' ? searchParams.q.trim() : '';
    const title = q
        ? `Search: "${q}" — Catholic Prayers, Saints & Novenas | MyPrayerTower`
        : 'Catholic Search Engine — Prayers, Novenas, Saints & Churches | MyPrayerTower';
    const description = q
        ? `Explore Catholic prayers, 9-day novenas, saints biographies, and church Mass times matching "${q}" on MyPrayerTower.`
        : 'Universal Catholic search engine. Search 4,000+ traditional prayers, miraculous novenas, patron saints, Catholic blog guides, and churches worldwide.';

    return {
        title,
        description,
        alternates: {
            canonical: q
                ? `https://www.myprayertower.com/search?q=${encodeURIComponent(q)}`
                : 'https://www.myprayertower.com/search',
        },
        openGraph: {
            title,
            description,
            url: 'https://www.myprayertower.com/search',
            siteName: 'MyPrayerTower',
            type: 'website',
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
            }
        }
    };
}

export default async function SearchPage({ searchParams }: Props) {
    const query = typeof searchParams.q === 'string' ? searchParams.q.trim() : '';
    const activeType = typeof searchParams.type === 'string' ? searchParams.type : 'all';

    let results: any[] = [];
    const counts = {
        all: 0,
        prayers: 0,
        novenas: 0,
        saints: 0,
        articles: 0,
        churches: 0
    };

    if (query && query.length >= 2) {
        const lowerQuery = query.toLowerCase();
        const queryTerms = lowerQuery.split(/\s+/).filter(Boolean);

        // 1. Novenas
        for (const novena of NOVENAS) {
            const nameLower = novena.name.toLowerCase();
            const patronLower = (novena.patron || '').toLowerCase();
            const patronOfLower = (novena.patronOf || '').toLowerCase();
            const descLower = (novena.description || '').toLowerCase();
            const intentionLower = (novena.intention || '').toLowerCase();

            let score = 0;
            if (nameLower === lowerQuery) score = 100;
            else if (nameLower.startsWith(lowerQuery)) score = 80;
            else if (nameLower.includes(lowerQuery)) score = 60;
            else if (patronLower.includes(lowerQuery) || patronOfLower.includes(lowerQuery)) score = 45;
            else if (descLower.includes(lowerQuery) || intentionLower.includes(lowerQuery)) score = 30;

            if (score > 0) {
                counts.novenas++;
                if (activeType === 'all' || activeType === 'novenas' || activeType === 'novena') {
                    results.push({
                        id: `novena-${novena.id}`,
                        type: 'novena',
                        title: novena.name,
                        subtitle: novena.feastDay ? `Feast: ${novena.feastDay} • Patron of ${novena.patronOf || novena.patron}` : `9-Day Catholic Novena`,
                        snippet: novena.intention || novena.description,
                        url: `/novenas/${novena.id}`,
                        badge: '9-Day Novena',
                        score
                    });
                }
            }
        }

        // 2. Articles & Guides
        try {
            const [posts, guides] = await Promise.all([
                getAllPosts().catch(() => []),
                getAllGuides().catch(() => [])
            ]);

            for (const post of posts) {
                const titleLower = post.title.toLowerCase();
                const descLower = (post.description || '').toLowerCase();
                let score = 0;
                if (titleLower.includes(lowerQuery)) score = 65;
                else if (descLower.includes(lowerQuery)) score = 35;

                if (score > 0) {
                    counts.articles++;
                    if (activeType === 'all' || activeType === 'articles' || activeType === 'blog') {
                        results.push({
                            id: `blog-${post.slug}`,
                            type: 'blog',
                            title: post.title,
                            subtitle: `Catholic Reflection • ${post.category || 'Article'}`,
                            snippet: post.description,
                            url: `/blog/${post.slug}`,
                            badge: 'Article',
                            score
                        });
                    }
                }
            }

            for (const guide of guides) {
                const titleLower = guide.title.toLowerCase();
                const descLower = (guide.description || '').toLowerCase();
                let score = 0;
                if (titleLower.includes(lowerQuery)) score = 65;
                else if (descLower.includes(lowerQuery)) score = 35;

                if (score > 0) {
                    counts.articles++;
                    if (activeType === 'all' || activeType === 'articles' || activeType === 'guide') {
                        results.push({
                            id: `guide-${guide.slug}`,
                            type: 'guide',
                            title: guide.title,
                            subtitle: `Spiritual Guide • ${guide.category || 'Guide'}`,
                            snippet: guide.description,
                            url: `/guides/${guide.slug}`,
                            badge: 'Guide',
                            score
                        });
                    }
                }
            }
        } catch {
            // non-fatal
        }

        // 3. Database queries (Prayers, Saints, Churches)
        try {
            const [dbPrayers, dbSaints, dbChurches] = await Promise.all([
                db.prayer.findMany({
                    where: {
                        OR: [
                            { title: { contains: query, mode: 'insensitive' } },
                            { content: { contains: query, mode: 'insensitive' } },
                            { tags: { hasSome: queryTerms } }
                        ]
                    },
                    take: 24,
                    orderBy: { title: 'asc' },
                    select: { id: true, title: true, slug: true, content: true, category: true, category_label: true }
                }).catch(() => []),
                db.saint.findMany({
                    where: {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { title: { contains: query, mode: 'insensitive' } },
                            { shortBio: { contains: query, mode: 'insensitive' } }
                        ]
                    },
                    take: 12,
                    orderBy: { name: 'asc' },
                    select: { id: true, name: true, slug: true, title: true, feastDay: true, shortBio: true }
                }).catch(() => []),
                db.church.findMany({
                    where: {
                        OR: [
                            { name: { contains: query, mode: 'insensitive' } },
                            { city: { contains: query, mode: 'insensitive' } },
                            { state: { contains: query, mode: 'insensitive' } },
                            { country: { contains: query, mode: 'insensitive' } }
                        ]
                    },
                    take: 12,
                    orderBy: { name: 'asc' },
                    select: { id: true, name: true, slug: true, city: true, state: true, country: true }
                }).catch(() => [])
            ]);

            counts.prayers = dbPrayers.length;
            counts.saints = dbSaints.length;
            counts.churches = dbChurches.length;

            if (activeType === 'all' || activeType === 'prayers' || activeType === 'prayer') {
                for (const p of dbPrayers) {
                    const titleLower = p.title.toLowerCase();
                    let score = 25;
                    if (titleLower === lowerQuery) score = 95;
                    else if (titleLower.startsWith(lowerQuery)) score = 75;
                    else if (titleLower.includes(lowerQuery)) score = 55;

                    results.push({
                        id: `prayer-${p.id}`,
                        type: 'prayer',
                        title: p.title,
                        subtitle: p.category_label || p.category || 'Catholic Prayer',
                        snippet: p.content ? p.content.slice(0, 160) + '...' : undefined,
                        url: `/prayers/${p.slug || p.id}`,
                        badge: 'Prayer',
                        score
                    });
                }
            }

            if (activeType === 'all' || activeType === 'saints' || activeType === 'saint') {
                for (const s of dbSaints) {
                    const nameLower = s.name.toLowerCase();
                    let score = 25;
                    if (nameLower === lowerQuery) score = 95;
                    else if (nameLower.startsWith(lowerQuery)) score = 75;
                    else if (nameLower.includes(lowerQuery)) score = 55;

                    results.push({
                        id: `saint-${s.id}`,
                        type: 'saint',
                        title: s.name,
                        subtitle: s.feastDay ? `Feast: ${s.feastDay}` : (s.title || 'Saint of God'),
                        snippet: s.shortBio ? s.shortBio.slice(0, 160) + '...' : undefined,
                        url: `/saints/${s.slug || s.id}`,
                        badge: 'Saint',
                        score
                    });
                }
            }

            if (activeType === 'all' || activeType === 'churches' || activeType === 'church') {
                for (const c of dbChurches) {
                    const nameLower = c.name.toLowerCase();
                    let score = 20;
                    if (nameLower.includes(lowerQuery)) score = 50;

                    const loc = [c.city, c.state, c.country].filter(Boolean).join(', ');
                    results.push({
                        id: `church-${c.id}`,
                        type: 'church',
                        title: c.name,
                        subtitle: loc || 'Catholic Parish',
                        url: `/churches/${c.slug || c.id}`,
                        badge: 'Parish',
                        score
                    });
                }
            }

        } catch (dbErr) {
            console.error('Search page db query error:', dbErr);
        }

        counts.all = counts.prayers + counts.novenas + counts.saints + counts.articles + counts.churches;
        results.sort((a, b) => b.score - a.score);
    }

    // JSON-LD Structured Data
    const searchResultSchema = {
        '@context': 'https://schema.org',
        '@type': 'SearchResultsPage',
        name: query ? `Search Results for "${query}"` : 'Universal Catholic Search',
        url: `https://www.myprayertower.com/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
        description: 'Universal Catholic search engine across prayers, novenas, saints, and parish churches.',
        isPartOf: {
            '@type': 'WebSite',
            name: 'MyPrayerTower',
            url: 'https://www.myprayertower.com'
        }
    };

    const breadcrumbsSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://www.myprayertower.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Search',
                item: 'https://www.myprayertower.com/search'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#07040b] text-white">
            <JsonLd data={searchResultSchema} />
            <JsonLd data={breadcrumbsSchema} />

            {/* Top Glow & Atmosphere */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-24">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs text-white/50 mb-6" aria-label="Breadcrumb">
                    <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                    <span className="text-gold-400 font-medium">Search</span>
                    {query && (
                        <>
                            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                            <span className="text-white/80 truncate max-w-[200px]">&ldquo;{query}&rdquo;</span>
                        </>
                    )}
                </nav>

                {/* Hero Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                        <span>Universal Catholic Search Engine</span>
                    </div>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                        Seek & You Shall Find
                    </h1>
                    <p className="mt-3 text-sm sm:text-base text-white/60">
                        Search across 4,000+ traditional prayers, miraculous 9-day novenas, holy saints, parish churches, and spiritual reflections.
                    </p>
                </div>

                {/* Client-Interactive Search Bar & Filter Tabs */}
                <SearchClientInterface
                    initialQuery={query}
                    activeType={activeType}
                    counts={counts}
                />

                {/* Search Results Display */}
                {query ? (
                    <div className="mt-8">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                            <h2 className="text-base font-semibold text-white/90">
                                {results.length > 0 ? (
                                    <span>Found <strong className="text-gold-400 font-bold">{results.length}</strong> results for &ldquo;{query}&rdquo;</span>
                                ) : (
                                    <span>No direct results for &ldquo;{query}&rdquo;</span>
                                )}
                            </h2>
                            <span className="text-xs text-white/40">Showing top relevance</span>
                        </div>

                        {results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.url}
                                        className="group relative p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-3 mb-2.5">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase ${
                                                    item.type === 'novena' 
                                                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                                                        : item.type === 'prayer' 
                                                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                                                        : item.type === 'saint'
                                                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                                        : item.type === 'church'
                                                        ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                                                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-gold-400 group-hover:translate-x-1 transition-all" />
                                            </div>

                                            <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-1">
                                                {item.title}
                                            </h3>

                                            {item.subtitle && (
                                                <p className="text-xs text-white/50 mt-1 line-clamp-1">
                                                    {item.subtitle}
                                                </p>
                                            )}

                                            {item.snippet && (
                                                <p className="text-xs text-white/60 mt-2.5 line-clamp-2 leading-relaxed">
                                                    {item.snippet}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gold-400/90 font-medium group-hover:text-gold-300">
                                            <span>
                                                {item.type === 'novena' ? 'Begin 9-Day Novena' : item.type === 'prayer' ? 'Read & Pray' : item.type === 'saint' ? 'View Biography & Patronage' : item.type === 'church' ? 'View Parish Details' : 'Read Article'}
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 px-6">
                                <Search className="w-12 h-12 mx-auto text-white/20 mb-4" />
                                <h3 className="font-serif text-xl font-bold text-white">No exact matches found</h3>
                                <p className="text-sm text-white/50 max-w-md mx-auto mt-2">
                                    Try searching with broad Catholic terms such as &ldquo;St. Jude&rdquo;, &ldquo;Rosary&rdquo;, &ldquo;Divine Mercy&rdquo;, &ldquo;All Souls&rdquo;, or &ldquo;Grace&rdquo;.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Initial Discovery State */
                    <div className="mt-12 space-y-10">
                        {/* Popular Devotions Grid */}
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-gold-400/80 mb-4 flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Trending Catholic Devotions</span>
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {[
                                    { title: 'St. Jude Novena', desc: 'Patron of Hopeless Cases', url: '/novenas/st-jude' },
                                    { title: 'The Holy Rosary', desc: 'All 4 Sacred Mysteries', url: '/rosary' },
                                    { title: 'Divine Mercy Chaplet', desc: '3:00 PM Sacred Hour', url: '/prayers/divine-mercy-chaplet' },
                                    { title: 'St. Michael Prayer', desc: 'Defend us in Battle', url: '/prayers/st-michael' },
                                    { title: 'St. Anthony Novena', desc: 'Miracle Worker & Lost Things', url: '/novenas/st-anthony' },
                                    { title: 'All Souls Day Prayers', desc: 'Holy Souls in Purgatory', url: '/blog/all-souls-day-traditions' },
                                    { title: 'Sacred Heart of Jesus', desc: '12 Divine Promises', url: '/novenas/sacred-heart' },
                                    { title: 'St. Thérèse of Lisieux', desc: 'Novena of the Little Flower', url: '/novenas/st-therese' }
                                ].map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.url}
                                        className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-gold-500/10 border border-white/5 hover:border-gold-500/30 transition-all group"
                                    >
                                        <div className="font-semibold text-sm text-white group-hover:text-gold-300 transition-colors">
                                            {item.title}
                                        </div>
                                        <div className="text-[11px] text-white/40 mt-1 truncate">
                                            {item.desc}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Pillar Quick Explore */}
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-4">
                                Browse by Sanctuary Pillar
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Link
                                    href="/prayers"
                                    className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 hover:border-rose-500/40 transition-all group"
                                >
                                    <Heart className="w-6 h-6 text-rose-400 mb-3" />
                                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-rose-300">
                                        4,000+ Prayers Library
                                    </h3>
                                    <p className="text-xs text-white/60 mt-1">
                                        Traditional Catholic prayers, litanies, and personal intercessions.
                                    </p>
                                </Link>

                                <Link
                                    href="/novenas"
                                    className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all group"
                                >
                                    <Sparkles className="w-6 h-6 text-amber-300 mb-3" />
                                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300">
                                        Miraculous Novenas
                                    </h3>
                                    <p className="text-xs text-white/60 mt-1">
                                        9-day devotions to the Blessed Virgin, Christ, and the Saints.
                                    </p>
                                </Link>

                                <Link
                                    href="/churches"
                                    className="p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 to-transparent border border-sky-500/20 hover:border-sky-500/40 transition-all group"
                                >
                                    <Building2 className="w-6 h-6 text-sky-400 mb-3" />
                                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-sky-300">
                                        Parish & Mass Times
                                    </h3>
                                    <p className="text-xs text-white/60 mt-1">
                                        Locate verified Catholic churches, confession, and adoration hours.
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
