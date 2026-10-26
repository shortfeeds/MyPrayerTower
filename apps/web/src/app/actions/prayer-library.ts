
import { db } from '@/lib/db';

function cleanPreviewText(raw: string, length = 160): string {
    const withoutRubrics = raw
        .replace(/^>.*$/gm, '') // Remove rubric/instruction lines
        .replace(/[#*`_]/g, '') // Remove markdown formatting
        .replace(/\s+/g, ' ')   // Normalize whitespace
        .trim();
    const source = withoutRubrics || raw.replace(/[#*`_>]/g, '').replace(/\s+/g, ' ').trim();
    return source.slice(0, length) + (source.length > length ? '...' : '');
}

export async function getLibraryPrayers(page = 1, limit = 20, search?: string, category?: string) {
    try {
        const skip = (page - 1) * limit;

        const where: any = {
            is_active: true,
        };

        if (search) {
            const trimmed = search.trim();
            const searchWords = trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 1);
            where.OR = [
                { title: { contains: trimmed, mode: 'insensitive' } },
                { content: { contains: trimmed, mode: 'insensitive' } },
                { category: { contains: trimmed, mode: 'insensitive' } },
                { category_label: { contains: trimmed, mode: 'insensitive' } },
                ...(searchWords.length > 0 ? [{ tags: { hasSome: searchWords } }] : []),
            ];
        }

        if (category && category !== 'All') {
            where.category = category;
        }

        const [prayers, total] = await Promise.all([
            db.prayer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { title: 'asc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    content: true, // Needed for preview
                    category: true,
                    category_label: true,
                    tags: true,
                }
            }),
            db.prayer.count({ where })
        ]);

        return {
            prayers: prayers.map(p => ({
                ...p,
                id: p.id.toString(), // Convert BigInt to string
                content: cleanPreviewText(p.content, 150) // Clean preview without raw markdown
            })),
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalItems: total
        };

    } catch (error) {
        console.error('Error fetching library prayers:', error);
        return { prayers: [], totalPages: 0, currentPage: 1, totalItems: 0 };
    }
}

export async function getAllPrayerSlugs() {
    try {
        const prayers = await db.prayer.findMany({
            where: { is_active: true },
            select: { slug: true }
        });
        return prayers
            .filter(p => p.slug) // Remove null slugs
            .map(p => p.slug as string);
    } catch (error) {
        console.error('Error fetching prayer slugs:', error);
        return [];
    }
}

export async function getPrayerCategories() {
    try {
        const categories = await db.prayer.groupBy({
            by: ['category'],
            where: { is_active: true },
            _count: {
                category: true
            },
            orderBy: {
                category: 'asc'
            }
        });

        return categories
            .map(c => ({
                name: c.category,
                count: c._count.category
            }))
            .filter(c => c.name); // Filter out empty categories

    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

export async function getPrayerBySlug(slug: string) {
    try {
        const prayer = await db.prayer.findFirst({
            where: {
                slug: slug,
                is_active: true
            }
        });

        if (!prayer) return null;

        return {
            ...prayer,
            id: prayer.id.toString(),
        };
    } catch (error) {
        console.error('Error fetching prayer by slug:', error);
        return null;
    }
}
