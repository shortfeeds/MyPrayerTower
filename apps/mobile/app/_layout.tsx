import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="church/[id]" options={{ presentation: 'card' }} />
                <Stack.Screen name="prayer/[id]" options={{ presentation: 'card' }} />
                <Stack.Screen name="login" options={{ presentation: 'modal' }} />
                <Stack.Screen name="register" options={{ presentation: 'modal' }} />
            </Stack>
        </SafeAreaProvider>
    );
}
