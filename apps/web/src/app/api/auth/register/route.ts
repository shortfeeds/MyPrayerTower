import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName, displayName, name } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email: normalizedEmail }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const parsedFirstName = firstName || (name ? name.split(' ')[0] : 'Faithful');
        const parsedLastName = lastName || (name && name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : 'Friend');
        const parsedDisplayName = displayName || name || `${parsedFirstName} ${parsedLastName}`.trim();

        const userId = crypto.randomUUID();

        // Create user in primary database
        const user = await prisma.user.create({
            data: {
                id: userId,
                email: normalizedEmail,
                passwordHash,
                firstName: parsedFirstName,
                lastName: parsedLastName,
                displayName: parsedDisplayName,
                streakCount: 1,
                longestStreak: 1,
                lastStreakUpdate: new Date(),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                displayName: true,
                streakCount: true,
                longestStreak: true,
                lastStreakUpdate: true,
            }
        });

        const sessionToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        try {
            const cookieStore = await cookies();
            cookieStore.set('auth-token', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires: expiresAt,
                path: '/',
            });
            cookieStore.set('user-id', user.id, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires: expiresAt,
                path: '/',
            });
        } catch {
            // Non-cookie environment (Mobile app API caller)
        }

        return NextResponse.json({
            success: true,
            token: sessionToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.displayName,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: user.displayName,
                streakCount: user.streakCount,
                longestStreak: user.longestStreak,
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}
