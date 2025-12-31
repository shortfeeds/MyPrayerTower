import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@mpt/database';
import { SignJWT } from 'jose';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-key-change-this-in-prod'
);

// Admin email - only this email can access the admin panel
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'myprayertower2@gmail.com';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check if this email is authorized as admin
        if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
            return NextResponse.json(
                { error: 'Unauthorized: This email is not an admin' },
                { status: 403 }
            );
        }

        // Find user in the User table
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found. Please register first.' },
                { status: 404 }
            );
        }

        // Verify password
        if (!user.passwordHash) {
            return NextResponse.json(
                { error: 'Password not set for this account' },
                { status: 400 }
            );
        }

        const isValid = await compare(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create session token (JWT)
        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            name: user.displayName || user.firstName || 'Admin',
            isAdmin: true,
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'admin_session',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.displayName || user.firstName || 'Admin',
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
