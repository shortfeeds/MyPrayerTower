import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const title = searchParams.get('title') || 'Daily Catholic Prayer';
        const subtitle = searchParams.get('subtitle') || 'Traditional Devotion & Spiritual Grace';
        const quote = searchParams.get('quote') || 'Lord Jesus Christ, Son of the Living God, have mercy on me, a sinner.';
        const category = searchParams.get('category') || 'Prayer';

        // Truncate quote cleanly
        const cleanQuote = quote.replace(/[*_#]/g, '');
        const displayQuote = cleanQuote.length > 280
            ? cleanQuote.substring(0, 280).trim() + '...'
            : cleanQuote;

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '1000px',
                        height: '1500px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '80px 70px',
                        background: 'radial-gradient(circle at 50% 20%, #1e1035 0%, #0c0617 60%, #05020a 100%)',
                        color: '#ffffff',
                        fontFamily: 'serif',
                        position: 'relative',
                    }}
                >
                    {/* Decorative Sacred Golden Arch Border */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '25px',
                            bottom: '25px',
                            left: '25px',
                            right: '25px',
                            border: '2px solid rgba(212, 175, 55, 0.4)',
                            borderRadius: '30px',
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '35px',
                            bottom: '35px',
                            left: '35px',
                            right: '35px',
                            border: '1px solid rgba(212, 175, 55, 0.15)',
                            borderRadius: '24px',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Top Header */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            marginTop: '20px',
                        }}
                    >
                        {/* Glowing Cross Emblem */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '74px',
                                height: '74px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.05) 100%)',
                                border: '2px solid rgba(212, 175, 55, 0.6)',
                                marginBottom: '24px',
                                boxShadow: '0 0 35px rgba(212, 175, 55, 0.35)',
                            }}
                        >
                            <span style={{ fontSize: '38px', color: '#d4af37' }}>✝</span>
                        </div>

                        {/* Category Badge */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px 24px',
                                borderRadius: '100px',
                                background: 'rgba(212, 175, 55, 0.12)',
                                border: '1px solid rgba(212, 175, 55, 0.35)',
                                color: '#f3d37a',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '4px',
                                fontFamily: 'sans-serif',
                            }}
                        >
                            {category}
                        </div>
                    </div>

                    {/* Main Content: Title & Devotional Quote */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            width: '100%',
                            padding: '0 20px',
                        }}
                    >
                        {/* Title */}
                        <h1
                            style={{
                                fontSize: '64px',
                                fontWeight: 'bold',
                                lineHeight: '1.15',
                                color: '#ffffff',
                                margin: '0 0 20px 0',
                                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
                            }}
                        >
                            {title}
                        </h1>

                        {/* Subtitle */}
                        {subtitle && (
                            <p
                                style={{
                                    fontSize: '24px',
                                    color: '#d4af37',
                                    margin: '0 0 45px 0',
                                    fontStyle: 'italic',
                                }}
                            >
                                {subtitle}
                            </p>
                        )}

                        {/* Divider */}
                        <div
                            style={{
                                width: '120px',
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
                                marginBottom: '45px',
                            }}
                        />

                        {/* Sacred Devotional Text Box */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'rgba(255, 255, 255, 0.04)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '24px',
                                padding: '40px',
                                width: '100%',
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <p
                                style={{
                                    fontSize: '32px',
                                    lineHeight: '1.6',
                                    color: '#f1ede6',
                                    margin: 0,
                                    fontStyle: 'italic',
                                }}
                            >
                                &ldquo;{displayQuote}&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Footer: Brand & Pin Call-to-Action */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            marginBottom: '15px',
                        }}
                    >
                        {/* Save to Pinterest CTA */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 28px',
                                borderRadius: '50px',
                                background: '#E60023',
                                color: '#ffffff',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                fontFamily: 'sans-serif',
                                marginBottom: '22px',
                                boxShadow: '0 6px 20px rgba(230, 0, 35, 0.4)',
                            }}
                        >
                            📌 Save this Prayer to Your Board
                        </div>

                        {/* Domain Branding */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '20px',
                                letterSpacing: '2px',
                                fontFamily: 'sans-serif',
                            }}
                        >
                            <span>🕊️ MyPrayerTower.com</span>
                            <span>•</span>
                            <span style={{ color: '#d4af37' }}>Catholic Sanctuary &amp; Prayers</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1000,
                height: 1500,
            }
        );
    } catch (e: any) {
        return new Response(`Failed to generate Pinterest image: ${e.message}`, { status: 500 });
    }
}
