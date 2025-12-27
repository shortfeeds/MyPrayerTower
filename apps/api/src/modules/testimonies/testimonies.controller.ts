import { Controller, Get, Post, Body, Param, Req, Query, UseGuards } from '@nestjs/common';
import { TestimoniesService } from './testimonies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('testimonies')
export class TestimoniesController {
    constructor(private testimoniesService: TestimoniesService) { }

    @Get()
    async getTestimonies(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20',
    ) {
        return this.testimoniesService.getTestimonies(parseInt(page), parseInt(limit));
    }

    @Get('featured')
    async getFeatured() {
        return this.testimoniesService.getFeaturedTestimonies();
    }

    @UseGuards(JwtAuthGuard)
    @Get('mine')
    async getMyTestimonies(@Req() req) {
        return this.testimoniesService.getUserTestimonies(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async submitTestimony(
        @Req() req,
        @Body() body: { title: string; content: string; relatedPrayerId?: string; isAnonymous?: boolean },
    ) {
        return this.testimoniesService.submitTestimony(req.user.id, body);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/upvote')
    async upvote(@Req() req, @Param('id') id: string) {
        return this.testimoniesService.upvoteTestimony(id, req.user.id);
    }
}
