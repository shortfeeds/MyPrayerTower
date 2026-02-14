import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'Catholic Prayer from MyPrayerTower';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    let title = 'Catholic Prayer';
    try {
        const prayer = await db.prayer.findFirst({
            where: { slug: params.slug, is_active: true },
            select: { title: true },
        });
        if (prayer?.title) title = prayer.title;
    } catch (e) {
        console.error('OG image DB error:', e);
    }

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#1a1c2e', // sacred-900 equivalent
                    backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.2) 2%, transparent 0%)',
                    backgroundSize: '100px 100px',
                    color: 'white',
                    fontFamily: 'serif',
                }}
            >
                {/* Decorative Circle */}
                <div
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '600px',
                        height: '600px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(234, 179, 8, 0.1) 0%, transparent 70%)',
                    }}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        textAlign: 'center',
                        zIndex: 10,
                    }}
                >
                    <div
                        style={{
                            fontSize: 24,
                            textTransform: 'uppercase',
                            letterSpacing: '4px',
                            color: '#eab308', // gold-500
                            marginBottom: 20,
                        }}
                    >
                        Prayer Treasury
                    </div>

                    <div
                        style={{
                            fontSize: 64,
                            fontWeight: 'bold',
                            lineHeight: 1.1,
                            marginBottom: 40,
                            maxWidth: '900px',
                            textShadow: '0 4px 10px rgba(0,0,0,0.5)',
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '50px',
                            padding: '12px 32px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            style={{ color: '#eab308' }}
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        <span style={{ fontSize: 24, fontWeight: 'medium' }}>Pray with us on MyPrayerTower</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
