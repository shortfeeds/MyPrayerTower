import { Controller, Get, Param } from '@nestjs/common';
import { PilgrimagesService } from './pilgrimages.service';

@Controller('pilgrimages')
export class PilgrimagesController {
    constructor(private readonly pilgrimagesService: PilgrimagesService) { }

    @Get()
    findAll() {
        return this.pilgrimagesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.pilgrimagesService.findOne(id);
    }
}
