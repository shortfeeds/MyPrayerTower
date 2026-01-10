import { PrismaClient } from '@mpt/database';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChurchProfile } from '@/components/churches/ChurchProfile';
import { generateChurchSchema } from '@/lib/seo/structuredData';

const prisma = new PrismaClient();

interface Props {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const church = await prisma.church.findUnique({
        where: { slug: params.slug },
    });

    if (!church) {
        return {
            title: 'Church Not Found',
        };
    }

    const title = `${church.name} - ${church.city}, ${church.country}`;
    const description = church.description?.substring(0, 150) || `Learn about ${church.name} in ${church.city}, ${church.country}. View Mass times, confession schedules, and more.`;

    return {
        title: `${title} | MyPrayerTower`,
        description,
        openGraph: {
            title,
            description,
            images: church.primaryImageUrl ? [church.primaryImageUrl] : [],
        },
    };
}

export default async function ChurchDetailPage({ params }: Props) {
    const church = await prisma.church.findUnique({
        where: { slug: params.slug },
        include: {
            Diocese: true,
            ChurchStaff: true,
            ChurchImage: true,
            ChurchEvent: {
                where: {
                    startDate: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    startDate: 'asc',
                },
                take: 5,
            },
        },
    });

    if (!church) {
        notFound();
    }

    const serializedChurch = {
        ...church,
        ChurchEvent: church.ChurchEvent.map(event => ({
            ...event,
            startDate: event.startDate.toISOString(),
            eventType: event.eventType as string
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateChurchSchema({
                        ...church,
                        slug: church.slug || '',
                        latitude: church.latitude || undefined,
                        longitude: church.longitude || undefined,
                    }))
                }}
            />
            <ChurchProfile church={serializedChurch as any} />
        </>
    );
}
