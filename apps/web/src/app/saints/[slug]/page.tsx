import { PrismaClient } from '@mpt/database';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SaintProfile } from '@/components/saints/SaintProfile';
import { generateSaintSchema } from '@/lib/seo/structuredData';
import { toSafeJSON } from '@/lib/dto';

const prisma = new PrismaClient();

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const saint = await prisma.saint.findUnique({
        where: { slug: params.slug },
    });

    if (!saint) {
        return {
            title: 'Saint Not Found',
        };
    }

    return {
        title: `${saint.name} ${saint.title ? `- ${saint.title}` : ''} | Saint Profile`,
        description: saint.shortBio || saint.biography?.substring(0, 150) || `Learn about ${saint.name}, patron of ${saint.patronOf?.join(', ') || 'the faithful'}.`,
        openGraph: {
            title: `${saint.name} | Saint Profile`,
            description: saint.shortBio || undefined,
            images: saint.imageUrl ? [saint.imageUrl] : [],
        },
    };
}

export default async function SaintDetailPage({ params }: Props) {
    const saint = await prisma.saint.findUnique({
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
                    __html: JSON.stringify(generateSaintSchema({
                        ...saint,
                        slug: saint.slug || '',
                        patronOf: saint.patronOf || undefined
                    }))
                }}
            />
            <SaintProfile saint={toSafeJSON(saint)} />
        </>
    );
}
