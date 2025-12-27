import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, Volume2, Share2, Heart, Bookmark } from 'lucide-react-native';
import { useState } from 'react';

// Mock prayer data
const prayer = {
    id: '1',
    title: 'Our Father',
    latinTitle: 'Pater Noster',
    category: 'Basic Prayers',
    content: `Our Father, who art in heaven,
hallowed be thy name;
thy kingdom come;
thy will be done on earth as it is in heaven.

Give us this day our daily bread;
and forgive us our trespasses
as we forgive those who trespass against us;
and lead us not into temptation,
but deliver us from evil.

Amen.`,
    origin: 'Taught by Jesus Christ to His disciples (Matthew 6:9-13)',
    views: 15420,
    hasAudio: true,
};

export default function PrayerDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);
    const [fontSize, setFontSize] = useState(18);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft color="#111827" size={24} />
                </TouchableOpacity>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={styles.headerButton}>
                        <Bookmark color={isSaved ? '#0ea5e9' : '#9ca3af'} size={22} fill={isSaved ? '#0ea5e9' : 'none'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}>
                        <Share2 color="#9ca3af" size={22} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Title */}
                <View style={styles.titleSection}>
                    <View style={styles.categoryBadge}>
                        <BookOpen color="#0ea5e9" size={14} />
                        <Text style={styles.categoryText}>{prayer.category}</Text>
                    </View>
                    <Text style={styles.title}>{prayer.title}</Text>
                    {prayer.latinTitle && (
                        <Text style={styles.latinTitle}>{prayer.latinTitle}</Text>
                    )}
                </View>

                {/* Audio Button */}
                {prayer.hasAudio && (
                    <TouchableOpacity style={styles.audioButton}>
                        <Volume2 color="#fff" size={20} />
                        <Text style={styles.audioButtonText}>Listen to Audio</Text>
                    </TouchableOpacity>
                )}

                {/* Font Size Controls */}
                <View style={styles.fontControls}>
                    <Text style={styles.fontLabel}>Text Size</Text>
                    <View style={styles.fontButtons}>
                        <TouchableOpacity
                            style={styles.fontButton}
                            onPress={() => setFontSize(Math.max(14, fontSize - 2))}
                        >
                            <Text style={styles.fontButtonText}>A-</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.fontButton}
                            onPress={() => setFontSize(Math.min(28, fontSize + 2))}
                        >
                            <Text style={styles.fontButtonText}>A+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Prayer Content */}
                <View style={styles.prayerCard}>
                    <Text style={[styles.prayerText, { fontSize }]}>{prayer.content}</Text>
                </View>

                {/* Origin */}
                <View style={styles.originSection}>
                    <Text style={styles.originLabel}>Origin</Text>
                    <Text style={styles.originText}>{prayer.origin}</Text>
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <Text style={styles.statsText}>📖 {prayer.views.toLocaleString()} people have prayed this</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#fff',
    },
    backButton: { padding: 4 },
    headerActions: { flexDirection: 'row', gap: 12 },
    headerButton: { padding: 4 },
    content: { padding: 16 },
    titleSection: { marginBottom: 20 },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#dbeafe',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    categoryText: { color: '#1d4ed8', fontSize: 13, fontWeight: '500' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
    latinTitle: { fontSize: 16, color: '#6b7280', fontStyle: 'italic' },
    audioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#8b5cf6',
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 16,
    },
    audioButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    fontControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    fontLabel: { color: '#6b7280', fontSize: 14 },
    fontButtons: { flexDirection: 'row', gap: 8 },
    fontButton: {
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    fontButtonText: { color: '#374151', fontWeight: '600' },
    prayerCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
    },
    prayerText: {
        color: '#1f2937',
        lineHeight: 32,
        textAlign: 'center',
    },
    originSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    originLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4 },
    originText: { color: '#374151', lineHeight: 20 },
    stats: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    statsText: { color: '#6b7280', fontSize: 14 },
});
