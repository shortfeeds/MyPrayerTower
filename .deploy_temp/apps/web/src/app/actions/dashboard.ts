'use server';

import { db } from '@/lib/db';
import { getUserFromCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export interface ParishStats {
    totalViews: number;
    totalFollowers: number;
    totalAnnouncements: number;
    upcomingEvents: number;
}

export interface ChurchProfile {
    id: string;
    name: string;
    slug: string;
    isVerified: boolean;
}

export interface ParishDashboardData {
    stats: ParishStats;
    church: ChurchProfile;
    recentActivity: MockActivityItem[]; // Keeping activity minimal/mock for now as explicit "Activity Feed" table doesn't exist, will derive from followers/events if possible or return empty
}

// Temporary type to match existing component structure until fully refactored
export interface MockActivityItem {
    id: string;
    type: 'review' | 'follower' | 'event_rsvp';
    content: string;
    time: string;
    isNew: boolean;
}

export async function getParishStats(): Promise<ParishDashboardData | null> {
    const user = await getUserFromCookie();
    if (!user) return null;

    // 1. Find the church this user manages
    const churchAdmin = await db.churchAdmin.findFirst({
        where: { userId: user.id },
        include: {
            Church: true
        }
    });

    if (!churchAdmin || !churchAdmin.Church) {
        return null; // User is not an admin of any church
    }

    const church = churchAdmin.Church;

    // 2. Fetch Real Counts
    const followerCount = await db.churchFollower.count({
        where: { churchId: church.id }
    });

    const announcementCount = await db.churchAnnouncement.count({
        where: { churchId: church.id }
    });

    const upcomingEventsCount = await db.churchEvent.count({
        where: {
            churchId: church.id,
            startDate: {
                gte: new Date() // Events in the future
            }
        }
    });

    // 3. Fetch Recent Activity (derived)
    // Get recent followers
    const recentFollowers = await db.churchFollower.findMany({
        where: { churchId: church.id },
        include: { User: { select: { displayName: true, firstName: true } } },
        orderBy: { followedAt: 'desc' },
        take: 3
    });

    const activityItems: MockActivityItem[] = recentFollowers.map(f => ({
        id: `follower-${f.id}`,
        type: 'follower',
        content: `${f.User.displayName || f.User.firstName || 'someone'} started following your parish`,
        time: f.followedAt.toLocaleDateString(), // simplified formatting
        isNew: true
    }));

    return {
        stats: {
            totalViews: church.viewCount,
            totalFollowers: followerCount,
            totalAnnouncements: announcementCount,
            upcomingEvents: upcomingEventsCount
        },
        church: {
            id: church.id,
            name: church.name,
            slug: church.slug,
            isVerified: church.isVerified,
        },
        recentActivity: activityItems
    };
}
