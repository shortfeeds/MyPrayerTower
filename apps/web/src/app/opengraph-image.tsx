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
                    background: 'linear-gradient(to bottom right, #1e1b4b, #4338ca)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                    {/* Simple SVG Logo Representation */}
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div style={{ fontSize: 64, fontWeight: 900, marginBottom: 20, fontFamily: 'serif' }}>
                    MyPrayerTower
                </div>
                <div style={{ fontSize: 24, opacity: 0.8, maxWidth: 800, textAlign: 'center' }}>
                    The Catholic App for Prayer, Community, and Faith
                </div>
                <div style={{
                    marginTop: 40,
                    display: 'flex',
                    gap: 20,
                    fontSize: 18,
                    color: '#fbbf24'
                }}>
                    <span>Mass Times</span> • <span>Candles</span> • <span>Readings</span>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
