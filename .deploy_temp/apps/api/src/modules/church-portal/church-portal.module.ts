import { Module } from '@nestjs/common';
import { ChurchPortalController } from './church-portal.controller';
import { ChurchPortalService } from './church-portal.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [ChurchPortalController],
    providers: [ChurchPortalService],
    exports: [ChurchPortalService],
})
export class ChurchPortalModule { }
