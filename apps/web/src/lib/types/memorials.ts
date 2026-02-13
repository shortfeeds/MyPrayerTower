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
}

export interface MemorialsResponse {
    items: Memorial[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
    };
}
