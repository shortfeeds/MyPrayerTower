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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function getMemorials(page = 1, search = ''): Promise<MemorialsResponse> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
    });
    if (search) params.append('search', search);

    const res = await fetch(`${API_URL}/memorials?${params.toString()}`, {
        next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!res.ok) {
        throw new Error('Failed to fetch memorials');
    }

    return res.json();
}

export async function createMemorial(data: any) {
    const res = await fetch(`${API_URL}/memorials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Failed to create memorial');
    }

    return res.json();
}
