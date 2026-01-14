import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'MyPrayerTower - Connect, Pray, Grow';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'serif',
                    position: 'relative',
                }}
            >
                {/* Background Pattern Elements */}
                <div style={{
                    position: 'absolute',
                    top: -100,
                    left: -100,
                    width: 400,
                    height: 400,
                    background: '#4f46e5',
                    borderRadius: '50%',
                    filter: 'blur(120px)',
                    opacity: 0.3,
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: -100,
                    right: -100,
                    width: 400,
                    height: 400,
                    background: '#fbbf24',
                    borderRadius: '50%',
                    filter: 'blur(120px)',
                    opacity: 0.2,
                }} />

                {/* Content Container */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    padding: '40px 80px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 32,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backdropFilter: 'blur(10px)',
                }}>
                    {/* Logo & Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
                        <svg
                            width="96"
                            height="96"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#fbbf24"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                        <div style={{
                            fontSize: 72,
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #ffffff, #e2e8f0)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            letterSpacing: '-0.02em',
                        }}>
                            MyPrayerTower
                        </div>
                    </div>

                    {/* Tagline */}
                    <div style={{
                        fontSize: 32,
                        color: '#94a3b8',
                        fontWeight: 500,
                        marginBottom: 48,
                        textAlign: 'center',
                        maxWidth: 800,
                        lineHeight: 1.4,
                    }}>
                        The #1 Catholic App for Prayer, Community & Faith
                    </div>

                    {/* Features Pills */}
                    <div style={{
                        display: 'flex',
                        gap: 16,
                    }}>
                        {['Find Mass Times', 'Light Candles', 'Daily Readings'].map((feature) => (
                            <div key={feature} style={{
                                padding: '12px 24px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 100,
                                fontSize: 20,
                                color: '#e2e8f0',
                                fontWeight: 600,
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer URL */}
                <div style={{
                    position: 'absolute',
                    bottom: 40,
                    fontSize: 24,
                    color: '#fbbf24',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                }}>
                    MYPRAYERTOWER.COM
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
