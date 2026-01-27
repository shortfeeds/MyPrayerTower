
import { getLiturgicalDay } from './romcal';

export interface LiturgyTheme {
    primary: string;
    secondary: string;
    accent: string;
    accentLight: string;
    glow: string;
}

export const LITURGY_THEMES: Record<string, LiturgyTheme> = {
    // Ordinary Time - Green
    green: {
        primary: '142 76% 20%', // sacred-800 equivalent
        secondary: '142 76% 35%',
        accent: '142 76% 60%',
        accentLight: '142 76% 90%',
        glow: 'rgba(0, 128, 0, 0.3)',
    },
    // Advent/Lent - Purple/Violet
    purple: {
        primary: '270 70% 20%',
        secondary: '270 70% 35%',
        accent: '270 70% 60%',
        accentLight: '270 70% 90%',
        glow: 'rgba(128, 0, 128, 0.3)',
    },
    // Christmas/Easter/Solemnities - White/Gold
    white: {
        primary: '45 100% 15%',
        secondary: '45 100% 25%',
        accent: '45 100% 60%', // Gold
        accentLight: '45 100% 90%',
        glow: 'rgba(255, 215, 0, 0.3)',
    },
    // Pentecost/Martyrs/Good Friday - Red
    red: {
        primary: '0 80% 20%',
        secondary: '0 80% 35%',
        accent: '0 80% 60%',
        accentLight: '0 80% 90%',
        glow: 'rgba(255, 0, 0, 0.3)',
    },
    // Gaudete/Laetare Sunday - Rose
    rose: {
        primary: '330 80% 25%',
        secondary: '330 80% 40%',
        accent: '330 80% 65%',
        accentLight: '330 80% 95%',
        glow: 'rgba(255, 0, 127, 0.3)',
    },
};

export async function getCurrentLiturgyTheme(): Promise<LiturgyTheme> {
    const day = await getLiturgicalDay(new Date());
    const color = day.seasonColor.toLowerCase() as keyof typeof LITURGY_THEMES;

    // Mapping romcal hex/names to our theme buckets
    if (day.seasonKey === 'ADVENT' || day.seasonKey === 'LENT') return LITURGY_THEMES.purple;
    if (day.seasonKey === 'CHRISTMAS' || day.seasonKey === 'EASTER') return LITURGY_THEMES.white;
    if (day.seasonKey === 'PASCHAL_TRIDUUM') return LITURGY_THEMES.red;

    // Default to green (Ordinary Time)
    return LITURGY_THEMES.green;
}
