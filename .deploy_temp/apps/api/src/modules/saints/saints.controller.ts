import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SaintsService } from './saints.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('saints')
export class SaintsController {
    constructor(private saintsService: SaintsService) { }

    @Get('today')
    async getTodaysSaint() {
        return this.saintsService.getTodaysSaint();
    }

    @Get('month/:month')
    async getSaintsByMonth(@Param('month') month: string) {
        return this.saintsService.getSaintsByMonth(parseInt(month));
    }

    @Get('search')
    async searchSaints(@Query('q') q: string) {
        return this.saintsService.searchSaints(q);
    }

    @Get(':slug')
    async getSaint(@Param('slug') slug: string) {
        return this.saintsService.getSaintBySlug(slug);
    }

    // Admin Endpoints
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() data: any) {
        return this.saintsService.create(data);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() data: any) {
        return this.saintsService.update(id, data);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string) {
        return this.saintsService.delete(id);
    }
}
