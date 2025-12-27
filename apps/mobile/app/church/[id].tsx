import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Phone, Globe, Clock, ChevronLeft, Share2, Heart, CheckCircle, Calendar } from 'lucide-react-native';
import { useState } from 'react';

// Mock data - would come from API
const church = {
    id: '1',
    name: "St. Patrick's Cathedral",
    type: 'Cathedral',
    address: '460 Madison Ave, New York, NY 10022',
    phone: '+1 (212) 753-2261',
    website: 'https://saintpatrickscathedral.org',
    isVerified: true,
    rating: 4.8,
    description: "St. Patrick's Cathedral is a decorated Neo-Gothic-style Roman Catholic cathedral in the Midtown Manhattan neighborhood.",
    massSchedule: {
        weekday: ['7:00 AM', '8:00 AM', '12:00 PM', '5:30 PM'],
        saturday: ['8:00 AM', '12:00 PM', '5:30 PM'],
        sunday: ['7:00 AM', '9:00 AM', '10:15 AM', '12:00 PM', '5:30 PM'],
    },
};

export default function ChurchDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);

    const openMaps = () => {
        Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(church.address)}`);
    };

    const openPhone = () => {
        Linking.openURL(`tel:${church.phone}`);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color="#fff" size={24} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={styles.headerButton}>
                        <Heart color="#fff" size={22} fill={isSaved ? '#fff' : 'none'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <Share2 color="#fff" size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.badges}>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeBadgeText}>{church.type}</Text>
                        </View>
                        {church.isVerified && (
                            <View style={styles.verifiedBadge}>
                                <CheckCircle color="#fff" size={14} />
                                <Text style={styles.verifiedText}>Verified</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.churchName}>{church.name}</Text>
                    <View style={styles.location}>
                        <MapPin color="#bae6fd" size={16} />
                        <Text style={styles.locationText}>{church.address}</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.actionButton} onPress={openMaps}>
                        <MapPin color="#0ea5e9" size={22} />
                        <Text style={styles.actionText}>Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={openPhone}>
                        <Phone color="#0ea5e9" size={22} />
                        <Text style={styles.actionText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(church.website)}>
                        <Globe color="#0ea5e9" size={22} />
                        <Text style={styles.actionText}>Website</Text>
                    </TouchableOpacity>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <Text style={styles.description}>{church.description}</Text>
                </View>

                {/* Mass Schedule */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Clock color="#0ea5e9" size={20} />
                        <Text style={styles.sectionTitle}>Mass Schedule</Text>
                    </View>

                    <View style={styles.scheduleGroup}>
                        <Text style={styles.scheduleLabel}>Weekdays</Text>
                        <View style={styles.timesRow}>
                            {church.massSchedule.weekday.map((time, i) => (
                                <View key={i} style={styles.timeChip}>
                                    <Text style={styles.timeText}>{time}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.scheduleGroup}>
                        <Text style={styles.scheduleLabel}>Saturday</Text>
                        <View style={styles.timesRow}>
                            {church.massSchedule.saturday.map((time, i) => (
                                <View key={i} style={styles.timeChip}>
                                    <Text style={styles.timeText}>{time}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.scheduleGroup}>
                        <Text style={styles.scheduleLabel}>Sunday</Text>
                        <View style={styles.timesRow}>
                            {church.massSchedule.sunday.map((time, i) => (
                                <View key={i} style={[styles.timeChip, styles.sundayChip]}>
                                    <Text style={[styles.timeText, styles.sundayText]}>{time}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Claim Section */}
                {!church.isVerified && (
                    <View style={styles.claimSection}>
                        <Text style={styles.claimTitle}>Is this your church?</Text>
                        <Text style={styles.claimDesc}>Claim this listing to manage your profile</Text>
                        <TouchableOpacity style={styles.claimButton}>
                            <Text style={styles.claimButtonText}>Claim Church</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40, height: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActions: { flexDirection: 'row', gap: 8 },
    headerButton: {
        width: 40, height: 40,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    hero: {
        backgroundColor: '#0c4a6e',
        paddingTop: 80,
        paddingBottom: 24,
        paddingHorizontal: 16,
    },
    badges: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    typeBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
    },
    typeBadgeText: { color: '#fff', fontSize: 13, fontWeight: '500' },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#22c55e',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
    },
    verifiedText: { color: '#fff', fontSize: 13, fontWeight: '500' },
    churchName: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    location: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    locationText: { color: '#bae6fd', fontSize: 14 },
    quickActions: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: -16,
        borderRadius: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    actionText: { color: '#0ea5e9', fontSize: 13, fontWeight: '500' },
    section: {
        backgroundColor: '#fff',
        margin: 16,
        marginBottom: 0,
        borderRadius: 16,
        padding: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
    description: { color: '#6b7280', lineHeight: 22 },
    scheduleGroup: { marginBottom: 16 },
    scheduleLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
    timesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    timeChip: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
    },
    sundayChip: { backgroundColor: '#dbeafe' },
    timeText: { color: '#6b7280', fontSize: 13 },
    sundayText: { color: '#1d4ed8', fontWeight: '500' },
    claimSection: {
        backgroundColor: '#fef3c7',
        margin: 16,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    claimTitle: { fontSize: 16, fontWeight: 'bold', color: '#92400e' },
    claimDesc: { color: '#a16207', marginBottom: 12 },
    claimButton: {
        backgroundColor: '#f59e0b',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 50,
    },
    claimButtonText: { color: '#fff', fontWeight: '600' },
});
