import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'myprayertower.db';

/**
 * Offline storage manager for prayers, churches, and user data
 */
class OfflineStorageManager {
    private db: SQLite.SQLiteDatabase | null = null;

    /**
     * Initialize the SQLite database
     */
    async initialize(): Promise<void> {
        this.db = await SQLite.openDatabaseAsync(DB_NAME);

        await this.db.execAsync(`
      -- Saved prayers
      CREATE TABLE IF NOT EXISTS saved_prayers (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        latin_title TEXT,
        saved_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      -- Saved churches
      CREATE TABLE IF NOT EXISTS saved_churches (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        address TEXT,
        city TEXT,
        country TEXT,
        latitude REAL,
        longitude REAL,
        mass_schedule TEXT,
        saved_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      -- Offline prayer requests (queued for sync)
      CREATE TABLE IF NOT EXISTS pending_prayers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        category TEXT,
        visibility TEXT DEFAULT 'public',
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      -- Daily readings cache
      CREATE TABLE IF NOT EXISTS daily_readings (
        date TEXT PRIMARY KEY,
        saint_name TEXT,
        saint_content TEXT,
        reading_content TEXT,
        cached_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      -- User preferences
      CREATE TABLE IF NOT EXISTS preferences (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
    }

    // ============ Saved Prayers ============

    async savePrayer(prayer: {
        id: string;
        title: string;
        content: string;
        category?: string;
        latinTitle?: string;
    }): Promise<void> {
        if (!this.db) return;

        await this.db.runAsync(
            `INSERT OR REPLACE INTO saved_prayers (id, title, content, category, latin_title) VALUES (?, ?, ?, ?, ?)`,
            [prayer.id, prayer.title, prayer.content, prayer.category || null, prayer.latinTitle || null]
        );
    }

    async removeSavedPrayer(id: string): Promise<void> {
        if (!this.db) return;
        await this.db.runAsync('DELETE FROM saved_prayers WHERE id = ?', [id]);
    }

    async getSavedPrayers(): Promise<any[]> {
        if (!this.db) return [];
        return await this.db.getAllAsync('SELECT * FROM saved_prayers ORDER BY saved_at DESC');
    }

    async isPrayerSaved(id: string): Promise<boolean> {
        if (!this.db) return false;
        const result = await this.db.getFirstAsync('SELECT id FROM saved_prayers WHERE id = ?', [id]);
        return !!result;
    }

    // ============ Saved Churches ============

    async saveChurch(church: {
        id: string;
        name: string;
        type?: string;
        address?: string;
        city?: string;
        country?: string;
        latitude?: number;
        longitude?: number;
        massSchedule?: any;
    }): Promise<void> {
        if (!this.db) return;

        await this.db.runAsync(
            `INSERT OR REPLACE INTO saved_churches (id, name, type, address, city, country, latitude, longitude, mass_schedule) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                church.id, church.name, church.type || null, church.address || null,
                church.city || null, church.country || null, church.latitude || null,
                church.longitude || null, JSON.stringify(church.massSchedule || null)
            ]
        );
    }

    async removeSavedChurch(id: string): Promise<void> {
        if (!this.db) return;
        await this.db.runAsync('DELETE FROM saved_churches WHERE id = ?', [id]);
    }

    async getSavedChurches(): Promise<any[]> {
        if (!this.db) return [];
        const results = await this.db.getAllAsync('SELECT * FROM saved_churches ORDER BY saved_at DESC');
        return results.map((r: any) => ({
            ...r,
            massSchedule: r.mass_schedule ? JSON.parse(r.mass_schedule) : null,
        }));
    }

    // ============ Pending Prayer Requests ============

    async queuePrayerRequest(content: string, category: string, visibility: string): Promise<void> {
        if (!this.db) return;

        await this.db.runAsync(
            'INSERT INTO pending_prayers (content, category, visibility) VALUES (?, ?, ?)',
            [content, category, visibility]
        );
    }

    async getPendingPrayerRequests(): Promise<any[]> {
        if (!this.db) return [];
        return await this.db.getAllAsync('SELECT * FROM pending_prayers ORDER BY created_at ASC');
    }

    async removePendingPrayerRequest(id: number): Promise<void> {
        if (!this.db) return;
        await this.db.runAsync('DELETE FROM pending_prayers WHERE id = ?', [id]);
    }

    // ============ Daily Readings Cache ============

    async cacheDailyReading(date: string, data: { saintName: string; saintContent: string; readingContent: string }): Promise<void> {
        if (!this.db) return;

        await this.db.runAsync(
            'INSERT OR REPLACE INTO daily_readings (date, saint_name, saint_content, reading_content) VALUES (?, ?, ?, ?)',
            [date, data.saintName, data.saintContent, data.readingContent]
        );
    }

    async getDailyReading(date: string): Promise<any | null> {
        if (!this.db) return null;
        return await this.db.getFirstAsync('SELECT * FROM daily_readings WHERE date = ?', [date]);
    }

    // ============ Preferences ============

    async setPreference(key: string, value: string): Promise<void> {
        if (!this.db) return;
        await this.db.runAsync('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', [key, value]);
    }

    async getPreference(key: string): Promise<string | null> {
        if (!this.db) return null;
        const result: any = await this.db.getFirstAsync('SELECT value FROM preferences WHERE key = ?', [key]);
        return result?.value || null;
    }

    // ============ Sync ============

    async syncPendingRequests(apiClient: any, token: string): Promise<number> {
        const pending = await this.getPendingPrayerRequests();
        let synced = 0;

        for (const request of pending) {
            try {
                await apiClient.submitPrayer({
                    content: request.content,
                    category: request.category,
                    visibility: request.visibility,
                }, token);

                await this.removePendingPrayerRequest(request.id);
                synced++;
            } catch (error) {
                console.error('Failed to sync prayer request:', error);
            }
        }

        return synced;
    }

    // ============ Storage Info ============

    async getStorageStats(): Promise<{ prayers: number; churches: number; pending: number }> {
        if (!this.db) return { prayers: 0, churches: 0, pending: 0 };

        const prayers: any = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM saved_prayers');
        const churches: any = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM saved_churches');
        const pending: any = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM pending_prayers');

        return {
            prayers: prayers?.count || 0,
            churches: churches?.count || 0,
            pending: pending?.count || 0,
        };
    }

    async clearAllData(): Promise<void> {
        if (!this.db) return;

        await this.db.execAsync(`
      DELETE FROM saved_prayers;
      DELETE FROM saved_churches;
      DELETE FROM pending_prayers;
      DELETE FROM daily_readings;
      DELETE FROM preferences;
    `);
    }
}

export const offlineStorage = new OfflineStorageManager();
