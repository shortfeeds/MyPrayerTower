import { getSacramentRecords, getSacramentStats } from '@/actions/sacraments';
import SacramentsClient from './SacramentsClient';

export default async function SacramentsPage() {
    // TODO: Get real church ID from session
    const demoChurchId = 'demo-church-1';

    // Fetch data in parallel
    const [records, stats] = await Promise.all([
        getSacramentRecords(demoChurchId),
        getSacramentStats(demoChurchId)
    ]);

    return <SacramentsClient records={records} stats={stats} />;
}
