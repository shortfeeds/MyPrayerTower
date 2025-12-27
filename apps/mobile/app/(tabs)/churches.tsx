import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MapPin, Search, CheckCircle, ChevronRight } from 'lucide-react-native';

const mockChurches = [
    { id: '1', name: "St. Patrick's Cathedral", type: 'Cathedral', address: 'New York, NY', distance: '0.5 mi', isVerified: true },
    { id: '2', name: 'Holy Name of Jesus', type: 'Parish', address: 'New York, NY', distance: '1.2 mi', isVerified: true },
    { id: '3', name: 'St. Francis of Assisi', type: 'Parish', address: 'New York, NY', distance: '2.1 mi', isVerified: false },
    { id: '4', name: 'Our Lady of Guadalupe', type: 'Parish', address: 'Los Angeles, CA', distance: '3.5 mi', isVerified: false },
];

export default function ChurchesScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const renderChurch = ({ item }: { item: typeof mockChurches[0] }) => (
        <TouchableOpacity
            style={styles.churchCard}
            onPress={() => router.push(`/church/${item.id}`)}
        >
            <View style={styles.churchIcon}>
                <MapPin color="#0ea5e9" size={24} />
            </View>
            <View style={styles.churchContent}>
                <View style={styles.churchHeader}>
                    <Text style={styles.churchName} numberOfLines={1}>{item.name}</Text>
                    {item.isVerified && <CheckCircle color="#10b981" size={16} />}
                </View>
                <Text style={styles.churchType}>{item.type}</Text>
                <Text style={styles.churchAddress}>{item.address} • {item.distance}</Text>
            </View>
            <ChevronRight color="#9ca3af" size={20} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Find Churches</Text>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <Search color="#9ca3af" size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by city or zip..."
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filters}>
                    <TouchableOpacity style={[styles.filterChip, styles.filterActive]}>
                        <Text style={styles.filterTextActive}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Catholic</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Orthodox</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.filterChip}>
                        <Text style={styles.filterText}>Verified</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Results */}
            <FlatList
                data={mockChurches}
                keyExtractor={(item) => item.id}
                renderItem={renderChurch}
                contentContainerStyle={styles.list}
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
        backgroundColor: '#0c4a6e',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
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
    filters: {
        flexDirection: 'row',
        marginTop: 12,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    filterActive: {
        backgroundColor: '#fbbf24',
    },
    filterText: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#0c4a6e',
        fontSize: 13,
        fontWeight: '600',
    },
    list: {
        padding: 16,
    },
    churchCard: {
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
    churchIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#e0f2fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    churchContent: {
        flex: 1,
        marginLeft: 12,
    },
    churchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    churchName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    churchType: {
        fontSize: 13,
        color: '#0ea5e9',
        marginTop: 2,
    },
    churchAddress: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
});
