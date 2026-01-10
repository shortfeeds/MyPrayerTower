import { PrismaClient } from '@mpt/database';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MemorialProfile } from '@/components/memorials/MemorialProfile';

const prisma = new PrismaClient();

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const memorial = await prisma.memorial.findUnique({
        where: { slug: params.slug },
    });

    if (!memorial) {
        return {
            title: 'Memorial Not Found',
        };
    }

    const fullName = `${memorial.firstName} ${memorial.lastName}`;
    const title = `In Loving Memory of ${fullName}`;
    const description = memorial.shortBio || `Visit the online memorial for ${fullName}. Share memories, light a candle, and offer prayers in their honor.`;

    return {
        title: `${title} | MyPrayerTower`,
        description,
        openGraph: {
            title,
            description,
            images: memorial.photoUrl ? [memorial.photoUrl] : [],
        },
    };
}

export default async function MemorialDetailPage({ params }: Props) {
    const memorial = await prisma.memorial.findUnique({
        where: { slug: params.slug },
        include: {
            photos: true,
            offerings: {
                orderBy: { createdAt: 'desc' },
                take: 50,
                include: {
                    user: {
                        select: { displayName: true, avatarUrl: true }
                    }
                }
            },
            guestbook: {
                orderBy: { createdAt: 'desc' },
                take: 50,
                include: {
                    user: {
                        select: { displayName: true, avatarUrl: true }
                    }
                }
            }
        },
    });

    if (!memorial) {
        notFound();
    }

    // Serialize Dates to strings for the Client Component
    const serializedMemorial = {
        ...memorial,
        birthDate: memorial.birthDate ? memorial.birthDate.toISOString() : null,
        deathDate: memorial.deathDate ? memorial.deathDate.toISOString() : null,
        offerings: memorial.offerings.map(o => ({
            ...o,
            createdAt: o.createdAt.toISOString()
        })),
        guestbook: memorial.guestbook.map(g => ({
            ...g,
            createdAt: g.createdAt.toISOString()
        }))
    };

    return (
        <MemorialProfile initialMemorial={serializedMemorial as any} />
    );
}
