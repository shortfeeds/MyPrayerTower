import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Heart, BookOpen, Bell, ChevronRight, Check } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to\nMyPrayerTower',
        subtitle: 'Your spiritual journey starts here',
        icon: '🙏',
        color: ['#0c4a6e', '#0369a1'],
    },
    {
        id: 'churches',
        title: 'Find Churches\nNear You',
        subtitle: '50,000+ Catholic churches worldwide with Mass times and directions',
        icon: MapPin,
        color: ['#0891b2', '#0e7490'],
    },
    {
        id: 'prayers',
        title: 'Join the\nPrayer Community',
        subtitle: 'Share intentions, pray for others, and celebrate answered prayers',
        icon: Heart,
        color: ['#7c3aed', '#6d28d9'],
    },
    {
        id: 'library',
        title: '2,000+ Prayers\nAt Your Fingertips',
        subtitle: 'Traditional and contemporary Catholic prayers for every occasion',
        icon: BookOpen,
        color: ['#059669', '#047857'],
    },
    {
        id: 'notifications',
        title: 'Stay Connected',
        subtitle: 'Get daily prayer reminders and updates when people pray for you',
        icon: Bell,
        color: ['#d97706', '#b45309'],
        askPermission: true,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const step = ONBOARDING_STEPS[currentStep];
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
    const Icon = typeof step.icon === 'string' ? null : step.icon;

    const handleNext = () => {
        if (isLastStep) {
            // Complete onboarding
            router.replace('/(tabs)');
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    const handleEnableNotifications = async () => {
        // TODO: Request notification permissions
        setNotificationsEnabled(true);
    };

    return (
        <LinearGradient colors={step.color as any} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Skip Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <Animated.View
                    key={step.id}
                    entering={FadeInRight.duration(300)}
                    exiting={FadeOutLeft.duration(200)}
                    style={styles.content}
                >
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        {Icon ? (
                            <Icon color="#fff" size={80} strokeWidth={1.5} />
                        ) : (
                            <Text style={styles.emoji}>{step.icon}</Text>
                        )}
                    </View>

                    {/* Text */}
                    <Text style={styles.title}>{step.title}</Text>
                    <Text style={styles.subtitle}>{step.subtitle}</Text>

                    {/* Notification Permission */}
                    {step.askPermission && (
                        <TouchableOpacity
                            style={[
                                styles.permissionButton,
                                notificationsEnabled && styles.permissionButtonEnabled,
                            ]}
                            onPress={handleEnableNotifications}
                            disabled={notificationsEnabled}
                        >
                            {notificationsEnabled ? (
                                <>
                                    <Check color="#fff" size={20} />
                                    <Text style={styles.permissionButtonText}>Notifications Enabled</Text>
                                </>
                            ) : (
                                <>
                                    <Bell color="#fff" size={20} />
                                    <Text style={styles.permissionButtonText}>Enable Notifications</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}
                </Animated.View>

                {/* Pagination */}
                <View style={styles.pagination}>
                    {ONBOARDING_STEPS.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === currentStep && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* Button */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>
                            {isLastStep ? 'Get Started' : 'Continue'}
                        </Text>
                        <ChevronRight color="#0c4a6e" size={20} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    skipText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        fontWeight: '500',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    emoji: { fontSize: 80 },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 44,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 26,
    },
    permissionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 50,
        marginTop: 30,
    },
    permissionButtonEnabled: {
        backgroundColor: 'rgba(34,197,94,0.8)',
    },
    permissionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 30,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dotActive: {
        width: 24,
        backgroundColor: '#fff',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        paddingVertical: 18,
        borderRadius: 16,
    },
    buttonText: {
        color: '#0c4a6e',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
