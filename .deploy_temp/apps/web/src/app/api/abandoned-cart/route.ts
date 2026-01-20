import { NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, email, name, phone, data, step } = body;

        console.log('Received abandoned cart data:', { type, email, step });

        if (!email || !type || !data) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if there's an existing cart for this email and type created in the last 24 hours
        // If so, update it. If not, create new.
        const existingCart = await prisma.abandonedCart.findFirst({
            where: {
                email,
                type,
                converted: false,
                createdAt: {
                    gt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (existingCart) {
            const updatedCart = await prisma.abandonedCart.update({
                where: { id: existingCart.id },
                data: {
                    data,
                    step,
                    name: name || existingCart.name, // Keep existing name if not provided
                    phone: phone || existingCart.phone,
                    updatedAt: new Date(),
                }
            });
            return NextResponse.json({ success: true, id: updatedCart.id });
        }

        const newCart = await prisma.abandonedCart.create({
            data: {
                type,
                email,
                name,
                phone,
                data,
                step,
            }
        });

        return NextResponse.json({ success: true, id: newCart.id });

    } catch (error) {
        console.error('Error saving abandoned cart:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
