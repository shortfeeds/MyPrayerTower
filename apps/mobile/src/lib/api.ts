const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

interface ApiOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    token?: string;
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, token } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message);
    }

    return response.json();
}

// Auth
export const authApi = {
    login: (email: string, password: string) =>
        apiRequest<{ accessToken: string; user: any }>('/auth/login', { method: 'POST', body: { email, password } }),

    register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
        apiRequest<{ accessToken: string; user: any }>('/auth/register', { method: 'POST', body: data }),
};

// Churches
export const churchesApi = {
    list: (params?: { page?: number; search?: string }) =>
        apiRequest<{ churches: any[]; total: number }>(`/churches?${new URLSearchParams(params as any)}`),

    nearby: (lat: number, lng: number, radius?: number) =>
        apiRequest<any[]>(`/churches/nearby?lat=${lat}&lng=${lng}&radius=${radius || 25}`),

    getById: (id: string) => apiRequest<any>(`/churches/${id}`),
};

// Prayer Wall
export const prayerWallApi = {
    list: (category?: string) =>
        apiRequest<{ prayers: any[] }>(`/prayer-wall${category ? `?category=${category}` : ''}`),

    submit: (data: { content: string; category: string; visibility: string }, token: string) =>
        apiRequest('/prayer-wall/submit', { method: 'POST', body: data, token }),

    pray: (id: string, token: string) =>
        apiRequest(`/prayer-wall/${id}/pray`, { method: 'POST', token }),
};

// Prayers Library
export const prayersApi = {
    getCategories: () => apiRequest<any[]>('/prayers/categories'),
    getBySlug: (slug: string) => apiRequest<any>(`/prayers/${slug}`),
};

// Saints
export const saintsApi = {
    getToday: () => apiRequest<any>('/saints/today'),
};
