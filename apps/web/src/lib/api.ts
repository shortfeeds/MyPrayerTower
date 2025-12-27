// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// Types
export interface Prayer {
    id: string;
    title: string;
    slug: string;
    content: string;
    source?: string;
    author?: string;
    latinTitle?: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    viewCount: number;
    isPublished: boolean;
}

export interface PrayerCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    iconName?: string;
    prayerCount?: number;
}

export interface Church {
    id: string;
    name: string;
    slug: string;
    type: string;
    address?: string;
    city?: string;
    country?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    website?: string;
    email?: string;
    description?: string;
    isVerified: boolean;
    rating?: number;
}

export interface Saint {
    id: string;
    name: string;
    slug: string;
    title?: string;
    feastDay?: string;
    feastMonth?: number;
    feastDayOfMonth?: number;
    biography?: string;
    patronOf?: string[];
    imageUrl?: string;
}

// API Functions
async function fetchAPI<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}

// Prayers API
export async function getPrayerCategories(): Promise<PrayerCategory[]> {
    return fetchAPI<PrayerCategory[]>('/prayers/categories');
}

export async function getPrayer(slug: string): Promise<Prayer> {
    return fetchAPI<Prayer>(`/prayers/${slug}`);
}

export async function getPrayersByCategory(categorySlug: string, page = 1, limit = 20): Promise<{ prayers: Prayer[]; total: number }> {
    return fetchAPI<{ prayers: Prayer[]; total: number }>(`/prayers/category/${categorySlug}?page=${page}&limit=${limit}`);
}

export async function searchPrayers(query: string, limit = 20): Promise<Prayer[]> {
    return fetchAPI<Prayer[]>(`/prayers/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

// Churches API
export async function getChurches(params?: { city?: string; country?: string; limit?: number }): Promise<Church[]> {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.set('city', params.city);
    if (params?.country) searchParams.set('country', params.country);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return fetchAPI<Church[]>(`/churches${query ? `?${query}` : ''}`);
}

export async function getChurch(idOrSlug: string): Promise<Church> {
    return fetchAPI<Church>(`/churches/${idOrSlug}`);
}

export async function searchChurches(query: string, limit = 20): Promise<Church[]> {
    return fetchAPI<Church[]>(`/churches/search?q=${encodeURIComponent(query)}&limit=${limit}`);
}

// Saints API
export async function getSaints(params?: { month?: number; limit?: number }): Promise<Saint[]> {
    const searchParams = new URLSearchParams();
    if (params?.month) searchParams.set('month', params.month.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return fetchAPI<Saint[]>(`/saints${query ? `?${query}` : ''}`);
}

export async function getSaint(idOrSlug: string): Promise<Saint> {
    return fetchAPI<Saint>(`/saints/${idOrSlug}`);
}

export async function getTodaysSaints(): Promise<Saint[]> {
    return fetchAPI<Saint[]>('/saints/today');
}
