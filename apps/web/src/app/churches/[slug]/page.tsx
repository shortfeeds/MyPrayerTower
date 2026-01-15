import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChurchProfile } from '@/components/churches/ChurchProfile';
import { generateChurchSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData';
import { db } from '@/lib/db';
import { cache } from 'react';

interface Props {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

// ISR - revalidate every 30 minutes
export const revalidate = 1800;

// Pre-generate static pages for top verified churches only
// The rest will be generated on-demand with ISR
export async function generateStaticParams() {
    try {
        const churches = await db.church.findMany({
            where: { isVerified: true },
            select: { slug: true },
            orderBy: [
                { followerCount: 'desc' },
                { viewCount: 'desc' }
            ],
            take: 100, // Only pre-generate top 100 to prevent build timeout
        });
        return churches.map(c => ({ slug: c.slug }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return []; // Fallback to dynamic rendering if DB fails
    }
}

// Cached data fetcher to prevent double DB calls
const getChurch = cache(async (slug: string) => {
    return await db.church.findUnique({
        where: { slug },
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
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const church = await getChurch(params.slug);

    if (!church) {
        return { title: 'Church Not Found' };
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
        alternates: {
            canonical: `https://myprayertower.com/churches/${params.slug}`,
        },
    };
}

export default async function ChurchDetailPage({ params }: Props) {
    const church = await getChurch(params.slug);

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
                    __html: JSON.stringify([
                        generateChurchSchema({
                            ...church,
                            slug: church.slug || '',
                            latitude: church.latitude || undefined,
                            longitude: church.longitude || undefined,
                        }),
                        generateBreadcrumbSchema([
                            { name: 'Home', url: 'https://myprayertower.com' },
                            { name: 'Churches', url: 'https://myprayertower.com/churches' },
                            { name: church.name, url: `https://myprayertower.com/churches/${church.slug}` },
                        ])
                    ])
                }}
            />
            <ChurchProfile church={serializedChurch as any} />
        </>
    );
}
