import { Guide } from "@/types/content";

/**
 * Central registry of keywords to their target URLs.
 * Add high-value SEO terms here.
 */
const KEYWORD_REGISTRY: Record<string, string> = {
    // Hubs
    'Rosary': '/rosary',
    'Holy Rosary': '/rosary',
    'Novena': '/novenas',
    'Novenas': '/novenas',
    'Saint': '/saints',
    'Saints': '/saints',
    'Confession': '/guides/how-to-go-to-confession',
    'Reconciliation': '/guides/how-to-go-to-confession',
    'Mass': '/guides/how-to-attend-latin-mass', // Temporary until "Understanding the Mass" is live
    'Latin Mass': '/guides/how-to-attend-latin-mass',
    'Angelus': '/guides/how-to-pray-the-angelus',
    'Liturgical Year': '/catholic-life/living-the-liturgical-year',
    'Fasting': '/catholic-life/catholic-fasting-rules',

    // Phase 4 Content
    'Seven Sorrows': '/guides/seven-sorrows-of-mary',
    'Sorrows of Mary': '/guides/seven-sorrows-of-mary',
    'Divine Mercy': '/guides/divine-mercy-chaplet-guide',
    'Chaplet of Divine Mercy': '/guides/divine-mercy-chaplet-guide',
    'Examination of Conscience': '/guides/examination-of-conscience',
    'Adoration': '/guides/complete-guide-to-adoration',
    'Holy Hour': '/guides/complete-guide-to-adoration',
    'Patron Saint': '/guides/who-is-my-patron-saint',
    'Brown Scapular': '/guides/brown-scapular-promise',
    'Scapular': '/guides/brown-scapular-promise',
    'Miraculous Medal': '/guides/miraculous-medal-meaning',
    'First Saturdays': '/guides/first-five-saturdays',
    'Five Saturdays': '/guides/first-five-saturdays',
    'Understanding the Mass': '/guides/understanding-the-mass',
    'Advent': '/guides/advent-vs-lent',
    'Lent': '/guides/advent-vs-lent',

    'KV': '/churches', // Keep vague
    'Catholic Church': '/churches',
};

/**
 * Auto-links keywords in the provided text content.
 * Intelligently avoids replacing text inside existing Markdown links [text](url)
 * or code blocks `text`.
 */
export function autolink(content: string): string {
    // We only want to link the FIRST occurrence of each keyword to avoid spamming links.
    // However, for simplicity in this MVP, we'll replace all, but a better approach 
    // is often 1 link per term per page.

    // Let's stick to "First occurrence only" per keyword to be SEO friendly.
    const usedKeywords = new Set<string>();

    // Sort keywords by length (longest first) to prevent partial matching issues
    // e.g. "Holy Rosary" vs "Rosary"
    const keywords = Object.keys(KEYWORD_REGISTRY).sort((a, b) => b.length - a.length);

    // We need to split the content by things we MUST NOT touch:
    // 1. Markdown links: [text](url)
    // 2. Code blocks: `code` or ```code```
    // 3. HTML attributes: href="..." (less likely in MDX but possible)

    // Regex to split by markdown links or code
    // Capturing group () ensures separators are kept in the result array
    const splitRegex = /(\[.*?\]\(.*?\)|`[^`]+`|```[\s\S]*?```)/g;

    const parts = content.split(splitRegex);

    return parts.map(part => {
        // If part matches the split regex, return it unchanged
        if (part.match(splitRegex)) {
            return part;
        }

        // Otherwise, process text
        let text = part;

        for (const keyword of keywords) {
            if (usedKeywords.has(keyword)) continue;

            const url = KEYWORD_REGISTRY[keyword];
            // Regex to find keyword as a whole word (boundary \b)
            // Case insensitive? Maybe. Let's keep it exact match for control, or case-insensitive with 'i'
            // We'll use case-insensitive matching but preserve original case in text.
            const regex = new RegExp(`\\b(${escapeRegExp(keyword)})\\b`, 'i');

            if (regex.test(text)) {
                // Replace ONLY the first occurrence in this text chunk
                text = text.replace(regex, (match) => {
                    usedKeywords.add(keyword); // Mark as used
                    return `[${match}](${url})`;
                });
            }
        }
        return text;
    }).join('');
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
