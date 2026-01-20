import { Module } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { ChurchesSortedService } from './churches-sorted.service';
import { ChurchesController } from './churches.controller';
import { ChurchesResolver } from './churches.resolver';

@Module({
    providers: [ChurchesService, ChurchesSortedService, ChurchesResolver],
    controllers: [ChurchesController],
    exports: [ChurchesService, ChurchesSortedService],
})
export class ChurchesModule { }
