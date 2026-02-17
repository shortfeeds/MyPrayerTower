import { getChurchById } from '@/app/actions/church-directory';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    MapPin, Globe, Phone, Clock, ArrowLeft, Share2, Star,
    Calendar, Mail, Info, History, Eye, Users, ExternalLink,
    ShieldCheck, Building
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChurchDetailPage({ params }: { params: { id: string } }) {
    const church = await getChurchById(params.id);

    if (!church) {
        notFound();
    }

    // Safely parse JSON schedules
    const renderSchedule = (schedule: any) => {
        if (!schedule) return null;
        try {
            const data = typeof schedule === 'string' ? JSON.parse(schedule) : schedule;
            if (Array.isArray(data)) {
                return data.map((item: any, idx: number) => (
                    <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.day || item.label}</p>
                        <p className="font-medium text-white">{item.time || item.value}</p>
                    </div>
                ));
            }
            if (typeof data === 'object') {
                return Object.entries(data).map(([key, value]: [string, any], idx: number) => (
                    <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{key}</p>
                        <p className="font-medium text-white">{String(value)}</p>
                    </div>
                ));
            }
        } catch (e) {
            return <p className="text-sm text-white/60">Schedule data unavailable</p>;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 pb-20">
            {/* Hero Image */}
            <div className="relative h-[450px] w-full bg-gray-900">
                {church.primaryImageUrl ? (
                    <Image
                        src={church.primaryImageUrl}
                        alt={church.name}
                        fill
                        className="object-cover opacity-70"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <Building className="w-20 h-20 text-gray-700 opacity-20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute top-0 left-0 p-6 z-20">
                    <Link href="/churches" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Directory
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="max-w-4xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-gold-500 text-black text-[10px] font-bold uppercase tracking-widest rounded">
                                        {church.denomination}
                                    </span>
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-bold uppercase tracking-widest rounded border border-white/10">
                                        {church.type.replace('_', ' ')}
                                    </span>
                                    {church.isVerified && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded border border-emerald-500/30">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Verified Parish
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                                    {church.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-gold-500" />
                                        <span className="text-lg">
                                            {church.address}, {church.city}{church.state ? `, ${church.state}` : ''} {church.postalCode}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-400 border-l border-white/20 pl-6">
                                        <div className="flex items-center gap-1.5">
                                            <Eye className="w-4 h-4" />
                                            <span>{church.viewCount.toLocaleString()} views</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users className="w-4 h-4" />
                                            <span>{church.followerCount.toLocaleString()} followers</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-lg hover:bg-white/20 transition shadow-lg flex items-center gap-2">
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                                <button className="px-6 py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-400 transition shadow-lg shadow-gold-500/20 flex items-center gap-2">
                                    <Star className="w-4 h-4" />
                                    Favorite
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview */}
                        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                <Info className="w-6 h-6 text-gold-500" />
                                Parish Overview
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
                                {church.shortDescription && (
                                    <p className="text-lg font-medium text-gray-900 dark:text-white italic border-l-4 border-gold-500 pl-4">
                                        {church.shortDescription}
                                    </p>
                                )}
                                {church.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: church.description }} />
                                ) : (
                                    <p>Welcome to {church.name}, a focal point of the local Catholic community. We are dedicated to providing a spiritual home where everyone can encounter Christ through the Sacraments, prayer, and selfless service.</p>
                                )}
                            </div>
                        </section>

                        {/* History */}
                        {church.history && (
                            <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                    <History className="w-6 h-6 text-gold-500" />
                                    Parish History
                                </h2>
                                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                                    <div dangerouslySetInnerHTML={{ __html: church.history }} />
                                </div>
                            </section>
                        )}

                        {/* Location & Map */}
                        <section className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-gold-500" />
                                Location & Directions
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        Located in the heart of {church.city}, {church.name} is easily accessible from all major routes.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                                            <span className="text-lg font-medium">
                                                {church.address}<br />
                                                {church.city}, {church.state} {church.postalCode}<br />
                                                {church.country}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex gap-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${church.name} ${church.address} ${church.city}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-sacred-600 text-white rounded-xl font-bold hover:bg-sacred-700 transition flex items-center gap-2"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Get Directions
                                        </a>
                                        {church.virtualTourUrl && (
                                            <a
                                                href={church.virtualTourUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                            >
                                                Virtual Tour
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <div className="text-center p-6">
                                    <MapPin className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400 italic">Enhanced map features are currently in development.</p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">Loc: {church.latitude}, {church.longitude}</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        {/* Quick Actions */}
                        <div className="flex flex-col gap-3">
                            {church.website && (
                                <a href={church.website} target="_blank" rel="noreferrer" className="w-full py-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 font-bold flex items-center justify-center gap-3 hover:border-gold-500 transition-colors">
                                    <Globe className="w-5 h-5 text-gold-500" />
                                    Official Website
                                </a>
                            )}
                            {church.calendarUrl && (
                                <a href={church.calendarUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 font-bold flex items-center justify-center gap-3 hover:border-gold-500 transition-colors">
                                    <Calendar className="w-5 h-5 text-gold-500" />
                                    Parish Calendar
                                </a>
                            )}
                        </div>

                        {/* Schedules Container */}
                        <div className="bg-sacred-900 p-8 rounded-3xl text-white shadow-2xl shadow-sacred-900/20 relative overflow-hidden space-y-8">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-[80px] pointer-events-none" />

                            {/* Mass Schedule */}
                            <section className="relative z-10">
                                <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Clock className="w-5 h-5 text-gold-400" />
                                    </div>
                                    Holy Mass
                                </h3>
                                <div className="space-y-4">
                                    {renderSchedule(church.massSchedule) || (
                                        <p className="text-sm text-white/60 italic">Please contact parish for schedule.</p>
                                    )}
                                </div>
                            </section>

                            {/* Confession */}
                            <section className="relative z-10 border-t border-white/10 pt-8">
                                <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <ShieldCheck className="w-5 h-5 text-gold-400" />
                                    </div>
                                    Replication (Confession)
                                </h3>
                                <div className="space-y-4">
                                    {renderSchedule(church.confessionSchedule) || (
                                        <p className="text-sm text-white/60 italic">Saturday at 4:00 PM or by appointment.</p>
                                    )}
                                </div>
                            </section>

                            {/* Adoration */}
                            {church.adorationSchedule && (
                                <section className="relative z-10 border-t border-white/10 pt-8">
                                    <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-white/10 rounded-lg">
                                            <Star className="w-5 h-5 text-gold-400 fill-gold-400/20" />
                                        </div>
                                        Adoration
                                    </h3>
                                    <div className="space-y-4">
                                        {renderSchedule(church.adorationSchedule)}
                                    </div>
                                </section>
                            )}

                            <div className="pt-4 mt-6 border-t border-white/5 relative z-10">
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Updated: {new Date(church.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Diocesan Contact */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Globe className="w-4 h-4 text-gold-500" />
                                Parish Contact
                            </h3>
                            <div className="space-y-4">
                                {church.phone && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <a href={`tel:${church.phone}`} className="text-sm font-medium hover:text-gold-500 transition-colors">{church.phone}</a>
                                    </div>
                                )}
                                {church.email && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <a href={`mailto:${church.email}`} className="text-sm font-medium hover:text-gold-500 transition-colors truncate">{church.email}</a>
                                    </div>
                                )}
                            </div>

                            {(church as any).Diocese && (
                                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Diocese</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                            <Building className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{(church as any).Diocese.name}</p>
                                            <p className="text-xs text-gray-500">{(church as any).Diocese.region}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
