import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        type: string;
        email: string;
        name?: string;
        phone?: string;
        data: any;
        step: string;
        source: string;
    }) {
        // Check if cart already exists for this email/type to update instead of create?
        // For now, just create new as revisions
        return this.prisma.abandonedCart.create({
            data: {
                type: data.type,
                email: data.email,
                name: data.name,
                phone: data.phone,
                data: data.data,
                step: data.step,
                source: data.source,
            },
        });
    }
}
