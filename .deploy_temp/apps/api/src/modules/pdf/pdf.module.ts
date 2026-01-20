import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../../prisma/prisma.module';
import { PdfService } from './pdf.service';

@Module({
    imports: [ConfigModule, PrismaModule],
    providers: [PdfService],
    exports: [PdfService],
})
export class PdfModule { }
