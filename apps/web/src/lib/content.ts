import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Guide, GuideMeta } from '@/types/content';
import { autolink } from '@/lib/linker';

const guidesDirectory = path.join(process.cwd(), 'content/guides');

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
    try {
        const realSlug = slug.replace(/\.mdx$/, '');
        const fullPath = path.join(guidesDirectory, `${realSlug}.mdx`);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug: realSlug,
            title: data.title,
            description: data.description,
            publishedAt: data.publishedAt,
            updatedAt: data.updatedAt,
            author: data.author,
            image: data.image,
            category: data.category,
            tags: data.tags,
            readingTime: data.readingTime,
            relatedGuides: data.relatedGuides,
            content: autolink(content),
        } as Guide;
    } catch (e) {
        return null; // Handle file not found or other errors gracefully
    }
}

export async function getAllGuides(): Promise<GuideMeta[]> {
    try {
        const files = await fs.readdir(guidesDirectory);

        const guides = await Promise.all(
            files.filter(file => file.endsWith('.mdx')).map(async (file) => {
                const slug = file.replace(/\.mdx$/, '');
                const guide = await getGuideBySlug(slug);
                // Return only metadata, stripped of large content body if needed, 
                // though getGuideBySlug returns full object. We cast to Meta.
                if (guide) {
                    const { content, ...meta } = guide;
                    return meta;
                }
                return null;
            })
        );

        return guides
            .filter((guide): guide is GuideMeta => guide !== null)
            .sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
    } catch (e) {
        // If directory doesn't exist yet, return empty
        return [];
    }
}

export async function getGuidesByCategory(category: string): Promise<GuideMeta[]> {
    const allGuides = await getAllGuides();
    return allGuides.filter(guide => guide.category === category);
}

export async function getRecentGuides(count: number = 3): Promise<GuideMeta[]> {
    const allGuides = await getAllGuides();
    return allGuides.slice(0, count);
}
