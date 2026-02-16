import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Guide, GuideMeta, BlogPost, BlogPostMeta } from '@/types/content';
import { autolink } from '@/lib/linker';

const guidesDirectory = path.join(process.cwd(), 'content/guides');
const blogDirectory = path.join(process.cwd(), 'content/blog');

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

// --- Blog Post Logic ---

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const realSlug = slug.replace(/\.mdx$/, '');
        const fullPath = path.join(blogDirectory, `${realSlug}.mdx`);
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
            relatedPosts: data.relatedPosts,
            featured: data.featured,
            content: autolink(content),
        } as BlogPost;
    } catch (e) {
        return null;
    }
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
    try {
        const files = await fs.readdir(blogDirectory);

        const posts = await Promise.all(
            files.filter(file => file.endsWith('.mdx')).map(async (file) => {
                const slug = file.replace(/\.mdx$/, '');
                const post = await getPostBySlug(slug);
                if (post) {
                    const { content, ...meta } = post;
                    return meta;
                }
                return null;
            })
        );

        return posts
            .filter((post): post is BlogPostMeta => post !== null)
            .sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
    } catch (e) {
        return [];
    }
}

export async function getPostsByCategory(category: string): Promise<BlogPostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts.filter(post => post.category === category);
}

export async function getRecentPosts(count: number = 3): Promise<BlogPostMeta[]> {
    const allPosts = await getAllPosts();
    return allPosts.slice(0, count);
}
