import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const prayer = await db.prayer.findUnique({
            where: { id: params.id },
        });

        if (!prayer) {
            return new Response('Prayer not found', { status: 404 });
        }

        // Truncate prayer text for display
        const displayText = prayer.text.length > 300
            ? prayer.text.substring(0, 300) + '...'
            : prayer.text;

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #1e3a5f 0%, #0c4a6e 50%, #164e63 100%)',
                        padding: '60px',
                    }}
                >
                    {/* Cross Icon */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #fcd34d 0%, #d97706 100%)',
                            borderRadius: '20px',
                            marginBottom: '30px',
                            boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
                        }}
                    >
                        <span style={{ fontSize: '40px', color: 'white' }}>✝</span>
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '20px',
                            fontFamily: 'Georgia, serif',
                        }}
                    >
                        {prayer.title}
                    </h1>

                    {/* Category Badge */}
                    {prayer.category && (
                        <div
                            style={{
                                display: 'flex',
                                padding: '8px 20px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '20px',
                                marginBottom: '30px',
                            }}
                        >
                            <span style={{ color: '#fcd34d', fontSize: '18px', fontWeight: '600' }}>
                                {prayer.category}
                            </span>
                        </div>
                    )}

                    {/* Prayer Text */}
                    <p
                        style={{
                            fontSize: '24px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            textAlign: 'center',
                            lineHeight: '1.6',
                            maxWidth: '900px',
                            fontStyle: 'italic',
                        }}
                    >
                        "{displayText}"
                    </p>

                    {/* Footer */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <span style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.7)' }}>
                            myprayertower.com
                        </span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (error) {
        console.error('Error generating OG image:', error);
        return new Response('Error generating image', { status: 500 });
    }
}
