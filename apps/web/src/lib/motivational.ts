/**
 * Motivational Quotes Service
 * Provides daily Catholic inspirational quotes from saints, scripture, and Church teachings
 */

import { db } from './db';

export interface Quote {
    content: string;
    author: string;
    source: string;
    category: string;
    reference?: string;
}

// Curated collection of Catholic quotes for fallback
const CATHOLIC_QUOTES: Quote[] = [
    {
        content: "Pray, hope, and don't worry. Worry is useless. God is merciful and will hear your prayer.",
        author: "St. Padre Pio",
        source: "saint",
        category: "trust",
    },
    {
        content: "The Eucharist is the heart of the world, through which all graces flow.",
        author: "St. Peter Julian Eymard",
        source: "saint",
        category: "eucharist",
    },
    {
        content: "Do not be afraid. Do not be satisfied with mediocrity. Put out into the deep and let down your nets for a catch.",
        author: "St. John Paul II",
        source: "pope",
        category: "courage",
    },
    {
        content: "The one who falls and gets up is stronger than the one who never tried. Do not fear failure but rather fear not trying.",
        author: "St. Josemaria Escriva",
        source: "saint",
        category: "perseverance",
    },
    {
        content: "Joy is the echo of God's life within us.",
        author: "Dom Marmion",
        source: "saint",
        category: "joy",
    },
    {
        content: "God does not ask for the impossible, but wants everyone to fulfill their duties according to their strength.",
        author: "St. Bernard of Clairvaux",
        source: "saint",
        category: "trust",
    },
    {
        content: "You have made us for yourself, O Lord, and our hearts are restless until they rest in you.",
        author: "St. Augustine",
        source: "saint",
        category: "faith",
        reference: "Confessions 1.1",
    },
    {
        content: "In all created things discern the providence and wisdom of God, and in all things give Him thanks.",
        author: "St. Teresa of Avila",
        source: "saint",
        category: "gratitude",
    },
    {
        content: "Love is the only force capable of transforming an enemy into a friend.",
        author: "St. Martin Luther King Jr.",
        source: "saint",
        category: "love",
    },
    {
        content: "If you are humble nothing will touch you, neither praise nor disgrace, because you know what you are.",
        author: "St. Mother Teresa",
        source: "saint",
        category: "humility",
    },
    {
        content: "The greatest glory we can give to God is to do His will in everything.",
        author: "St. Alphonsus Liguori",
        source: "saint",
        category: "faith",
    },
    {
        content: "Have patience with all things, but chiefly have patience with yourself.",
        author: "St. Francis de Sales",
        source: "saint",
        category: "patience",
    },
    {
        content: "Faith is to believe what you do not see; the reward of this faith is to see what you believe.",
        author: "St. Augustine",
        source: "saint",
        category: "faith",
    },
    {
        content: "The proof of love is in the works. Where love exists, it works great things. But when it ceases to act, it ceases to exist.",
        author: "Pope St. Gregory the Great",
        source: "pope",
        category: "love",
    },
    {
        content: "To live well is nothing other than to love God with all one's heart, with all one's soul and with all one's efforts.",
        author: "St. Augustine",
        source: "saint",
        category: "love",
    },
    {
        content: "Do not be discouraged! Be saints! Young people carry the fire of Christ in your hearts.",
        author: "Pope Benedict XVI",
        source: "pope",
        category: "courage",
    },
    {
        content: "The way Jesus shows you is not easy. Rather, it is like a path winding up a mountain. Do not lose heart!",
        author: "Pope Francis",
        source: "pope",
        category: "perseverance",
    },
    {
        content: "Without the burden of afflictions it is impossible to reach the height of grace.",
        author: "St. Rose of Lima",
        source: "saint",
        category: "suffering",
    },
    {
        content: "When we pray, the voice of the heart must be heard more than proceedings from the mouth.",
        author: "St. Bonaventure",
        source: "saint",
        category: "prayer",
    },
    {
        content: "Let nothing disturb you, nothing frighten you. All things pass. God never changes. Patience obtains all things.",
        author: "St. Teresa of Avila",
        source: "saint",
        category: "trust",
    },
    {
        content: "God loves each of us as if there were only one of us.",
        author: "St. Augustine",
        source: "saint",
        category: "love",
    },
    {
        content: "Prayer is the inner bath of love into which the soul plunges itself.",
        author: "St. John Vianney",
        source: "saint",
        category: "prayer",
    },
    {
        content: "We must pray without tiring, for the salvation of mankind does not depend on material success; but on Jesus alone.",
        author: "St. Frances Xavier Cabrini",
        source: "saint",
        category: "prayer",
    },
    {
        content: "It is not the greatness of our actions, but the love with which we do them that makes them perfect.",
        author: "St. Therese of Lisieux",
        source: "saint",
        category: "love",
    },
    {
        content: "Trust the past to God's mercy, the present to God's love, and the future to God's providence.",
        author: "St. Augustine",
        source: "saint",
        category: "trust",
    },
    {
        content: "Start by doing what is necessary, then what is possible, and suddenly you are doing the impossible.",
        author: "St. Francis of Assisi",
        source: "saint",
        category: "courage",
    },
    {
        content: "Lord, make me an instrument of your peace. Where there is hatred, let me sow love.",
        author: "St. Francis of Assisi",
        source: "saint",
        category: "peace",
        reference: "Peace Prayer",
    },
    {
        content: "Spread love everywhere you go. Let no one ever come to you without leaving happier.",
        author: "St. Mother Teresa",
        source: "saint",
        category: "love",
    },
    {
        content: "Never worry about numbers. Help one person at a time and always start with the person nearest you.",
        author: "St. Mother Teresa",
        source: "saint",
        category: "charity",
    },
    {
        content: "A clean heart is a free heart. A free heart can love Christ with an undivided love in chastity.",
        author: "St. Mother Teresa",
        source: "saint",
        category: "purity",
    },
    {
        content: "We are not the sum of our weaknesses and failures; we are the sum of the Father's love for us.",
        author: "St. John Paul II",
        source: "pope",
        category: "love",
    },
];

