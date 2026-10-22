export const revalidate = 86400; // Cache for 24 hours
import { getAllPosts } from '@/lib/content';

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';
    let posts: { slug: string; updatedAt?: string; publishedAt?: string }[] = [];

    try {
        posts = await getAllPosts();
    } catch {
        posts = [];
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts
      .map(
          (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updatedAt || post.publishedAt || new Date()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
      .join('')}
</urlset>
`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
    });
}
