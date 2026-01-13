import { Book, Info, Scroll } from 'lucide-react';

interface PrayerContextBoxProps {
    title: string;
    category: string;
}

// Static dictionary for popular prayers
const PRAYER_CONTEXTS: Record<string, { source?: string; history?: string; latinTitle?: string }> = {
    'Our Father': {
        source: 'Matthew 6:9-13',
        history: 'The Lord\'s Prayer is the prayer Jesus taught his disciples when they asked him how to pray.',
        latinTitle: 'Pater Noster'
    },
    'Hail Mary': {
        source: 'Luke 1:28, 42',
        history: 'Combines the Archangel Gabriel\'s greeting to Mary with Elizabeth\'s greeting at the Visitation.',
        latinTitle: 'Ave Maria'
    },
    'Glory Be': {
        history: 'A doxology praising the Holy Trinity, used in the Rosary and Liturgy of the Hours.',
        latinTitle: 'Gloria Patri'
    },
    'The Apostles\' Creed': {
        history: 'An early statement of Christian belief, traditionally attributed to the Twelve Apostles.',
        latinTitle: 'Symbolum Apostolorum'
    },
    'Hail, Holy Queen': {
        history: 'A traditional Marian antiphon often sung at the end of Compline and the Rosary.',
        latinTitle: 'Salve Regina'
    },
    'Memorare': {
        history: 'A 12th-century prayer seeking the intercession of the Blessed Virgin Mary, popularized by Fr. Claude Bernard.',
        latinTitle: 'Memorare'
    },
    'St. Michael the Archangel': {
        history: 'Composed by Pope Leo XIII in 1886 to ask for protection against evil.',
        latinTitle: 'Sancte Michael Archangele'
    },
    'Act of Contrition': {
        source: 'Traditional Catholic Penance',
        history: 'A prayer expressing sorrow for sins, typically cited during the Sacrament of Reconciliation.'
    },
    'Angelus': {
        history: 'A traditional devotion commemorating the Incarnation, prayed at 6am, noon, and 6pm.',
        latinTitle: 'Angelus Domini'
    }
};

const CATEGORY_GUIDANCE: Record<string, string> = {
    'Marian': 'Marian prayers ask for the intercession of the Blessed Mother, who leads us closer to her Son, Jesus.',
    'Healing': 'Prayers for healing invite God\'s restorative power into our physical, emotional, and spiritual wounds.',
    'Saints': 'We ask the Saints to pray with us and for us, as they stand before the throne of God.',
    'Novena': 'A nine-day period of prayerful perseverance, modeled after the Apostles waiting for the Holy Spirit.',
    'Litanies': 'A form of responsive prayer used in public services or private devotions.',
};

export function PrayerContextBox({ title, category }: PrayerContextBoxProps) {
    // Fuzzy match title or exact match
    const contextKey = Object.keys(PRAYER_CONTEXTS).find(key => title.includes(key));
    const specificContext = contextKey ? PRAYER_CONTEXTS[contextKey] : null;
    const categoryContext = CATEGORY_GUIDANCE[category];

    if (!specificContext && !categoryContext) return null;

    return (
        <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-6 mb-8">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-900 mb-3">
                <Book className="w-4 h-4" />
                Spiritual Context
            </h3>

            <div className="space-y-4 text-amber-900/80 leading-relaxed text-sm">
                {specificContext && (
                    <>
                        {specificContext.latinTitle && (
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-amber-900">Latin:</span>
                                <span className="italic font-serif">{specificContext.latinTitle}</span>
                            </div>
                        )}
                        {specificContext.source && (
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-amber-900">Source:</span>
                                <span>{specificContext.source}</span>
                            </div>
                        )}
                        {specificContext.history && (
                            <div>
                                <span className="font-semibold text-amber-900 block mb-1">History & Meaning:</span>
                                <span>{specificContext.history}</span>
                            </div>
                        )}
                    </>
                )}

                {categoryContext && !specificContext && (
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 flex-shrink-0 text-amber-600" />
                        <p>{categoryContext}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
