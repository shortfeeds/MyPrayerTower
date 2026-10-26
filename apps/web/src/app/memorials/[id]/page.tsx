import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMemorialById } from '@/app/actions/memorials';
import { Memorial } from '@/lib/types/memorials';
import { MemorialDetailClient } from './MemorialDetailClient';

interface MemorialPageProps {
    params: { id: string };
}

// Sample memorials so that demo cards work seamlessly before or alongside DB entries
const SAMPLE_MEMORIALS: Record<string, Memorial> = {
    'sample-1': {
        id: 'sample-1',
        firstName: 'Maria',
        lastName: 'Santos',
        birthDate: '1945-03-15',
        deathDate: '2024-11-22',
        biography: 'A devoted mother, grandmother, and faithful servant of God. Maria touched countless lives with her kindness, her rosary always in hand. She served her parish for over 40 years, organizing food drives and leading prayer groups. Her unwavering faith and selfless love for her community will forever be remembered by all who had the blessing of knowing her.',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Anna Santos', firstName: 'Anna', lastName: 'Santos' },
        totalCandles: 156,
        totalFlowers: 42,
        totalPrayers: 89,
        tier: 'PREMIUM',
        guestbook: [
            {
                id: 'gb-1',
                guestName: 'Father Anthony',
                message: 'Maria was the heart of our parish altar society. Her memory is a blessing to us all.',
                createdAt: '2024-11-25T10:00:00Z',
            },
            {
                id: 'gb-2',
                guestName: 'Elena Ramos',
                message: 'Rest in the loving arms of our Mother Mary, dear auntie Maria.',
                createdAt: '2024-11-24T14:30:00Z',
            }
        ]
    },
    'sample-2': {
        id: 'sample-2',
        firstName: 'Joseph',
        lastName: "O'Connor",
        birthDate: '1938-07-04',
        deathDate: '2024-08-15',
        biography: "A loving husband of 58 years, proud father, and devoted parishioner of St. Patrick's Church. Joe never missed Sunday Mass. He was a pillar of his community, known for his warm smile and willingness to help anyone in need. His legacy of faith continues through his children and grandchildren.",
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: "Michael O'Connor", firstName: 'Michael', lastName: "O'Connor" },
        totalCandles: 203,
        totalFlowers: 67,
        totalPrayers: 142,
        tier: 'PREMIUM',
        guestbook: [
            {
                id: 'gb-3',
                guestName: 'Knights of Columbus Council #142',
                message: 'In honour of our faithful brother Sir Knight Joseph. Requiescat in pace.',
                createdAt: '2024-08-18T09:00:00Z'
            }
        ]
    },
    'sample-3': {
        id: 'sample-3',
        firstName: 'Theresa',
        lastName: 'Rodriguez',
        birthDate: '1952-10-01',
        deathDate: '2025-01-05',
        biography: 'Named after St. Therese of Lisieux, Theresa lived her faith daily through acts of charity and service to the poor in her community. She founded a women\'s shelter that continues to serve hundreds of families each year. Her "little way" of love touched everyone around her.',
        photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Rosa Martinez', firstName: 'Rosa', lastName: 'Martinez' },
        totalCandles: 89,
        totalFlowers: 28,
        totalPrayers: 55,
        tier: 'BASIC',
    },
    'sample-4': {
        id: 'sample-4',
        firstName: 'Patrick',
        lastName: 'Murphy',
        birthDate: '1940-03-17',
        deathDate: '2024-12-25',
        biography: 'A Knight of Columbus for over 40 years, Patrick dedicated his life to faith, family, and serving his parish community. He organized countless charitable events and was known for his booming laugh and generous spirit.',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Sean Murphy', firstName: 'Sean', lastName: 'Murphy' },
        totalCandles: 178,
        totalFlowers: 54,
        totalPrayers: 94,
        tier: 'PREMIUM',
    },
    'sample-5': {
        id: 'sample-5',
        firstName: 'Catherine',
        lastName: 'Kim',
        birthDate: '1960-08-20',
        deathDate: '2024-09-08',
        biography: 'A convert to Catholicism who embraced the faith with her whole heart. Catherine led the Korean Catholic community choir for 15 years and brought joy to every liturgy she participated in.',
        photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Grace Kim', firstName: 'Grace', lastName: 'Kim' },
        totalCandles: 112,
        totalFlowers: 35,
        totalPrayers: 61,
        tier: 'BASIC',
    },
    'sample-6': {
        id: 'sample-6',
        firstName: 'Antonio',
        lastName: 'Garcia',
        birthDate: '1935-12-12',
        deathDate: '2024-06-13',
        biography: 'Antonio walked 10 miles to daily Mass every morning for 30 years. His faith and dedication inspired all who knew him. He was a devoted husband and the patriarch of a large, loving family.',
        photoUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&crop=face',
        owner: { displayName: 'Maria Garcia', firstName: 'Maria', lastName: 'Garcia' },
        totalCandles: 245,
        totalFlowers: 89,
        totalPrayers: 130,
        tier: 'PREMIUM',
    },
};

async function getMemorial(id: string): Promise<Memorial | null> {
    if (SAMPLE_MEMORIALS[id]) {
        return SAMPLE_MEMORIALS[id];
    }
    return getMemorialById(id);
}

export async function generateMetadata({ params }: MemorialPageProps): Promise<Metadata> {
    const memorial = await getMemorial(params.id);
    if (!memorial) return { title: 'Memorial Not Found' };

    const birthYear = memorial.birthDate ? new Date(memorial.birthDate).getFullYear() : '';
    const deathYear = memorial.deathDate ? new Date(memorial.deathDate).getFullYear() : '';
    const lifespan = birthYear && deathYear ? ` (${birthYear} - ${deathYear})` : '';

    return {
        title: `In Loving Memory: ${memorial.firstName} ${memorial.lastName}${lifespan} | MyPrayerTower`,
        description: memorial.biography?.substring(0, 160) || `Consecrated digital memorial, vigil candle altar, and perpetual prayer tribute for ${memorial.firstName} ${memorial.lastName}.`,
    };
}

export default async function MemorialDetailPage({ params }: MemorialPageProps) {
    const memorial = await getMemorial(params.id);

    if (!memorial) {
        notFound();
    }

    return <MemorialDetailClient memorial={memorial} />;
}
