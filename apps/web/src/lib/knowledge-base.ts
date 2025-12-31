
import { db } from '@/lib/db';
import { Prisma } from '@mpt/database';

export type SearchResult = {
    id: string;
    source: 'CCC' | 'Canon' | 'GIRM';
    number: number;
    text: string;
    sectionNumber?: number | null;
};

/**
 * CATECHISM FUNCTIONS
 */

export async function getCatechismParagraph(number: number) {
    return db.catechismParagraph.findUnique({
        where: { number },
        include: { section: true }
    });
}

export async function searchCatechism(query: string) {
    return db.catechismParagraph.findMany({
        where: {
            content: { contains: query, mode: 'insensitive' }
        },
        take: 20,
        orderBy: { number: 'asc' }
    });
}

/**
 * CANON LAW FUNCTIONS
 */

export async function getCanonLaw(number: number) {
    return db.canonLaw.findUnique({
        where: { number },
        include: { sections: true }
    });
}

export async function searchCanonLaw(query: string) {
    return db.canonLaw.findMany({
        where: {
            OR: [
                { text: { contains: query, mode: 'insensitive' } },
                { sections: { some: { text: { contains: query, mode: 'insensitive' } } } }
            ]
        },
        include: { sections: true },
        take: 20,
        orderBy: { number: 'asc' }
    });
}

/**
 * GIRM FUNCTIONS
 */

export async function getGIRMItem(number: number) {
    return db.gIRMItem.findUnique({
        where: { number }
    });
}

export async function searchGIRM(query: string) {
    return db.gIRMItem.findMany({
        where: {
            text: { contains: query, mode: 'insensitive' }
        },
        take: 20,
        orderBy: { number: 'asc' }
    });
}

/**
 * UNIFIED SEARCH
 */
export async function searchKnowledgeBase(query: string): Promise<SearchResult[]> {
    const [ccc, canon, girm] = await Promise.all([
        searchCatechism(query),
        searchCanonLaw(query),
        searchGIRM(query)
    ]);

    const results: SearchResult[] = [];

    ccc.forEach(item => {
        results.push({
            id: item.id,
            source: 'CCC',
            number: item.number,
            text: item.content
        });
    });

    canon.forEach(item => {
        // If matches in main text
        if (item.text && item.text.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                id: item.id,
                source: 'Canon',
                number: item.number,
                text: item.text
            });
        }
        // If matches in sections
        item.sections.forEach(s => {
            if (s.text.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    id: s.id,
                    source: 'Canon',
                    number: item.number,
                    sectionNumber: s.sectionNumber,
                    text: s.text
                });
            }
        });
    });

    girm.forEach(item => {
        results.push({
            id: item.id,
            source: 'GIRM',
            number: item.number,
            text: item.text
        });
    });

    return results;
}
