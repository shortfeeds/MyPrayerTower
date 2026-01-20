import { Module } from '@nestjs/common';
import { PilgrimagesService } from './pilgrimages.service';
import { PilgrimagesController } from './pilgrimages.controller';

@Module({
    controllers: [PilgrimagesController],
    providers: [PilgrimagesService],
})
export class PilgrimagesModule { }
