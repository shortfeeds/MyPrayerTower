'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';

const prisma = db;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { contentType, contentId, reason, details } = body;

        // Validate required fields
        if (!contentType || !contentId || !reason) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate reason enum
        const validReasons = [
            'SPAM',
            'HARASSMENT',
            'INAPPROPRIATE_CONTENT',
            'IMPERSONATION',
            'MALICIOUS_LINKS',
            'OTHER',
        ];

        if (!validReasons.includes(reason)) {
            return NextResponse.json(
                { error: 'Invalid reason' },
                { status: 400 }
            );
        }

        // Get reporter info from session (simplified - should use real auth)
        const reporterId = request.headers.get('x-user-id');

        // For content reports (not user reports), we store differently
        // For now, we'll create a simple content report log
        // In a real app, you'd want a separate ContentReport model

        // If it's a user report, use the UserReport model
        if (contentType === 'user') {
            // Check if report already exists from this reporter
            const existingReport = await prisma.userReport.findFirst({
                where: {
                    reporterId: reporterId || 'anonymous',
                    reportedUserId: contentId,
                    status: 'PENDING',
                },
            });

            if (existingReport) {
                return NextResponse.json({
                    success: true,
                    message: 'Report already submitted'
                });
            }

            await prisma.userReport.create({
                data: {
                    reporterId: reporterId || 'anonymous',
                    reportedUserId: contentId,
                    reason: reason as any,
                    details: details || null,
                    status: 'PENDING',
                },
            });
        } else {
            // For other content types (prayer, church, comment)
            // Store as a generic report in the system
            // This could be extended to have a ContentReport model
            console.log('Content report submitted:', {
                contentType,
                contentId,
                reason,
                details,
                reporterId,
                timestamp: new Date().toISOString(),
            });
        }

        // Send email notification to admin
        await sendAdminNotification({
            type: 'report',
            subject: `New Report: ${reason} (Type: ${contentType})`,
            data: {
                Reason: reason,
                'Content Type': contentType,
                'Content ID': contentId,
                Details: details || 'None',
                'Reporter ID': reporterId || 'Anonymous'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Report submitted successfully'
        });
    } catch (error) {
        console.error('Error creating report:', error);
        return NextResponse.json(
            { error: 'Failed to submit report' },
            { status: 500 }
        );
    }
}

// Get reports (admin only)
export async function GET(request: NextRequest) {
    try {
        // Check for admin authorization
        const apiKey = request.headers.get('x-api-key');
        if (apiKey !== process.env.ADMIN_API_KEY) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'PENDING';

        const reports = await prisma.userReport.findMany({
            where: { status: status as any },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                reporter: {
                    select: { id: true, displayName: true, email: true },
                },
                reportedUser: {
                    select: { id: true, displayName: true, email: true },
                },
            },
        });

        return NextResponse.json({ reports });
    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reports' },
            { status: 500 }
        );
    }
}
