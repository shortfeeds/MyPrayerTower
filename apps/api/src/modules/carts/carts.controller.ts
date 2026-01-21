import { Controller, Post, Body } from '@nestjs/common';
import { CartsService } from './carts.service';

@Controller('carts')
export class CartsController {
    constructor(private readonly cartsService: CartsService) { }

    @Post('abandoned')
    async create(@Body() body: any) {
        return this.cartsService.create(body);
    }
}
