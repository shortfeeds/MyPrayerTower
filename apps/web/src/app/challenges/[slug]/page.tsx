import { notFound } from 'next/navigation';
import { getChallengeBySlug } from '@/app/actions/challenges';
import ChallengeDetailClient from './ChallengeDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
    params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
    const challenge = await getChallengeBySlug(params.slug);

    if (!challenge) {
        return { title: 'Challenge Not Found | MyPrayerTower' };
    }

    return {
        title: `${challenge.name} | Prayer Challenges | MyPrayerTower`,
        description: challenge.shortDescription || challenge.description.slice(0, 160),
    };
}

export default async function ChallengeDetailPage({ params }: Props) {
    const challenge = await getChallengeBySlug(params.slug);

    if (!challenge) {
        notFound();
    }

    return <ChallengeDetailClient challenge={challenge} />;
}
