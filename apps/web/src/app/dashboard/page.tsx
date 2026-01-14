import { redirect } from 'next/navigation';
import { getParishStats } from '@/app/actions/dashboard';
import { ParishDashboard } from '@/components/dashboard/ParishDashboard';

export default async function DashboardPage() {
    const data = await getParishStats();

    // If user is logged in (middleware check usually) but has no parish, 
    // we might want to show a "Create Parish" or "Connect Parish" page instead.
    // For now, if null (not admin), redirect to home or separate setup page.
    if (!data) {
        // Option: redirect('/dashboard/setup'); 
        // For strict security requested:
        redirect('/');
    }

    return <ParishDashboard initialData={data} />;
}
