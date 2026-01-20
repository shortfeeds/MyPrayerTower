/**
 * Romcal Service - Liturgical Calendar Integration
 * Simple fallback implementation without external romcal dependency
 * to avoid webpack/hydration issues
 */

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
 * Calculate Easter Sunday for a given year using the Anonymous Gregorian algorithm
 */
function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month, day);
}

/**
 * Get liturgical season for a date
 */
function getLiturgicalSeason(date: Date): { season: string; seasonKey: string; color: string } {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Calculate Easter and related dates
    const easter = calculateEaster(year);
    const ashWednesday = new Date(easter);
    ashWednesday.setDate(easter.getDate() - 46);
    const palmSunday = new Date(easter);
    palmSunday.setDate(easter.getDate() - 7);
    const pentecost = new Date(easter);
    pentecost.setDate(easter.getDate() + 49);

    // Advent: 4 Sundays before Christmas (approximately Nov 27 - Dec 24)
    const christmas = new Date(year, 11, 25);
    const advent1 = new Date(christmas);
    advent1.setDate(christmas.getDate() - ((christmas.getDay() + 21) % 7 + 21));

    if (date >= advent1 && date < christmas) {
        return { season: 'Advent', seasonKey: 'ADVENT', color: SEASON_COLORS.ADVENT };
    }

    // Christmas: Dec 25 to Baptism of the Lord (Sunday after Jan 6 or Jan 7 if Jan 6 is Sunday)
    const jan6 = new Date(year, 0, 6);
    const baptism = new Date(year, 0, jan6.getDay() === 0 ? 7 : (6 + (7 - jan6.getDay())));

    if ((month === 11 && day >= 25) || (month === 0 && date <= baptism)) {
        return { season: 'Christmas', seasonKey: 'CHRISTMAS', color: SEASON_COLORS.CHRISTMAS };
    }

    // Lent: Ash Wednesday to Holy Thursday evening
    const holyThursday = new Date(easter);
    holyThursday.setDate(easter.getDate() - 3);

    if (date >= ashWednesday && date < holyThursday) {
        return { season: 'Lent', seasonKey: 'LENT', color: SEASON_COLORS.LENT };
    }

    // Paschal Triduum: Holy Thursday evening to Easter Vigil
    if (date >= holyThursday && date < easter) {
        return { season: 'Paschal Triduum', seasonKey: 'PASCHAL_TRIDUUM', color: SEASON_COLORS.PASCHAL_TRIDUUM };
    }

    // Easter: Easter Sunday to Pentecost
    if (date >= easter && date <= pentecost) {
        return { season: 'Easter', seasonKey: 'EASTER', color: SEASON_COLORS.EASTER };
    }

    // Default: Ordinary Time
    return { season: 'Ordinary Time', seasonKey: 'ORDINARY_TIME', color: SEASON_COLORS.ORDINARY_TIME };
}

/**
 * Format date to key format (YYYY-MM-DD)
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
 * Check if date is a Holy Day of Obligation (US)
 */
function isHolyDayOfObligation(date: Date): boolean {
    const month = date.getMonth();
    const day = date.getDate();
    const dayOfWeek = date.getDay();

    // Always obligatory
    const holyDays = [
        { month: 0, day: 1 },   // Mary Mother of God
        { month: 11, day: 25 }, // Christmas
    ];

    // Conditionally obligatory (when not on Saturday or Monday)
    const conditionalHolyDays = [
        { month: 7, day: 15 },  // Assumption
        { month: 10, day: 1 },  // All Saints
    ];

    if (holyDays.some((hd) => hd.month === month && hd.day === day)) {
        return true;
    }

    if (conditionalHolyDays.some((hd) => hd.month === month && hd.day === day)) {
        // Not obligatory if falls on Saturday or Monday (transferred)
        return dayOfWeek !== 1 && dayOfWeek !== 6;
    }

    // Immaculate Conception - Dec 8 (always obligatory in US)
    if (month === 11 && day === 8) {
        return true;
    }

    return false;
}

/**
 * Get liturgical data for a specific date
 */
export async function getLiturgicalDay(date: Date): Promise<LiturgicalDay> {
    const seasonInfo = getLiturgicalSeason(date);
    const dateStr = formatDateKey(date);
    const dayName = getDayOfWeek(date);

    // Calculate week of season (simplified)
    const weekOfSeason = Math.ceil(date.getDate() / 7);

    const celebrations: LiturgicalCelebration[] = [{
        key: 'weekday',
        name: `${dayName} of ${seasonInfo.season}`,
        rank: date.getDay() === 0 ? 'SUNDAY' : 'WEEKDAY',
        rankName: date.getDay() === 0 ? 'Sunday' : 'Weekday',
        color: seasonInfo.color === '#FFFFFF' ? 'white' : seasonInfo.color === '#800080' ? 'purple' : 'green',
        colorHex: seasonInfo.color,
        seasonKey: seasonInfo.seasonKey,
        seasonName: seasonInfo.season,
    }];

    return {
        date: dateStr,
        season: seasonInfo.season,
        seasonKey: seasonInfo.seasonKey,
        seasonColor: seasonInfo.color,
        weekOfSeason,
        dayOfWeek: dayName,
        celebrations,
        isHolyDayOfObligation: isHolyDayOfObligation(date),
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
