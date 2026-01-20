import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const saint = await db.saint.findUnique({
            where: { slug: params.slug },
        });

        if (!saint) {
            return new Response('Saint not found', { status: 404 });
        }

        // Truncate bio for display
        const displayBio = saint.shortBio || saint.biography;
        const truncatedBio = displayBio && displayBio.length > 200
            ? displayBio.substring(0, 200) + '...'
            : displayBio;

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
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)',
                        padding: '60px',
                        position: 'relative',
                    }}
                >
                    {/* Decorative elements */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '300px',
                            height: '300px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            borderRadius: '50%',
                        }}
                    />

                    {/* Saint Image or Icon */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(135deg, #fcd34d 0%, #d97706 100%)',
                            borderRadius: '50%',
                            marginBottom: '30px',
                            boxShadow: '0 10px 40px rgba(212, 175, 55, 0.4)',
                            border: '4px solid rgba(255,255,255,0.3)',
                        }}
                    >
                        <span style={{ fontSize: '50px' }}>⭐</span>
                    </div>

                    {/* Title */}
                    {saint.title && (
                        <p
                            style={{
                                fontSize: '24px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                            }}
                        >
                            {saint.title}
                        </p>
                    )}

                    {/* Name */}
                    <h1
                        style={{
                            fontSize: '56px',
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '20px',
                            fontFamily: 'Georgia, serif',
                            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                        }}
                    >
                        {saint.name}
                    </h1>

                    {/* Feast Day Badge */}
                    {saint.feastDay && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 24px',
                                background: 'rgba(255, 255, 255, 0.15)',
                                borderRadius: '30px',
                                marginBottom: '30px',
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>🕯️</span>
                            <span style={{ color: '#fcd34d', fontSize: '20px', fontWeight: '600' }}>
                                Feast Day: {saint.feastDay}
                            </span>
                        </div>
                    )}

                    {/* Bio */}
                    {truncatedBio && (
                        <p
                            style={{
                                fontSize: '22px',
                                color: 'rgba(255, 255, 255, 0.85)',
                                textAlign: 'center',
                                lineHeight: '1.5',
                                maxWidth: '900px',
                            }}
                        >
                            {truncatedBio}
                        </p>
                    )}

                    {/* Patron Of */}
                    {saint.patronOf && saint.patronOf.length > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                justifyContent: 'center',
                                gap: '10px',
                                marginTop: '20px',
                                maxWidth: '800px',
                            }}
                        >
                            {saint.patronOf.slice(0, 3).map((patron, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: '6px 16px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '20px',
                                        fontSize: '16px',
                                        color: 'rgba(255, 255, 255, 0.8)',
                                    }}
                                >
                                    Patron of {patron}
                                </div>
                            ))}
                        </div>
                    )}

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
                            ✝ myprayertower.com
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
