import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PilgrimagesService } from './pilgrimages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() data: any) {
        return this.pilgrimagesService.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() data: any) {
        return this.pilgrimagesService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.pilgrimagesService.remove(id);
    }
}
