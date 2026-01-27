
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parameters
        const recipient = searchParams.get('recipient') || 'Friend';
        const sender = searchParams.get('sender') || 'Someone';
        const occasion = searchParams.get('occasion') || 'Spiritual Bouquet';

        // Counts
        const masses = searchParams.get('masses') || '0';
        const rosaries = searchParams.get('rosaries') || '0';
        const prayers = searchParams.get('prayers') || '0';
        const candles = searchParams.get('candles') || '0';

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
                        backgroundColor: '#0a1835', // Sacred Navy
                        backgroundImage: 'radial-gradient(circle at 50% 10%, #1e3a5f 0%, #0a1835 80%)',
                        fontFamily: 'serif',
                    }}
                >
                    {/* Border Frame */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        right: '20px',
                        bottom: '20px',
                        border: '2px solid #d4af37', // Gold
                        borderRadius: '20px',
                        display: 'flex',
                        opacity: 0.3,
                    }} />

                    {/* Icon */}
                    <div style={{
                        fontSize: 60,
                        marginBottom: 20,
                    }}>
                        🙏
                    </div>

                    <div style={{ color: '#d4af37', fontSize: 24, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 10 }}>
                        {occasion}
                    </div>

                    <div style={{ color: 'white', fontSize: 60, fontWeight: 'bold', marginBottom: 40, textAlign: 'center', maxWidth: '80%' }}>
                        For {recipient}
                    </div>

                    <div style={{ display: 'flex', gap: '40px', marginBottom: 50 }}>
                        {parseInt(masses) > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#eef5ff' }}>
                                <span style={{ fontSize: 48, fontWeight: 'bold' }}>{masses}</span>
                                <span style={{ fontSize: 20, opacity: 0.8 }}>Masses</span>
                            </div>
                        )}
                        {parseInt(rosaries) > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#eef5ff' }}>
                                <span style={{ fontSize: 48, fontWeight: 'bold' }}>{rosaries}</span>
                                <span style={{ fontSize: 20, opacity: 0.8 }}>Rosaries</span>
                            </div>
                        )}
                        {parseInt(prayers) > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#eef5ff' }}>
                                <span style={{ fontSize: 48, fontWeight: 'bold' }}>{prayers}</span>
                                <span style={{ fontSize: 20, opacity: 0.8 }}>Prayers</span>
                            </div>
                        )}
                        {parseInt(candles) > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#eef5ff' }}>
                                <span style={{ fontSize: 48, fontWeight: 'bold' }}>{candles}</span>
                                <span style={{ fontSize: 20, opacity: 0.8 }}>Candles</span>
                            </div>
                        )}
                    </div>

                    <div style={{ color: '#94a3b8', fontSize: 24, position: 'absolute', bottom: 50 }}>
                        With love from {sender}
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
