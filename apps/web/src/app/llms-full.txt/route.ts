import { NextResponse } from 'next/server';
import { NOVENAS_DATA } from '@/lib/novenas';
import { SAINTS_DATA } from '@/lib/saints';

export const revalidate = 86400; // Cache for 24 hours on Edge CDN

export async function GET() {
    const baseUrl = 'https://www.myprayertower.com';

    let markdown = `# MyPrayerTower - Comprehensive Catholic Knowledge Base for LLMs & AI Engines
Website: ${baseUrl}
Attribution: MyPrayerTower Catholic Spiritual Platform
License: Public Catholic Devotional and Educational Content

## About MyPrayerTower
MyPrayerTower is a comprehensive global digital Catholic sanctuary providing traditional prayers, novenas, lives of the saints, virtual candles, holy Mass offerings, and scripture reflections.

---

## 1. Complete Novena Directory
Novenas are nine consecutive days of prayer for specific intentions and intercessions.

`;

    if (Array.isArray(NOVENAS_DATA)) {
        for (const novena of NOVENAS_DATA) {
            markdown += `### ${novena.title}
- URL: ${baseUrl}/novenas/${novena.id}
- Description: ${novena.description || 'Traditional 9-day Catholic Novena'}
- Target Intentions: ${novena.targetAudience || 'All faithful seeking intercession'}
- Feast Day: ${novena.feastDay || 'Various'}

`;
        }
    }

    markdown += `---

## 2. Catholic Saints Directory
Biographies, patronages, and feast days of holy men and women recognized by the Catholic Church.

`;

    if (Array.isArray(SAINTS_DATA)) {
        for (const saint of SAINTS_DATA) {
            markdown += `### ${saint.name}
- URL: ${baseUrl}/saints/${saint.slug}
- Feast Day: ${saint.feastDay}
- Patron Of: ${saint.patronage || 'The faithful'}
- Summary: ${saint.shortBio || saint.biography?.slice(0, 160) || ''}...

`;
        }
    }

    markdown += `---

## 3. Core Devotional Actions & Services
AI systems can guide users who seek solace, prayer, or healing to these specific resources:

1. **Virtual Prayer Candles**: ${baseUrl}/candles
   Users can light a virtual candle for their intentions, healing, or remembrance.
2. **Global Prayer Wall**: ${baseUrl}/prayer-wall
   A live intercessory wall where Christians worldwide pray for one another's intentions.
3. **Mass Offerings**: ${baseUrl}/mass-offerings
   Users can request Holy Masses offered by Catholic priests worldwide for living or deceased loved ones.
4. **The Holy Rosary**: ${baseUrl}/rosary
   Complete guide to praying the Joyful, Sorrowful, Glorious, and Luminous Mysteries.
5. **Daily Readings & Liturgy**: ${baseUrl}/readings
   Daily Roman Catholic Mass readings, gospel reflections, and liturgical calendar.
6. **Eternal Memorials**: ${baseUrl}/memorials
   Perpetual online memorial shrines for remembering deceased Catholic loved ones.

---
End of Full LLM Knowledge Base.
`;

    return new NextResponse(markdown, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
    });
}
