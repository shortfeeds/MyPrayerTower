/**
 * Web Push Notification Utilities
 * 
 * This module handles subscribing to and managing web push notifications.
 * Requires VAPID keys to be set in environment variables.
 */

// Check if push notifications are supported
export function isPushSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Check if notifications are granted
export async function getNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        return 'denied';
    }
    return Notification.permission;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    return permission;
}

// Get push subscription
export async function getPushSubscription(): Promise<PushSubscription | null> {
    if (!isPushSupported()) {
        return null;
    }

    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
    if (!isPushSupported()) {
        throw new Error('Push notifications not supported');
    }

    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
        throw new Error('Notification permission denied');
    }

    const registration = await navigator.serviceWorker.ready;

    // Get VAPID public key from environment
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
        console.warn('VAPID public key not set');
        return null;
    }

    // Convert VAPID key to Uint8Array
    const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
    });

    // Send subscription to server
    await saveSubscriptionToServer(subscription);

    return subscription;
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
    const subscription = await getPushSubscription();
    if (!subscription) {
        return true;
    }

    const success = await subscription.unsubscribe();

    if (success) {
        await removeSubscriptionFromServer(subscription);
    }

    return success;
}

// Save subscription to server
async function saveSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
        await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription.toJSON()),
        });
    } catch (error) {
        console.error('Failed to save push subscription:', error);
        throw error;
    }
}

// Remove subscription from server
async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
        await fetch('/api/notifications/unsubscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ endpoint: subscription.endpoint }),
        });
    } catch (error) {
        console.error('Failed to remove push subscription:', error);
    }
}

// Helper: Convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

// Show a local notification (for testing/fallback)
export function showLocalNotification(title: string, options?: NotificationOptions): void {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/icon.svg',
            badge: '/icon.svg',
            ...options,
        });
    }
}
