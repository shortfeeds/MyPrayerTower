import { Controller, Get, Query, Param } from '@nestjs/common';
import { ChurchesService } from './churches.service';
import { ChurchesSortedService } from './churches-sorted.service';

@Controller('churches')
export class ChurchesController {
    constructor(
        private churchesService: ChurchesService,
        private churchesSortedService: ChurchesSortedService
    ) { }

    @Get()
    async findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('denomination') denomination?: string,
        @Query('city') city?: string,
        @Query('country') country?: string,
        @Query('verified') verified?: string,
        @Query('sortBy') sortBy?: 'name' | 'distance' | 'popularity' | 'recent',
        @Query('sortOrder') sortOrder?: 'asc' | 'desc',
        @Query('userLat') userLat?: string,
        @Query('userLng') userLng?: string,
    ) {
        return this.churchesSortedService.findAllSorted({
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
            search,
            denomination,
            city,
            country,
            isVerified: verified === 'true' ? true : verified === 'false' ? false : undefined,
            sortBy,
            sortOrder,
            userLat: userLat ? parseFloat(userLat) : undefined,
            userLng: userLng ? parseFloat(userLng) : undefined,
        });
    }

    @Get('nearby')
    async findNearby(
        @Query('lat') lat: string,
        @Query('lng') lng: string,
        @Query('radius') radius?: string,
        @Query('limit') limit?: string,
    ) {
        return this.churchesService.findNearby(
            parseFloat(lat),
            parseFloat(lng),
            radius ? parseFloat(radius) : 25,
            limit ? parseInt(limit) : 20,
        );
    }

    @Get('denominations')
    async getDenominations() {
        return this.churchesService.getDenominations();
    }

    @Get('countries')
    async getCountries() {
        return this.churchesService.getCountries();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.churchesService.findById(id);
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.churchesService.findBySlug(slug);
    }
}
