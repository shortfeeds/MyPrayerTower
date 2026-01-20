import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SaintProfile } from '@/components/saints/SaintProfile';
import { generateSaintSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData';
import { toSafeJSON } from '@/lib/dto';
import { db } from '@/lib/db';

interface Props {
    params: { slug: string };
}

// ISR - revalidate every hour
export const revalidate = 3600;

// Pre-generate static pages for all saints
export async function generateStaticParams() {
    return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const saint = await db.saint.findUnique({
        where: { slug: params.slug },
        select: { name: true, title: true, shortBio: true, biography: true, patronOf: true, imageUrl: true }
    });

    if (!saint) {
        return { title: 'Saint Not Found' };
    }

    return {
        title: `${saint.name} ${saint.title ? `- ${saint.title}` : ''} | Saint Profile`,
        description: saint.shortBio || saint.biography?.substring(0, 150) || `Learn about ${saint.name}, patron of ${saint.patronOf?.join(', ') || 'the faithful'}.`,
        openGraph: {
            title: `${saint.name} | Saint Profile`,
            description: saint.shortBio || undefined,
            images: saint.imageUrl ? [saint.imageUrl] : [],
        },
        alternates: {
            canonical: `https://myprayertower.com/saints/${params.slug}`,
        },
    };
}

export default async function SaintDetailPage({ params }: Props) {
    const saint = await db.saint.findUnique({
        where: { slug: params.slug },
    });

    if (!saint) {
        notFound();
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        generateSaintSchema({
                            ...saint,
                            slug: saint.slug || '',
                            patronOf: saint.patronOf || undefined
                        }),
                        generateBreadcrumbSchema([
                            { name: 'Home', url: 'https://myprayertower.com' },
                            { name: 'Saints', url: 'https://myprayertower.com/saints' },
                            { name: saint.name, url: `https://myprayertower.com/saints/${saint.slug}` },
                        ])
                    ])
                }}
            />
            <SaintProfile saint={toSafeJSON(saint)} />
        </>
    );
}
