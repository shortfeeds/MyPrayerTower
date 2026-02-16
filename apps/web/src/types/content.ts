export interface Guide {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    author?: {
        name: string;
        url?: string;
        image?: string;
    };
    image?: string;
    category: 'prayer' | 'rosary' | 'novena' | 'saints' | 'catholic-life' | 'how-to';
    tags?: string[];
    readingTime?: string;
    relatedGuides?: string[]; // Slugs of related guides
    content: string; // The raw MDX content
}

export type GuideMeta = Omit<Guide, 'content'>;

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    updatedAt?: string;
    author?: {
        name: string;
        url?: string;
        image?: string;
    };
    image?: string;
    category: string; // More flexible for blog
    tags?: string[];
    readingTime?: string;
    relatedPosts?: string[]; // Slugs of related posts
    featured?: boolean;
    content: string; // The raw MDX content
}

export type BlogPostMeta = Omit<BlogPost, 'content'>;
