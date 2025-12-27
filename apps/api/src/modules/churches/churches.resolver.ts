import { Resolver, Query, Args, Int, Float } from '@nestjs/graphql';
import { ChurchesService } from './churches.service';

@Resolver('Church')
export class ChurchesResolver {
    constructor(private churchesService: ChurchesService) { }

    @Query(() => String)
    async churches(
        @Args('page', { type: () => Int, nullable: true }) page?: number,
        @Args('limit', { type: () => Int, nullable: true }) limit?: number,
        @Args('search', { nullable: true }) search?: string,
        @Args('denomination', { nullable: true }) denomination?: string,
        @Args('city', { nullable: true }) city?: string,
        @Args('country', { nullable: true }) country?: string,
    ) {
        const result = await this.churchesService.findAll({
            page,
            limit,
            search,
            denomination,
            city,
            country,
        });
        return JSON.stringify(result);
    }

    @Query(() => String)
    async church(@Args('id') id: string) {
        const result = await this.churchesService.findById(id);
        return JSON.stringify(result);
    }

    @Query(() => String)
    async nearbyChurches(
        @Args('latitude', { type: () => Float }) latitude: number,
        @Args('longitude', { type: () => Float }) longitude: number,
        @Args('radiusKm', { type: () => Float, nullable: true }) radiusKm?: number,
    ) {
        const result = await this.churchesService.findNearby(latitude, longitude, radiusKm);
        return JSON.stringify(result);
    }

    @Query(() => String)
    async denominations() {
        const result = await this.churchesService.getDenominations();
        return JSON.stringify(result);
    }
}
