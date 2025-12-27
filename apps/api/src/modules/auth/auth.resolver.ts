import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) { }

    @Mutation(() => String)
    async register(
        @Args('email') email: string,
        @Args('password') password: string,
        @Args('firstName') firstName: string,
        @Args('lastName') lastName: string,
        @Args('language', { nullable: true }) language?: string,
    ) {
        const result = await this.authService.register({
            email,
            password,
            firstName,
            lastName,
            language,
        });
        return result.accessToken;
    }

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
    ) {
        const result = await this.authService.login({ email, password });
        return result.accessToken;
    }

    @Query(() => String)
    @UseGuards(JwtAuthGuard)
    async me(@CurrentUser() user: any) {
        const result = await this.authService.validateUser(user.id);
        return JSON.stringify(result);
    }
}
