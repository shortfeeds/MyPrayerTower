import { getPrayerRequests } from '@/app/actions/prayer';
import PrayerWallClient from '@/components/features/PrayerWallClient';

export default async function PrayerWallPage() {
    // Fetch initial prayers (first page)
    const { prayers } = await getPrayerRequests(1, 10);

    return <PrayerWallClient initialPrayers={prayers} currentUserId="user_abc123" />;
}
