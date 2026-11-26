import type { Metadata } from 'next';
import Link from 'next/link';
import { Flame, CircleDot, BookOpen, Smartphone, Globe2, ArrowRight } from 'lucide-react';

interface LocaleInfo {
    code: string;
    name: string;
    title: string;
    subtitle: string;
    rosaryCta: string;
    candleCta: string;
    readingsCta: string;
    appBannerTitle: string;
    appBannerCta: string;
}

const LOCALES: Record<string, LocaleInfo> = {
    es: {
        code: 'es',
        name: 'Español',
        title: 'Tu Santuario Católico Diario',
        subtitle: 'Reza el Santo Rosario, enciende una vela votiva gratis y lee el Evangelio de hoy.',
        rosaryCta: 'Rezar el Santo Rosario',
        candleCta: 'Encender una Vela — Gratis',
        readingsCta: 'Lecturas de la Misa de Hoy',
        appBannerTitle: 'Descarga MyPrayerTower en Android (14 Idiomas)',
        appBannerCta: 'Abrir en Google Play',
    },
    pt: {
        code: 'pt',
        name: 'Português',
        title: 'Seu Santuário Católico Diário',
        subtitle: 'Reze o Santo Terço, acenda uma vela votiva gratuita e leia o Evangelho de hoje.',
        rosaryCta: 'Rezar o Santo Terço',
        candleCta: 'Acender uma Vela — Grátis',
        readingsCta: 'Leituras da Missa de Hoje',
        appBannerTitle: 'Baixe MyPrayerTower no Android (14 Idiomas)',
        appBannerCta: 'Baixar no Google Play',
    },
    fil: {
        code: 'fil',
        name: 'Tagalog / Filipino',
        title: 'Ang Iyong Pang-araw-araw na Santuwaryong Katoliko',
        subtitle: 'Magdasal ng Santo Rosaryo, magsindi ng libreng kandila, at basahin ang Ebanghelyo ngayon.',
        rosaryCta: 'Magdasal ng Santo Rosaryo',
        candleCta: 'Magsindi ng Kandila — Libre',
        readingsCta: 'Mga Pagbasa sa Misa Ngayon',
        appBannerTitle: 'I-download ang MyPrayerTower sa Android (14 Wika)',
        appBannerCta: 'Kunin sa Google Play',
    },
    it: {
        code: 'it',
        name: 'Italiano',
        title: 'Il Tuo Santuario Cattolico Quotidiano',
        subtitle: 'Prega il Santo Rosario, accendi una candela gratuita e leggi il Vangelo di oggi.',
        rosaryCta: 'Prega il Santo Rosario',
        candleCta: 'Accendi una Candela — Gratis',
        readingsCta: 'Letture della Messa di Oggi',
        appBannerTitle: 'Scarica MyPrayerTower su Android (14 Lingue)',
        appBannerCta: 'Scarica su Google Play',
    },
    fr: {
        code: 'fr',
        name: 'Français',
        title: 'Votre Sanctuaire Catholique Quotidien',
        subtitle: 'Priez le Saint Rosaire, allumez un cierge gratuit et lisez l’Évangile du jour.',
        rosaryCta: 'Prier le Saint Rosaire',
        candleCta: 'Allumer un Cierge — Gratuit',
        readingsCta: 'Lectures de la Messe du Jour',
        appBannerTitle: 'Téléchargez MyPrayerTower sur Android (14 Langues)',
        appBannerCta: 'Obtenir sur Google Play',
    },
};

export function generateStaticParams() {
    return Object.keys(LOCALES).map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const info = LOCALES[locale] || LOCALES.es;
    return {
        title: `${info.title} | MyPrayerTower (${info.name})`,
        description: info.subtitle,
        alternates: {
            canonical: `https://www.myprayertower.com/sanctuary/${info.code}`,
        },
    };
}

export default async function LocalizedSanctuaryPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const info = LOCALES[locale] || LOCALES.es;

    return (
        <div className="min-h-screen bg-[#120E0A] text-[#FAF6EE] py-16 px-4">
            <div className="container mx-auto max-w-4xl space-y-10">
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-gold-300 text-xs font-bold uppercase tracking-widest">
                        <Globe2 className="w-3.5 h-3.5" /> {info.name}
                    </span>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#FAF6EE]">
                        {info.title}
                    </h1>
                    <p className="font-serif italic text-lg sm:text-xl text-[#CFC5B4] max-w-2xl mx-auto">
                        {info.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Link
                        href="/candles"
                        className="p-6 rounded-3xl bg-[#18120D] border border-gold-500/35 hover:border-gold-400 transition-all space-y-3"
                    >
                        <Flame className="w-8 h-8 text-amber-400" />
                        <h2 className="font-display text-xl font-bold">{info.candleCta}</h2>
                        <span className="inline-flex items-center gap-1 text-xs text-gold-300 font-semibold">
                            MyPrayerTower <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>

                    <Link
                        href="/rosary"
                        className="p-6 rounded-3xl bg-[#18120D] border border-gold-500/35 hover:border-gold-400 transition-all space-y-3"
                    >
                        <CircleDot className="w-8 h-8 text-gold-300" />
                        <h2 className="font-display text-xl font-bold">{info.rosaryCta}</h2>
                        <span className="inline-flex items-center gap-1 text-xs text-gold-300 font-semibold">
                            MyPrayerTower <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>

                    <Link
                        href="/readings"
                        className="p-6 rounded-3xl bg-[#18120D] border border-gold-500/35 hover:border-gold-400 transition-all space-y-3"
                    >
                        <BookOpen className="w-8 h-8 text-emerald-300" />
                        <h2 className="font-display text-xl font-bold">{info.readingsCta}</h2>
                        <span className="inline-flex items-center gap-1 text-xs text-gold-300 font-semibold">
                            MyPrayerTower <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>
                </div>

                <div className="rounded-3xl bg-gradient-to-r from-[#1F1711] to-[#18120D] border border-gold-500/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Smartphone className="w-8 h-8 text-gold-300 shrink-0" />
                        <div>
                            <h3 className="font-display text-lg font-bold">{info.appBannerTitle}</h3>
                            <p className="text-xs text-[#CFC5B4]">Rosary • Votive Candles • Angelus &amp; Divine Mercy Alarms</p>
                        </div>
                    </div>
                    <a
                        href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-engagement="Get the Android App"
                        data-category="download"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#E8CA68] to-[#D4AF37] text-[#120E0A] font-extrabold text-xs shrink-0"
                    >
                        {info.appBannerCta}
                    </a>
                </div>
            </div>
        </div>
    );
}
