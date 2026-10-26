export interface MemorialGuestbookEntry {
    id: string;
    guestName?: string | null;
    message: string;
    createdAt: string;
}

export interface Memorial {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    deathDate?: string;
    biography?: string;
    photoUrl?: string;
    owner?: {
        displayName: string;
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    totalCandles: number;
    totalFlowers: number;
    totalPrayers?: number;
    tier?: 'BASIC' | 'PREMIUM';
    slug?: string;
    guestbook?: MemorialGuestbookEntry[];
}

export interface MemorialsResponse {
    items: Memorial[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}
