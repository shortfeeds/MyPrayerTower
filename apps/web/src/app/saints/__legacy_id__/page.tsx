import { PrismaClient } from '@mpt/database';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SaintProfile } from '@/components/saints/SaintProfile';
import { generateSaintSchema } from '@/lib/seo/structuredData';

const prisma = new PrismaClient();

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const saint = await prisma.saint.findUnique({
        where: { id: params.id },
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
        where: { id: params.id },
    });

    if (!saint) {
        notFound();
    }

    // Convert dates to string (if stored as Date objects vs strings in schema)
    // Checking schema: bornDate/diedDate are Strings.
    // However, createAt/updatedAt are Dates. If we pass them, we need to serialize.
    // The defined interface in SaintProfile doesn't ask for createdAt/updatedAt.
    // So distinct manual props or just passing 'saint' should work if types align.

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(generateSaintSchema({
                        ...saint,
                        // Ensure optional fields are handled correctly for the schema helper
                        slug: saint.slug || '',
                        patronOf: saint.patronOf || undefined
                    }))
                }}
            />
            <SaintProfile saint={saint} />
        </>
    );
}
