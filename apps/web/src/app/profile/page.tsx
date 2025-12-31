'use client';

import { PersonalizedHome } from '@/components/dashboard/PersonalizedHome';

/**
 * User Profile Page - Personalized Dashboard
 * Hallow-inspired home screen with daily content and progress tracking
 */
export default function ProfilePage() {
    // TODO: Get actual user ID from auth context
    const userId = 'demo-user';

    return <PersonalizedHome userId={userId} />;
}
