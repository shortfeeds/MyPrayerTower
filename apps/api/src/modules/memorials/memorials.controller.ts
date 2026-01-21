import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MemorialsService } from './memorials.service';

@Controller('memorials')
export class MemorialsController {
    constructor(private readonly memorialsService: MemorialsService) { }

    @Get()
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
        @Query('search') search?: string,
    ) {
        return this.memorialsService.findAll(Number(page), Number(limit), search);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.memorialsService.findOne(id);
    }

    @Post()
    async create(@Body() createMemorialDto: any) {
        return this.memorialsService.create(createMemorialDto);
    }
}
