import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - List all subscribers
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status'); // 'active', 'inactive', or 'all'
        const search = searchParams.get('search');

        const where: Record<string, unknown> = {};

        if (status === 'active') {
            where.isActive = true;
        } else if (status === 'inactive') {
            where.isActive = false;
        }

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [subscribers, total] = await Promise.all([
            prisma.newsletterSubscriber.findMany({
                where,
                orderBy: { subscribedAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.newsletterSubscriber.count({ where })
        ]);

        const stats = await prisma.newsletterSubscriber.groupBy({
            by: ['isActive'],
            _count: true
        });

        const activeCount = stats.find(s => s.isActive)?._count || 0;
        const inactiveCount = stats.find(s => !s.isActive)?._count || 0;

        return NextResponse.json({
            subscribers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            stats: {
                total: activeCount + inactiveCount,
                active: activeCount,
                inactive: inactiveCount
            }
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subscribers' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a subscriber
export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Subscriber ID is required' },
                { status: 400 }
            );
        }

        await prisma.newsletterSubscriber.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Subscriber deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        return NextResponse.json(
            { error: 'Failed to delete subscriber' },
            { status: 500 }
        );
    }
}

// PATCH - Update subscriber status
export async function PATCH(request: NextRequest) {
    try {
        const { id, isActive } = await request.json();

        if (!id) {
            return NextResponse.json(
                { error: 'Subscriber ID is required' },
                { status: 400 }
            );
        }

        const subscriber = await prisma.newsletterSubscriber.update({
            where: { id },
            data: {
                isActive,
                unsubscribedAt: isActive ? null : new Date()
            }
        });

        return NextResponse.json({
            success: true,
            subscriber,
            message: isActive ? 'Subscriber activated' : 'Subscriber deactivated'
        });
    } catch (error) {
        console.error('Error updating subscriber:', error);
        return NextResponse.json(
            { error: 'Failed to update subscriber' },
            { status: 500 }
        );
    }
}
