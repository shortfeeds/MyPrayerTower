import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MapPin, Heart, BookOpen, Star, Users, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();

    const features = [
        { icon: MapPin, title: 'Find Churches', subtitle: '50,000+ worldwide', route: '/churches', color: '#0ea5e9' },
        { icon: Heart, title: 'Prayer Wall', subtitle: 'Join the community', route: '/prayer-wall', color: '#f59e0b' },
        { icon: BookOpen, title: 'Prayers', subtitle: '2,000+ prayers', route: '/prayers', color: '#10b981' },
        { icon: Star, title: 'Saints', subtitle: 'Daily inspiration', route: '/saints', color: '#8b5cf6' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <LinearGradient
                    colors={['#0c4a6e', '#0369a1']}
                    style={styles.hero}
                >
                    <Text style={styles.heroTitle}>MyPrayerTower</Text>
                    <Text style={styles.heroSubtitle}>
                        Your spiritual journey, one platform
                    </Text>
                    <TouchableOpacity
                        style={styles.heroButton}
                        onPress={() => router.push('/churches')}
                    >
                        <MapPin color="#0c4a6e" size={18} />
                        <Text style={styles.heroButtonText}>Find Churches Near Me</Text>
                    </TouchableOpacity>
                </LinearGradient>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>50K+</Text>
                        <Text style={styles.statLabel}>Churches</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>2K+</Text>
                        <Text style={styles.statLabel}>Prayers</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>150+</Text>
                        <Text style={styles.statLabel}>Countries</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statNumber}>1M+</Text>
                        <Text style={styles.statLabel}>Users</Text>
                    </View>
                </View>

                {/* Features */}
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
        padding: 24,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#bae6fd',
        marginBottom: 20,
        textAlign: 'center',
    },
    heroButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fbbf24',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 50,
        gap: 8,
    },
    heroButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0c4a6e',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0ea5e9',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
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
        fontSize: 20,
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
        marginBottom: 12,
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
        backgroundColor: '#fbbf24',
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
