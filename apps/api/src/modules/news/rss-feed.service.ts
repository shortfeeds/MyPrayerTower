import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import * as Parser from 'rss-parser';

interface RSSFeed {
    name: string;
    url: string;
    category: string;
}

@Injectable()
export class RssFeedService {
    private readonly logger = new Logger(RssFeedService.name);
    private readonly parser = new Parser();

    // List of Catholic news RSS feeds
    private readonly feeds: RSSFeed[] = [
        { name: 'Catholic News Agency', url: 'https://www.catholicnewsagency.com/feed', category: 'World News' },
        { name: 'Vatican News', url: 'https://www.vaticannews.va/en.rss.xml', category: 'Vatican' },
        { name: 'EWTN News', url: 'https://feeds.feedburner.com/EwtnNews', category: 'US News' },
        { name: 'Catholic Herald', url: 'https://thecatholicherald.com/feed/', category: 'UK/Global' },
        { name: 'Aleteia', url: 'https://aleteia.org/feed/', category: 'Lifestyle' },
        { name: 'NCR Online', url: 'https://www.ncronline.org/rss.xml', category: 'Opinion' },
    ];

    constructor(private prisma: PrismaService) { }

    // Run every 30 minutes
    @Cron(CronExpression.EVERY_30_MINUTES)
    async syncAllFeeds() {
        this.logger.log('Starting RSS feed sync...');

        for (const feed of this.feeds) {
            try {
                await this.syncFeed(feed);
            } catch (error) {
                this.logger.error(`Failed to sync feed ${feed.name}:`, error);
            }
        }

        // Cleanup old articles (keep last 7 days)
        await this.cleanupOldArticles();

        this.logger.log('RSS feed sync complete');
    }

    async syncFeed(feed: RSSFeed) {
        const parsedFeed = await this.parser.parseURL(feed.url);

        let imported = 0;
        for (const item of parsedFeed.items.slice(0, 20)) { // Max 20 per feed
            const externalId = item.guid || item.link || '';

            // Check if already exists
            const exists = await this.prisma.newsArticle.findUnique({
                where: { externalId }
            });

            if (exists) continue;

            // Extract image from content or media
            let imageUrl = null;
            if (item.enclosure?.url) {
                imageUrl = item.enclosure.url;
            } else if (item['media:content']?.['$']?.url) {
                imageUrl = item['media:content']['$'].url;
            }

            // Create article
            await this.prisma.newsArticle.create({
                data: {
                    externalId,
                    source: feed.name,
                    title: item.title || 'Untitled',
                    summary: item.contentSnippet || item.description || null,
                    content: item.content || null,
                    imageUrl,
                    linkUrl: item.link || '',
                    author: item.creator || item.author || null,
                    category: feed.category,
                    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                }
            });

            imported++;
        }

        if (imported > 0) {
            this.logger.log(`Imported ${imported} articles from ${feed.name}`);
        }
    }

    async cleanupOldArticles() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = await this.prisma.newsArticle.deleteMany({
            where: { publishedAt: { lt: sevenDaysAgo } }
        });

        if (result.count > 0) {
            this.logger.log(`Cleaned up ${result.count} old articles`);
        }
    }

    async getArticles(options: {
        source?: string;
        category?: string;
        limit?: number;
        offset?: number;
    }) {
        const { source, category, limit = 20, offset = 0 } = options;

        const where: any = {};
        if (source) where.source = source;
        if (category) where.category = category;

        const [articles, total] = await Promise.all([
            this.prisma.newsArticle.findMany({
                where,
                orderBy: { publishedAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.newsArticle.count({ where })
        ]);

        return { articles, total, limit, offset };
    }

    async getSources() {
        return this.feeds.map(f => ({ name: f.name, category: f.category }));
    }
}
