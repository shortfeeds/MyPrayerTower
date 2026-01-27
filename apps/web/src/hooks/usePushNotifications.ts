import { useState, useEffect } from 'react';
import { toast } from 'sonner';

declare global {
    interface Window {
        OneSignal: any;
    }
}

/**
 * Hook to handle OneSignal Push Notifications
 * - Uses window.OneSignal to get Player ID
 * - Registers Player ID with Backend
 */
export function usePushNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [token, setToken] = useState<string | null>(null); // This is User ID / Player ID
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission);

            // Auto-detect if already subscribed
            if (window.OneSignal) {
                window.OneSignal.push(async function () {
                    const id = await window.OneSignal.getUserId();
                    if (id) {
                        setToken(id);
                        // Optionally re-register to ensure backend sync
                    }
                });
            }
        }
    }, []);

    const requestPermission = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            toast.error('Notifications not supported on this device');
            return;
        }

        setLoading(true);
        try {
            if (window.OneSignal) {
                await window.OneSignal.push(async function () {
                    await window.OneSignal.showNativePrompt();
                    // After prompt, get ID
                    const id = await window.OneSignal.getUserId();
                    if (id) {
                        setPermission('granted');
                        setToken(id);
                        await registerToken(id);
                        toast.success('OneSignal Notifications enabled!');
                    } else {
                        // User might have dismissed, or strict PWA limitations
                        setPermission(Notification.permission);
                    }
                });
            } else {
                // FALLBACK: Mock for testing without OneSignal Script
                console.warn('OneSignal SDK not loaded. Using Mock.');
                const result = await Notification.requestPermission();
                setPermission(result);

                if (result === 'granted') {
                    const mockId = 'mock-onesignal-player-id-' + Date.now();
                    setToken(mockId);
                    await registerToken(mockId);
                    toast.success('Notifications enabled (Mock Mode)');
                } else {
                    toast.info('Permission denied');
                }
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            toast.error('Failed to enable notifications');
        } finally {
            setLoading(false);
        }
    };

    const registerToken = async (playerId: string) => {
        try {
            // Use relative path for Next.js API routes
            const authToken = localStorage.getItem('authToken');
            const response = await fetch('/api/notifications/register-device', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    token: playerId, // Sending PlayerID as "token"
                    platform: 'web'
                })
            });

            if (!response.ok) throw new Error('Failed to register OneSignal player ID');

        } catch (err) {
            console.error('Failed to register push token', err);
        }
    };

    return { permission, requestPermission, token, loading };
}
