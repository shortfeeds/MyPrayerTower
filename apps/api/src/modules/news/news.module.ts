import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { RssFeedService } from './rss-feed.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [NewsController],
    providers: [RssFeedService],
    exports: [RssFeedService],
})
export class NewsModule { }
