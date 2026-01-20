import { Module } from '@nestjs/common';
import { ModerationController } from './moderation.controller';
import { ContentModerationService } from './content-moderation.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ModerationController],
    providers: [ContentModerationService],
    exports: [ContentModerationService],
})
export class ModerationModule { }