// Scripture quotes for additional variety
const SCRIPTURE_QUOTES: Quote[] = [
    {
        content: "I can do all things through Christ who strengthens me.",
        author: "St. Paul",
        source: "bible",
        category: "strength",
        reference: "Philippians 4:13",
    },
    {
        content: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
        author: "Prophet Jeremiah",
        source: "bible",
        category: "hope",
        reference: "Jeremiah 29:11",
    },
    {
        content: "Be still and know that I am God.",
        author: "Psalms",
        source: "bible",
        category: "peace",
        reference: "Psalm 46:10",
    },
    {
        content: "Cast all your anxiety on him because he cares for you.",
        author: "St. Peter",
        source: "bible",
        category: "trust",
        reference: "1 Peter 5:7",
    },
    {
        content: "The Lord is my shepherd; I shall not want.",
        author: "King David",
        source: "bible",
        category: "trust",
        reference: "Psalm 23:1",
    },
    {
        content: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.",
        author: "St. Paul",
        source: "bible",
        category: "love",
        reference: "1 Corinthians 13:4",
    },
    {
        content: "Faith is the substance of things hoped for, the evidence of things not seen.",
        author: "St. Paul",
        source: "bible",
        category: "faith",
        reference: "Hebrews 11:1",
    },
    {
        content: "Come to me, all you who are weary and burdened, and I will give you rest.",
        author: "Jesus Christ",
        source: "bible",
        category: "peace",
        reference: "Matthew 11:28",
    },
];

/**
 * Get the quote of the day
 * Uses a deterministic selection based on date to ensure consistency
 */
export async function getDailyQuote(date: Date = new Date()): Promise<Quote> {
    const dateStr = formatDateString(date);

    // Try to get from database first
    try {
        const dbQuote = await db.dailyQuote.findUnique({
            where: { date: new Date(dateStr) },
        });

        if (dbQuote) {
            return {
                content: dbQuote.content,
                author: dbQuote.author || 'Unknown',
                source: dbQuote.source || 'saint',
                category: dbQuote.category || 'faith',
                reference: dbQuote.reference || undefined,
            };
        }
    } catch (error) {
        // Database might not be available, use fallback
        console.warn('Database not available for quotes, using fallback');
    }

    // Fallback: Select quote deterministically based on date
    return getQuoteForDate(date);
}

/**
 * Get a random quote from the collection
 */
export function getRandomQuote(): Quote {
    const allQuotes = [...CATHOLIC_QUOTES, ...SCRIPTURE_QUOTES];
    return allQuotes[Math.floor(Math.random() * allQuotes.length)];
}

/**
 * Get quote deterministically based on date
 */
function getQuoteForDate(date: Date): Quote {
    const allQuotes = [...CATHOLIC_QUOTES, ...SCRIPTURE_QUOTES];
    const dayOfYear = getDayOfYear(date);
    const index = dayOfYear % allQuotes.length;
    return allQuotes[index];
}

/**
 * Get quotes by category
 */
export function getQuotesByCategory(category: string): Quote[] {
    const allQuotes = [...CATHOLIC_QUOTES, ...SCRIPTURE_QUOTES];
    return allQuotes.filter(q => q.category === category);
}

/**
 * Get quotes by source type
 */
export function getQuotesBySource(source: 'saint' | 'bible' | 'pope'): Quote[] {
    const allQuotes = [...CATHOLIC_QUOTES, ...SCRIPTURE_QUOTES];
    return allQuotes.filter(q => q.source === source);
}

/**
 * Save a new quote to the database
 */
export async function saveQuote(date: Date, quote: Quote): Promise<void> {
    await db.dailyQuote.upsert({
        where: { date },
        update: {
            content: quote.content,
            author: quote.author,
            source: quote.source,
            category: quote.category,
            reference: quote.reference,
        },
        create: {
            id: `quote-${formatDateString(date)}`,
            date,
            content: quote.content,
            author: quote.author,
            source: quote.source,
            category: quote.category,
            reference: quote.reference,
        },
    });
}

// Helper functions
function formatDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Export all quotes for seeding
export { CATHOLIC_QUOTES, SCRIPTURE_QUOTES };
