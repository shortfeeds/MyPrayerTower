import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, X, Share2, Flag } from 'lucide-react-native';

const mockPrayers = [
    { id: '1', content: 'Please pray for my mother who is having surgery tomorrow.', user: 'Maria S.', category: 'Health', prayerCount: 127, time: '2h ago' },
    { id: '2', content: 'For peace in our family and reconciliation between my siblings.', user: 'Anonymous', category: 'Family', prayerCount: 89, time: '4h ago' },
    { id: '3', content: 'For guidance in finding a new job.', user: 'John D.', category: 'Work', prayerCount: 56, time: '6h ago' },
    { id: '4', content: 'Thank you God! My father\'s cancer is in remission!', user: 'Sarah M.', category: 'Thanksgiving', prayerCount: 234, time: '1d ago', isAnswered: true },
];

const categories = ['All', 'Health', 'Family', 'Work', 'Thanksgiving', 'Spiritual'];

export default function PrayerWallScreen() {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [prayedFor, setPrayedFor] = useState<Set<string>>(new Set());

    const handlePray = (id: string) => {
        setPrayedFor(new Set([...prayedFor, id]));
    };

    const renderPrayer = ({ item }: { item: typeof mockPrayers[0] }) => (
        <View style={[styles.prayerCard, item.isAnswered && styles.answeredCard]}>
            {item.isAnswered && (
                <View style={styles.answeredBadge}>
                    <Text style={styles.answeredText}>✅ Answered</Text>
                </View>
            )}

            <Text style={styles.prayerContent}>"{item.content}"</Text>

            <View style={styles.prayerMeta}>
                <View>
                    <Text style={styles.prayerAuthor}>{item.user}</Text>
                    <Text style={styles.prayerInfo}>{item.category} • {item.time}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.prayButton, prayedFor.has(item.id) && styles.prayedButton]}
                    onPress={() => handlePray(item.id)}
                    disabled={prayedFor.has(item.id)}
                >
                    <Text style={styles.prayButtonText}>
                        🙏 {prayedFor.has(item.id) ? item.prayerCount + 1 : item.prayerCount}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.prayerActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Share2 color="#9ca3af" size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Flag color="#9ca3af" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>🙏 Prayer Wall</Text>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => setShowSubmitModal(true)}
                >
                    <Text style={styles.submitButtonText}>+ Submit</Text>
                </TouchableOpacity>
            </View>

            {/* Categories */}
            <View style={styles.categories}>
                <FlatList
                    horizontal
                    data={categories}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.categoryChip, selectedCategory === item && styles.categoryActive]}
                            onPress={() => setSelectedCategory(item)}
                        >
                            <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextActive]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                />
            </View>

            {/* Prayers List */}
            <FlatList
                data={mockPrayers}
                keyExtractor={(item) => item.id}
                renderItem={renderPrayer}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            {/* Submit Modal */}
            <Modal visible={showSubmitModal} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Submit Prayer Request</Text>
                        <TouchableOpacity onPress={() => setShowSubmitModal(false)}>
                            <X color="#6b7280" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={styles.inputLabel}>Your Prayer Intention</Text>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Share your prayer request..."
                            placeholderTextColor="#9ca3af"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity style={styles.modalSubmitButton}>
                            <Text style={styles.modalSubmitText}>Submit Request</Text>
                        </TouchableOpacity>

                        <Text style={styles.modalNote}>
                            All prayer requests are reviewed before publishing.
                        </Text>
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    submitButton: {
        backgroundColor: '#0ea5e9',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 50,
    },
    submitButtonText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 14,
    },
    categories: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
    },
    categoryActive: {
        backgroundColor: '#0ea5e9',
    },
    categoryText: {
        color: '#6b7280',
        fontSize: 14,
        fontWeight: '500',
    },
    categoryTextActive: {
        color: '#ffffff',
    },
    list: {
        padding: 16,
    },
    prayerCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    answeredCard: {
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
    },
    answeredBadge: {
        marginBottom: 8,
    },
    answeredText: {
        color: '#16a34a',
        fontWeight: '600',
        fontSize: 13,
    },
    prayerContent: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 12,
    },
    prayerMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    prayerAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    prayerInfo: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
    },
    prayButton: {
        backgroundColor: '#fbbf24',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 50,
    },
    prayedButton: {
        backgroundColor: '#d1fae5',
    },
    prayButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ffffff',
    },
    prayerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        gap: 8,
    },
    actionButton: {
        padding: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    modalContent: {
        padding: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 120,
        marginBottom: 16,
    },
    modalSubmitButton: {
        backgroundColor: '#0ea5e9',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalSubmitText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalNote: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: 13,
        marginTop: 16,
    },
});
