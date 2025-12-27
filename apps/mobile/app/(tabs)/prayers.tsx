import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, BookOpen, Heart, Star, Cross } from 'lucide-react-native';

const categories = [
    { id: '1', name: 'Marian Prayers', count: 177, icon: Heart, color: '#ec4899' },
    { id: '2', name: 'Basic Prayers', count: 129, icon: BookOpen, color: '#3b82f6' },
    { id: '3', name: 'Christ Prayers', count: 86, icon: Cross, color: '#ef4444' },
    { id: '4', name: 'Family Prayers', count: 62, icon: Heart, color: '#10b981' },
    { id: '5', name: 'Rosary', count: 20, icon: Star, color: '#8b5cf6' },
    { id: '6', name: 'Communion', count: 49, icon: Star, color: '#f59e0b' },
];

const popularPrayers = [
    { id: '1', title: 'Our Father', category: 'Basic Prayers' },
    { id: '2', title: 'Hail Mary', category: 'Marian Prayers' },
    { id: '3', title: 'Glory Be', category: 'Basic Prayers' },
    { id: '4', title: 'Act of Contrition', category: 'Acts of Prayers' },
];

export default function PrayersScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>📖 Prayer Library</Text>
                <Text style={styles.subtitle}>2,000+ prayers for every occasion</Text>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search prayers..."
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>

            <FlatList
                data={[{ type: 'categories' }, { type: 'popular' }]}
                keyExtractor={(item) => item.type}
                renderItem={({ item }) => (
                    item.type === 'categories' ? (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Categories</Text>
                            <View style={styles.categoryGrid}>
                                {categories.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.id}
                                        style={styles.categoryCard}
                                        onPress={() => router.push(`/prayers/${cat.id}`)}
                                    >
                                        <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                                            <cat.icon color={cat.color} size={24} />
                                        </View>
                                        <Text style={styles.categoryName}>{cat.name}</Text>
                                        <Text style={styles.categoryCount}>{cat.count} prayers</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Popular Prayers</Text>
                            {popularPrayers.map((prayer) => (
                                <TouchableOpacity
                                    key={prayer.id}
                                    style={styles.prayerItem}
                                    onPress={() => router.push(`/prayer/${prayer.id}`)}
                                >
                                    <View style={styles.prayerIcon}>
                                        <BookOpen color="#0ea5e9" size={20} />
                                    </View>
                                    <View style={styles.prayerContent}>
                                        <Text style={styles.prayerTitle}>{prayer.title}</Text>
                                        <Text style={styles.prayerCategory}>{prayer.category}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )
                )}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#10b981',
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#d1fae5',
        marginBottom: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    section: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 16,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    categoryCard: {
        width: '47%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    categoryIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    categoryName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    categoryCount: {
        fontSize: 13,
        color: '#6b7280',
    },
    prayerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    prayerIcon: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#e0f2fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    prayerContent: {
        marginLeft: 12,
    },
    prayerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    prayerCategory: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
});
