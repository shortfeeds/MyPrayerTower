import { NextResponse } from 'next/server';

export async function GET() {
    // Mock settings data - in future this would come from DB
    const settings = {
        prices: {
            subscription: {
                plusMonthly: 499,
                plusYearly: 4999,
                premiumMonthly: 999,
                premiumYearly: 9999,
                lifetime: 29999
            },
            candles: {
                oneDay: 500,
                threeDay: 1000,
                sevenDay: 2000,
                thirtyDay: 5000
            },
            masses: {
                regular: 1500,
                expedited: 2500,
                novena: 10000,
                gregorian: 50000,
                perpetual: 100000
            },
            bouquets: {
                base: 500,
                massAddOn: 1500,
                candleAddOn: 500
            }
        },
        features: {
            enablePrayerWall: true,
            enableCandles: true,
            enableMasses: true,
            maintenanceMode: false
        }
    };

    return NextResponse.json({ settings });
}
