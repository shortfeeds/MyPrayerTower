import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { moderateContent } from '@/lib/moderation';
import { inspectSpamContent, validateHoneypot } from '@/lib/spam-protection';
import { getUserFromCookie } from '@/lib/auth';
import { notifyIndexNow } from '@/lib/indexnow';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const content = (body.content || body.intention || '').trim();
        const category = (body.category || 'SPIRITUAL').toUpperCase();
        const isAnonymous = Boolean(body.isAnonymous);
        const visibility = (body.visibility || (isAnonymous ? 'ANONYMOUS' : 'PUBLIC')).toUpperCase();
        const honeypot = body.website || body.website_url;

        // 1. Minimum content length
        if (!content || content.length < 5) {
            return NextResponse.json({
                success: false,
                message: 'Prayer intention must be at least 5 characters.'
            }, { status: 400 });
        }

        // 2. Anti-Spam Honeypot check
        if (honeypot && typeof honeypot === 'string' && honeypot.length > 0) {
            console.warn('[SPAM SHIELD] Prayer intention honeypot triggered by bot');
            return NextResponse.json({ success: false, message: 'Spam detected.' }, { status: 400 });
        }

        // 3. Spam Content & Link Inspection
        const spamCheck = inspectSpamContent({ message: content });
        if (spamCheck.isSpam) {
            return NextResponse.json({
                success: false,
                message: spamCheck.reason || 'Prayer intentions cannot contain promotional links or advertising.'
            }, { status: 400 });
        }

        // 4. Profanity & Toxicity Moderation
        const moderation = moderateContent(content);
        if (!moderation.isValid) {
            return NextResponse.json({
                success: false,
                message: moderation.reason || 'Content contains inappropriate language.'
            }, { status: 400 });
        }

        // 5. User identification
        let userId = body.userId;
        const cookieUser = await getUserFromCookie().catch(() => null);
        if (cookieUser?.id) {
            userId = cookieUser.id;
        }

        // Fallback to demo/guest user if anonymous mobile submission without auth
        if (!userId) {
            const guestUser = await db.user.findFirst({
                where: { email: { contains: 'guest' } },
                select: { id: true }
            });
            if (guestUser) {
                userId = guestUser.id;
            } else {
                const anyUser = await db.user.findFirst({ select: { id: true } });
                userId = anyUser?.id;
            }
        }

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unable to record prayer intention.' }, { status: 500 });
        }

        // 6. Intelligent Auto-Moderation Decision
        // Clean devotional petitions for health, family, healing, peace are auto-approved
        const isAutoApproved = moderation.isValid && !spamCheck.isSpam;
        const status = isAutoApproved ? 'APPROVED' : 'PENDING';
        const moderationNotes = isAutoApproved
            ? 'Auto-moderated: Approved (Reverent Catholic Intention)'
            : 'Auto-moderated: Flagged for manual pastoral review';

        const id = typeof crypto !== 'undefined' && crypto.randomUUID
            ? crypto.randomUUID()
            : `pr_${Date.now()}`;

        // Valid PrayerCategory enum values
        const validCategories = ['HEALTH', 'FAMILY', 'WORK', 'FINANCES', 'RELATIONSHIPS', 'GRIEF', 'THANKSGIVING', 'SPIRITUAL', 'WORLD', 'OTHER'];
        const safeCategory = validCategories.includes(category) ? category : 'OTHER';

        const prayer = await db.prayerRequest.create({
            data: {
                id,
                content,
                category: safeCategory as any,
                visibility: (visibility === 'PRIVATE' ? 'PRIVATE' : isAnonymous ? 'ANONYMOUS' : 'PUBLIC') as any,
                isAnonymous,
                userId,
                status: status as any,
                moderationNotes,
                moderatedAt: new Date(),
                moderatedBy: 'SYSTEM_AUTO_MODERATOR',
                prayerCount: 0,
                updatedAt: new Date(),
            }
        });

        // Notify search engines
        notifyIndexNow('/prayer-wall').catch(() => {});

        return NextResponse.json({
            success: true,
            id: prayer.id,
            status: prayer.status,
            message: isAutoApproved
                ? 'Your prayer intention has been placed on the Sacred Altar.'
                : 'Your prayer intention has been submitted for pastoral review.'
        });

    } catch (error: any) {
        console.error('[API] Error submitting prayer intention:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to submit prayer intention. Please try again.'
        }, { status: 500 });
    }
}
