import { redirect } from 'next/navigation';
import { getUserFromCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { DashboardLayoutClient } from './DashboardLayoutClient';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Strict Auth Check
    const user = await getUserFromCookie();

    if (!user) {
        redirect('/login?redirect=/dashboard&message=Please sign in to access the Parish Dashboard');
    }

    // 2. Strict Role/Ownership Check
    // A user must be an admin of a church to view *any* part of the dashboard.
    // We check if there is an associated ChurchAdmin record or just check primary church association.
    // Based on schema viewed earlier, ChurchAdmin links User <-> Church.

    const adminRecord = await db.churchAdmin.findFirst({
        where: { userId: user.id },
        select: { id: true, churchId: true }
    });

    if (!adminRecord) {
        // User is logged in but NOT a church admin.
        // Redirect them to their personal journey or a "Create Church" flow.
        // For now, redirect to Journey to keep them out of admin area.
        redirect('/journey');
    }

    // 3. Render the Client Layout which contains the Sidebar
    return (
        <DashboardLayoutClient>
            {children}
        </DashboardLayoutClient>
    );
}
