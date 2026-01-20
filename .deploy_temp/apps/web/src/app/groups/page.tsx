import { cookies } from 'next/headers';
import { PrayerGroupsClient } from '@/components/features/PrayerGroupsClient';

export default function PrayerGroupsPage() {
    const session = cookies().get('user_session');
    const isAuthenticated = !!session;

    return <PrayerGroupsClient isAuthenticated={isAuthenticated} />;
}
