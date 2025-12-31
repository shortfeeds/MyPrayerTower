import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MapPin, Heart, BookOpen, Star, Flame, Calendar, ChevronRight, Sun, Moon } from 'lucide-react-native';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');

// Get time-based greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun, color: '#f59e0b' };
    if (hour < 17) return { text: 'Good Afternoon', icon: Sun, color: '#f97316' };
    if (hour < 21) return { text: 'Good Evening', icon: Moon, color: '#6366f1' };
    return { text: 'Good Night', icon: Moon, color: '#3b82f6' };
}

export default function HomeScreen() {
    const router = useRouter();
    const greeting = getGreeting();
    const GreetingIcon = greeting.icon;

    // Mock data - replace with actual API calls
    const [streak, setStreak] = useState({ current: 7, prayedToday: true });
    // In real app, fetch these from API
    const [saint, setSaint] = useState({ name: 'St. Thomas Becket', feastDay: 'December 29', title: 'Archbishop & Martyr' });
    const [reading, setReading] = useState({ title: 'The Holy Family', reference: 'Luke 2:22-40' });

    const features = [
        { icon: MapPin, title: 'Find Churches', subtitle: '50,000+ worldwide', route: '/churches', color: '#0ea5e9' },
        { icon: Heart, title: 'Prayer Wall', subtitle: 'Join the community', route: '/prayer-wall', color: '#ec4899' },
        { icon: BookOpen, title: 'Prayer Library', subtitle: '2,000+ prayers', route: '/prayers', color: '#10b981' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Personalized Hero */}
                <LinearGradient
                    colors={['#0c4a6e', '#0369a1', '#0284c7']}
                    style={styles.hero}
                >
                    {/* Top Bar with Greeting and Streak */}
                    <View style={styles.heroHeader}>
                        <View>
                            <View style={styles.greetingRow}>
                                <GreetingIcon color={greeting.color} size={16} />
                                <Text style={styles.greetingText}>{greeting.text}</Text>
                            </View>
                            <Text style={styles.heroTitle}>Ronald</Text>
                        </View>

                        {/* Prayer Streak Badge */}
                        <TouchableOpacity
                            style={[styles.streakBadge, streak.prayedToday && styles.streakBadgeActive]}
                            onPress={() => router.push('/profile')}
                        >
                            <Flame
                                color={streak.prayedToday ? '#fff' : '#f59e0b'}
                                size={18}
                                fill={streak.prayedToday ? '#fff' : 'transparent'}
                            />
                            <Text style={[styles.streakNumber, streak.prayedToday && styles.streakNumberActive]}>
                                {streak.current}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Daily Quote */}
                    <View style={styles.quoteCard}>
                        <Text style={styles.quoteText}>
                            "The Lord is my shepherd; I shall not want."
                        </Text>
                        <Text style={styles.quoteSource}>— Psalm 23:1</Text>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => router.push('/rosary')}
                        >
                            <Heart color="#fff" size={24} />
                            <Text style={styles.quickActionText}>Rosary</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => router.push('/confession')}
                        >
                            <Text style={{ fontSize: 24 }}>🛐</Text>
                            <Text style={styles.quickActionText}>Confession</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => router.push('/churches')}
                        >
                            <MapPin color="#fff" size={24} />
                            <Text style={styles.quickActionText}>Mass</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Today's Highlights Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Today's Highlights</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingRight: 20 }}>

                        {/* Today's Reading Card */}
                        <TouchableOpacity
                            style={styles.highlightCard}
                            onPress={() => router.push('/readings')}
                        >
                            <LinearGradient
                                colors={['#059669', '#047857']}
                                style={styles.highlightGradient}
                            >
                                <View style={styles.highlightHeader}>
                                    <View style={styles.iconBox}>
                                        <BookOpen color="#fff" size={16} />
                                    </View>
                                    <Text style={styles.highlightLabel}>Daily Reading</Text>
                                </View>
                                <Text style={styles.highlightTitle} numberOfLines={2}>
                                    {reading.title}
                                </Text>
                                <Text style={styles.highlightSubtitle}>{reading.reference}</Text>
                                <View style={styles.highlightFooter}>
                                    <Text style={styles.highlightAction}>Read Gospel</Text>
                                    <ChevronRight color="#fff" size={16} />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Saint of the Day Card */}
                        <TouchableOpacity
                            style={styles.highlightCard}
                            onPress={() => router.push('/saints')}
                        >
                            <LinearGradient
                                colors={['#7c3aed', '#6d28d9']}
                                style={styles.highlightGradient}
                            >
                                <View style={styles.highlightHeader}>
                                    <View style={[styles.iconBox, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                        <Star color="#fbbf24" size={16} fill="#fbbf24" />
                                    </View>
                                    <Text style={styles.highlightLabel}>Saint of Day</Text>
                                </View>
                                <Text style={styles.highlightTitle} numberOfLines={2}>
                                    {saint.name}
                                </Text>
                                <Text style={styles.highlightSubtitle}>{saint.title}</Text>
                                <View style={styles.highlightFooter}>
                                    <Text style={styles.highlightAction}>Read Bio</Text>
                                    <ChevronRight color="#fff" size={16} />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* Explore Features */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Explore</Text>
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.featureCard}
                            onPress={() => router.push(feature.route as any)}
                        >
                            <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                                <feature.icon color={feature.color} size={24} />
                            </View>
                            <View style={styles.featureContent}>
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                            </View>
                            <ChevronRight color="#9ca3af" size={20} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Prayer Wall Preview */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>🙏 Prayer Wall</Text>
                        <TouchableOpacity onPress={() => router.push('/prayer-wall')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.prayerCard}>
                        <Text style={styles.prayerText}>
                            "Please pray for my mother's surgery tomorrow..."
                        </Text>
                        <View style={styles.prayerMeta}>
                            <Text style={styles.prayerAuthor}>Maria S. • Health</Text>
                            <TouchableOpacity style={styles.prayButton}>
                                <Text style={styles.prayButtonText}>🙏 127</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bottom padding */}
                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    hero: {
        padding: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    greetingText: {
        fontSize: 13,
        color: '#bae6fd',
    },
    heroTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    streakBadgeActive: {
        backgroundColor: '#f59e0b',
    },
    streakNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f59e0b',
    },
    streakNumberActive: {
        color: '#fff',
    },
    quoteCard: {
        backgroundColor: 'rgba(251, 191, 36, 0.15)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.25)',
        marginBottom: 20,
    },
    quoteText: {
        fontSize: 16,
        color: '#fff',
        fontStyle: 'italic',
        lineHeight: 24,
    },
    quoteSource: {
        fontSize: 13,
        color: '#fbbf24',
        marginTop: 8,
        fontWeight: '600',
    },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quickAction: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        minWidth: (width - 60) / 4,
    },
    quickActionText: {
        color: '#fff',
        fontSize: 11,
        marginTop: 6,
        fontWeight: '500',
    },
    // New Highlight Card Styles
    highlightCard: {
        width: width * 0.7,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 8,
    },
    highlightGradient: {
        padding: 20,
        height: 180,
        justifyContent: 'space-between',
    },
    highlightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    highlightLabel: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    highlightTitle: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 28,
        marginTop: 10,
    },
    highlightSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 4,
    },
    highlightFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 'auto',
    },
    highlightAction: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },

    // Stats removed, existing styles below
    section: {
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    seeAll: {
        fontSize: 14,
        color: '#0ea5e9',
        fontWeight: '500',
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureContent: {
        flex: 1,
        marginLeft: 12,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    featureSubtitle: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    prayerCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    prayerText: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 22,
        marginBottom: 12,
    },
    prayerMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    prayerAuthor: {
        fontSize: 13,
        color: '#6b7280',
    },
    prayButton: {
        backgroundColor: '#f59e0b',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
    },
    prayButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});
