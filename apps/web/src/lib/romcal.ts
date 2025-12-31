/**
 * Romcal Service - Liturgical Calendar Integration
 * Provides Roman Catholic liturgical calendar data using romcal library
 */

// @ts-ignore - romcal types may not be available
import Romcal from 'romcal';

export interface LiturgicalCelebration {
    key: string;
    name: string;
    rank: string;
    rankName: string;
    color: string;
    colorHex: string;
    seasonKey: string;
    seasonName: string;
}

export interface LiturgicalDay {
    date: string;
    season: string;
    seasonKey: string;
    seasonColor: string;
    weekOfSeason: number;
    dayOfWeek: string;
    celebrations: LiturgicalCelebration[];
    isHolyDayOfObligation: boolean;
}

// Liturgical color hex mapping
const LITURGICAL_COLORS: Record<string, string> = {
    green: '#008000',
    white: '#FFFFFF',
    red: '#FF0000',
    purple: '#800080',
    violet: '#8B00FF',
    rose: '#FF007F',
    pink: '#FFC0CB',
    black: '#000000',
    gold: '#FFD700',
};

// Rank display names
const RANK_NAMES: Record<string, string> = {
    SOLEMNITY: 'Solemnity',
    FEAST: 'Feast',
    MEMORIAL: 'Memorial',
    OPT_MEMORIAL: 'Optional Memorial',
    COMMEMORATION: 'Commemoration',
    WEEKDAY: 'Weekday',
    SUNDAY: 'Sunday',
};

// Season display names
const SEASON_NAMES: Record<string, string> = {
    ADVENT: 'Advent',
    CHRISTMAS: 'Christmas',
    ORDINARY_TIME: 'Ordinary Time',
    LENT: 'Lent',
    PASCHAL_TRIDUUM: 'Paschal Triduum',
    EASTER: 'Easter',
};

// Season default colors
const SEASON_COLORS: Record<string, string> = {
    ADVENT: '#800080', // Purple
    CHRISTMAS: '#FFFFFF', // White
    ORDINARY_TIME: '#008000', // Green
    LENT: '#800080', // Purple
    PASCHAL_TRIDUUM: '#FF0000', // Red/White
    EASTER: '#FFFFFF', // White
};

/**
 * Get liturgical data for a specific date
 */
export async function getLiturgicalDay(date: Date): Promise<LiturgicalDay> {
    const year = date.getFullYear();

    // Generate calendar for the year
    const calendar = Romcal.calendarFor({
        year: year,
        country: 'unitedStates', // General Roman Calendar for USA
        type: 'calendar',
    });

    // Find the entry for the specific date
    const dateStr = formatDateKey(date);
    const dayData = calendar[dateStr];

    if (!dayData || dayData.length === 0) {
        // Fallback for dates not found
        return createFallbackDay(date);
    }

    // Get the highest ranking celebration
    const primaryCelebration = dayData[0];
    const seasonKey = primaryCelebration.season?.key || 'ORDINARY_TIME';

    const celebrations: LiturgicalCelebration[] = dayData.map((cel: any) => ({
        key: cel.key || '',
        name: cel.name || 'Unknown',
        rank: cel.rank || 'WEEKDAY',
        rankName: RANK_NAMES[cel.rank] || cel.rank || 'Weekday',
        color: cel.liturgicalColors?.[0] || 'green',
        colorHex: LITURGICAL_COLORS[cel.liturgicalColors?.[0]?.toLowerCase()] || '#008000',
        seasonKey: cel.season?.key || seasonKey,
        seasonName: SEASON_NAMES[cel.season?.key] || cel.season?.name || 'Ordinary Time',
    }));

    const primaryColor = celebrations[0]?.color?.toLowerCase() || 'green';

    return {
        date: dateStr,
        season: SEASON_NAMES[seasonKey] || 'Ordinary Time',
        seasonKey: seasonKey,
        seasonColor: LITURGICAL_COLORS[primaryColor] || SEASON_COLORS[seasonKey] || '#008000',
        weekOfSeason: primaryCelebration.calendar?.weekOfSeason || 1,
        dayOfWeek: getDayOfWeek(date),
        celebrations,
        isHolyDayOfObligation: primaryCelebration.isHolyDayOfObligation || false,
    };
}

/**
 * Get liturgical data for a date range
 */
export async function getLiturgicalRange(startDate: Date, endDate: Date): Promise<LiturgicalDay[]> {
    const days: LiturgicalDay[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
        const day = await getLiturgicalDay(new Date(current));
        days.push(day);
        current.setDate(current.getDate() + 1);
    }

    return days;
}

/**
 * Get today's celebrations
 */
export async function getTodaysCelebrations(): Promise<LiturgicalDay> {
    return getLiturgicalDay(new Date());
}

/**
 * Get the current liturgical season
 */
export async function getCurrentSeason(): Promise<{ season: string; color: string }> {
    const today = await getLiturgicalDay(new Date());
    return {
        season: today.season,
        color: today.seasonColor,
    };
}

/**
 * Format date to romcal key format (YYYY-MM-DD)
 */
function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get day of week name
 */
function getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

/**
 * Create fallback liturgical day for missing dates
 */
function createFallbackDay(date: Date): LiturgicalDay {
    const month = date.getMonth();
    let season = 'Ordinary Time';
    let seasonKey = 'ORDINARY_TIME';
    let color = '#008000';

    // Simple season detection based on month
    if (month === 11 && date.getDate() >= 1) {
        // December - likely Advent or Christmas
        if (date.getDate() < 25) {
            season = 'Advent';
            seasonKey = 'ADVENT';
            color = '#800080';
        } else {
            season = 'Christmas';
            seasonKey = 'CHRISTMAS';
            color = '#FFFFFF';
        }
    } else if (month === 0 && date.getDate() <= 13) {
        season = 'Christmas';
        seasonKey = 'CHRISTMAS';
        color = '#FFFFFF';
    }

    return {
        date: formatDateKey(date),
        season,
        seasonKey,
        seasonColor: color,
        weekOfSeason: 1,
        dayOfWeek: getDayOfWeek(date),
        celebrations: [{
            key: 'weekday',
            name: `${getDayOfWeek(date)} of ${season}`,
            rank: 'WEEKDAY',
            rankName: 'Weekday',
            color: color === '#FFFFFF' ? 'white' : color === '#800080' ? 'purple' : 'green',
            colorHex: color,
            seasonKey,
            seasonName: season,
        }],
        isHolyDayOfObligation: false,
    };
}

/**
 * Check if a celebration is a major feast (Solemnity or Feast)
 */
export function isMajorFeast(celebration: LiturgicalCelebration): boolean {
    return ['SOLEMNITY', 'FEAST'].includes(celebration.rank);
}

/**
 * Get feast rank badge styling
 */
export function getFeastRankStyle(rank: string): { bg: string; text: string } {
    switch (rank) {
        case 'SOLEMNITY':
            return { bg: 'bg-amber-100', text: 'text-amber-800' };
        case 'FEAST':
            return { bg: 'bg-purple-100', text: 'text-purple-800' };
        case 'MEMORIAL':
            return { bg: 'bg-blue-100', text: 'text-blue-800' };
        case 'OPT_MEMORIAL':
            return { bg: 'bg-gray-100', text: 'text-gray-600' };
        default:
            return { bg: 'bg-green-100', text: 'text-green-800' };
    }
}
