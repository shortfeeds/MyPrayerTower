import { Controller, Get, Query, Post } from '@nestjs/common';
import { RssFeedService } from './rss-feed.service';

@Controller('news')
export class NewsController {
    constructor(private readonly rssService: RssFeedService) { }

    @Get()
    async getArticles(
        @Query('source') source?: string,
        @Query('category') category?: string,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ) {
        return this.rssService.getArticles({
            source,
            category,
            limit: limit ? parseInt(limit) : 20,
            offset: offset ? parseInt(offset) : 0,
        });
    }

    @Get('sources')
    async getSources() {
        return this.rssService.getSources();
    }

    @Post('sync')
    async triggerSync() {
        await this.rssService.syncAllFeeds();
        return { success: true, message: 'RSS sync triggered' };
    }
}
