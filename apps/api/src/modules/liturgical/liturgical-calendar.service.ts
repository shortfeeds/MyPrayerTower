import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

export interface LiturgicalDay {
    date: string;
    season: string;
    season_week: number;
    weekday: string;
    celebrations: {
        title: string;
        colour: string;
        rank: string;
        rank_num: number;
    }[];
}

@Injectable()
export class LiturgicalCalendarService {
    private readonly logger = new Logger(LiturgicalCalendarService.name);

    // Public Liturgical Calendar API
    private readonly API_BASE = 'https://litcal.johnromanodorazio.com/api/v3/LitCalEngine.php';

    constructor(private prisma: PrismaService) { }

    async getLiturgicalDay(date: Date, locale = 'en'): Promise<LiturgicalDay | null> {
        try {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const params = new URLSearchParams({
                year: year.toString(),
                locale,
                calendartype: 'civil',
                returntype: 'JSON',
            });

            const response = await fetch(`${this.API_BASE}?${params}`);
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const data = await response.json();

            // Find the specific date in the response
            const dateKey = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
            const dayData = data.LitCal?.[dateKey];

            if (!dayData) return null;

            return {
                date: dateKey,
                season: dayData.season || 'Ordinary Time',
                season_week: dayData.season_week || 0,
                weekday: dayData.weekday || '',
                celebrations: dayData.celebrations || [],
            };
        } catch (error) {
            this.logger.error('Failed to fetch liturgical data:', error);
            return null;
        }
    }

    async getTodaysLiturgy() {
        return this.getLiturgicalDay(new Date());
    }

    async getWeekLiturgy(startDate: Date = new Date()) {
        const week: (LiturgicalDay | null)[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            week.push(await this.getLiturgicalDay(date));
        }
        return week;
    }

    // Get feast days for a month
    async getMonthFeastDays(year: number, month: number) {
        try {
            const params = new URLSearchParams({
                year: year.toString(),
                locale: 'en',
                calendartype: 'civil',
                returntype: 'JSON',
            });

            const response = await fetch(`${this.API_BASE}?${params}`);
            if (!response.ok) throw new Error(`API returned ${response.status}`);

            const data = await response.json();
            const feastDays: any[] = [];

            // Filter for the specific month
            Object.entries(data.LitCal || {}).forEach(([dateKey, dayData]: [string, any]) => {
                const dateMonth = parseInt(dateKey.substring(4, 6));
                if (dateMonth === month) {
                    // Only include significant celebrations (rank <= 4)
                    const significantCelebrations = (dayData.celebrations || []).filter(
                        (c: any) => c.rank_num <= 4
                    );
                    if (significantCelebrations.length > 0) {
                        feastDays.push({
                            date: dateKey,
                            celebrations: significantCelebrations,
                            season: dayData.season,
                        });
                    }
                }
            });

            return feastDays;
        } catch (error) {
            this.logger.error('Failed to fetch month feast days:', error);
            return [];
        }
    }

    // Sync upcoming feast days to create automatic church events
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async syncFeastDaysToEvents() {
        this.logger.log('Syncing feast days...');

        const now = new Date();
        const feastDays = await this.getMonthFeastDays(now.getFullYear(), now.getMonth() + 1);

        this.logger.log(`Found ${feastDays.length} significant feast days this month`);

        // In a full implementation, this would create ChurchEvent records
        // for important feast days
    }
}
