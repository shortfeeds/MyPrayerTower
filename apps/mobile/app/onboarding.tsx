import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Heart, BookOpen, Bell, ChevronRight, Check, Sparkles, Calendar, Cross, Church } from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import * as Notifications from 'expo-notifications';

const { width } = Dimensions.get('window');

// Personalization options for step 2
const PERSONALIZATION_OPTIONS = [
    { id: 'habit', label: 'Build a daily prayer habit', icon: Calendar },
    { id: 'prayers', label: 'Find prayers for specific needs', icon: BookOpen },
    { id: 'confession', label: 'Prepare for Confession', icon: Cross },
    { id: 'church', label: 'Find a church near me', icon: Church },
    { id: 'scripture', label: 'Read daily scripture', icon: BookOpen },
    { id: 'community', label: 'Join a prayer community', icon: Heart },
];

const ONBOARDING_STEPS = [
    {
        id: 'welcome',
        title: 'Draw Closer to God,\nOne Prayer at a Time',
        subtitle: 'Your Catholic faith companion for daily prayers, Mass readings, and a global prayer community.',
        icon: '✝️',
        color: ['#1e3a5f', '#152a47'],
    },
    {
        id: 'personalize',
        title: 'What Brings\nYou Here?',
        subtitle: 'Help us personalize your experience by selecting what matters most to you.',
        icon: Sparkles,
        color: ['#0c4a6e', '#0369a1'],
        isPersonalization: true,
    },
    {
        id: 'churches',
        title: 'Find Churches\nNear You',
        subtitle: '50,000+ Catholic churches worldwide with Mass times, confession schedules, and directions.',
        icon: MapPin,
        color: ['#0891b2', '#0e7490'],
    },
    {
        id: 'prayers',
        title: 'Join the\nPrayer Community',
        subtitle: 'Share intentions, pray for others, and celebrate answered prayers together.',
        icon: Heart,
        color: ['#7c3aed', '#6d28d9'],
    },
    {
        id: 'library',
        title: '2,000+ Prayers\nAt Your Fingertips',
        subtitle: 'Traditional and contemporary Catholic prayers for every occasion and need.',
        icon: BookOpen,
        color: ['#059669', '#047857'],
    },
    {
        id: 'notifications',
        title: 'Stay Connected\nIn Prayer',
        subtitle: 'Get gentle prayer reminders and updates when the community prays for you.',
        icon: Bell,
        color: ['#d97706', '#b45309'],
        askPermission: true,
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const step = ONBOARDING_STEPS[currentStep];
    const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;
    const Icon = typeof step.icon === 'string' ? null : step.icon;

    const handleNext = () => {
        if (isLastStep) {
            // Complete onboarding - save preferences
            router.replace('/(tabs)');
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    const handleEnableNotifications = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status === 'granted') {
                setNotificationsEnabled(true);
            }
        } catch (error) {
            console.error('Error requesting notification permissions:', error);
        }
    };

    const toggleGoal = (goalId: string) => {
        setSelectedGoals(prev =>
            prev.includes(goalId)
                ? prev.filter(id => id !== goalId)
                : [...prev, goalId]
        );
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

                    {/* Personalization Options */}
                    {step.isPersonalization && (
                        <ScrollView
                            style={styles.optionsContainer}
                            contentContainerStyle={styles.optionsContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {PERSONALIZATION_OPTIONS.map((option) => {
                                const OptionIcon = option.icon;
                                const isSelected = selectedGoals.includes(option.id);
                                return (
                                    <TouchableOpacity
                                        key={option.id}
                                        style={[
                                            styles.optionButton,
                                            isSelected && styles.optionButtonSelected,
                                        ]}
                                        onPress={() => toggleGoal(option.id)}
                                    >
                                        <OptionIcon
                                            color={isSelected ? '#fff' : 'rgba(255,255,255,0.7)'}
                                            size={20}
                                        />
                                        <Text style={[
                                            styles.optionText,
                                            isSelected && styles.optionTextSelected,
                                        ]}>
                                            {option.label}
                                        </Text>
                                        {isSelected && (
                                            <View style={styles.checkContainer}>
                                                <Check color="#fff" size={16} />
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}

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
                        <ChevronRight color="#1e3a5f" size={20} />
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
        paddingHorizontal: 30,
    },
    iconContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    emoji: { fontSize: 70 },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    optionsContainer: {
        maxHeight: 280,
        marginTop: 24,
        width: '100%',
    },
    optionsContent: {
        gap: 10,
        paddingBottom: 10,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    optionButtonSelected: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderColor: 'rgba(255,255,255,0.5)',
    },
    optionText: {
        flex: 1,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        fontWeight: '500',
    },
    optionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    checkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(34,197,94,0.8)',
        alignItems: 'center',
        justifyContent: 'center',
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    buttonText: {
        color: '#1e3a5f',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
