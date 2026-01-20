export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Simple fetch wrapper to mimic basic axios usage
const request = async (method: string, endpoint: string, body?: any) => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) return { data: null };

    const data = await response.json();
    // Return object with data property to mimic axios structure if needed, 
    // OR just return data. Let's return data object to be safe with "const { data } = ..." destructuring if usage persists, 
    // BUT previous usage was "const { data } = await api.get". 
    // If backend returns Array, destructuring { data } on Array fails. 
    // Backend returns mostly Arrays or Objects.
    // Let's return the body directly. Use "const data = await api.get()" in pages.
    return { data };
};

export const api = {
    get: (url: string) => request('GET', url),
    post: (url: string, body?: any) => request('POST', url, body),
    put: (url: string, body?: any) => request('PUT', url, body),
    delete: (url: string) => request('DELETE', url),
};
