/**
 * Premium Subscription Screen
 * 
 * Displays available subscription plans and handles purchases via Google Play Billing.
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Check, Sparkles, Heart, Shield, Users } from 'lucide-react-native';
import { iapService, ProductInfo, SUBSCRIPTION_SKUS } from '../lib/iap';
import { useAuthStore } from '../lib/store';

interface PlanFeature {
    icon: React.ReactNode;
    text: string;
    included: boolean;
}

interface Plan {
    id: string;
    name: string;
    price: string;
    period: string;
    features: PlanFeature[];
    popular?: boolean;
    savings?: string;
}

const PLAN_FEATURES: Record<string, PlanFeature[]> = {
    free: [
        { icon: <Heart size={16} color="#666" />, text: 'Basic prayers & readings', included: true },
        { icon: <Shield size={16} color="#666" />, text: 'Prayer wall access', included: true },
        { icon: <Sparkles size={16} color="#999" />, text: 'Audio prayers', included: false },
        { icon: <Users size={16} color="#999" />, text: 'Family sharing', included: false },
        { icon: <Crown size={16} color="#999" />, text: 'AI suggestions', included: false },
    ],
    plus: [
        { icon: <Heart size={16} color="#0ea5e9" />, text: 'Ad-free experience', included: true },
        { icon: <Sparkles size={16} color="#0ea5e9" />, text: 'Audio prayers', included: true },
        { icon: <Shield size={16} color="#0ea5e9" />, text: 'Offline mode', included: true },
        { icon: <Users size={16} color="#0ea5e9" />, text: '2 family members', included: true },
        { icon: <Crown size={16} color="#999" />, text: 'AI suggestions', included: false },
    ],
    premium: [
        { icon: <Heart size={16} color="#8b5cf6" />, text: 'Everything in Plus', included: true },
        { icon: <Crown size={16} color="#8b5cf6" />, text: 'AI prayer suggestions', included: true },
        { icon: <Users size={16} color="#8b5cf6" />, text: '5 family members', included: true },
        { icon: <Shield size={16} color="#8b5cf6" />, text: 'Priority support', included: true },
        { icon: <Sparkles size={16} color="#8b5cf6" />, text: 'Exclusive content', included: true },
    ],
};

export function PremiumScreen({ navigation }: { navigation?: any }) {
    const [products, setProducts] = useState<ProductInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const { token, user } = useAuthStore();

    useEffect(() => {
        loadProducts();

        // Set auth token for IAP service
        if (token) {
            iapService.setAuthToken(token);
        }

        return () => {
            // Cleanup is handled by the service
        };
    }, [token]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            await iapService.initialize();
            const subscriptions = await iapService.getSubscriptions();
            setProducts(subscriptions);

            // Default to yearly plan
            const yearlyPlan = subscriptions.find(p => p.productId.includes('yearly'));
            if (yearlyPlan) {
                setSelectedPlan(yearlyPlan.productId);
            } else if (subscriptions.length > 0) {
                setSelectedPlan(subscriptions[0].productId);
            }
        } catch (error) {
            console.error('Failed to load products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedPlan) return;

        setPurchasing(selectedPlan);
        try {
            const result = await iapService.purchaseSubscription(selectedPlan);

            if (result.success) {
                Alert.alert(
                    'Welcome to Premium! 🎉',
                    'Your subscription is now active. Enjoy all premium features!',
                    [{ text: 'Got it', onPress: () => navigation?.goBack?.() }]
                );
            } else {
                Alert.alert('Purchase Failed', result.error || 'Something went wrong. Please try again.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to complete purchase');
        } finally {
            setPurchasing(null);
        }
    };

    const handleRestorePurchases = async () => {
        setLoading(true);
        try {
            const results = await iapService.restorePurchases();

            const restored = results.filter(r => r.success);
            if (restored.length > 0) {
                Alert.alert('Purchases Restored', `${restored.length} purchase(s) have been restored.`);
            } else {
                Alert.alert('No Purchases Found', 'No previous purchases were found to restore.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to restore purchases');
        } finally {
            setLoading(false);
        }
    };

    const getProductByType = (type: 'plus' | 'premium', period: 'monthly' | 'yearly') => {
        const productId = `${type}_${period}`;
        return products.find(p => p.productId === productId);
    };

    const renderPlanCard = (planType: 'plus' | 'premium', period: 'monthly' | 'yearly') => {
        const product = getProductByType(planType, period);
        if (!product) return null;

        const isSelected = selectedPlan === product.productId;
        const isPurchasing = purchasing === product.productId;
        const features = PLAN_FEATURES[planType];
        const isPopular = planType === 'premium' && period === 'yearly';

        return (
            <TouchableOpacity
                key={product.productId}
                style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                    isPopular && styles.planCardPopular,
                ]}
                onPress={() => setSelectedPlan(product.productId)}
                disabled={!!purchasing}
            >
                {isPopular && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularBadgeText}>BEST VALUE</Text>
                    </View>
                )}

                <View style={styles.planHeader}>
                    <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
                        {planType === 'plus' ? 'Plus' : 'Premium'}
                    </Text>
                    <Text style={[styles.planPeriod, isSelected && styles.planPeriodSelected]}>
                        {period === 'monthly' ? 'Monthly' : 'Yearly'}
                    </Text>
                </View>

                <Text style={[styles.planPrice, isSelected && styles.planPriceSelected]}>
                    {product.price}
                </Text>
                <Text style={styles.planBillingPeriod}>
                    {period === 'monthly' ? '/month' : '/year'}
                </Text>

                {period === 'yearly' && (
                    <Text style={styles.savingsText}>Save 33%</Text>
                )}

                <View style={styles.featuresContainer}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            {feature.included ? (
                                <Check size={14} color={isSelected ? '#0ea5e9' : '#22c55e'} />
                            ) : (
                                <View style={styles.featureNotIncluded} />
                            )}
                            <Text
                                style={[
                                    styles.featureText,
                                    !feature.included && styles.featureTextDisabled,
                                ]}
                            >
                                {feature.text}
                            </Text>
                        </View>
                    ))}
                </View>

                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Check size={20} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    if (loading && products.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>Loading plans...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <LinearGradient
                colors={['#0c4a6e', '#0369a1', '#0ea5e9']}
                style={styles.header}
            >
                <Crown size={48} color="#fcd34d" />
                <Text style={styles.headerTitle}>Unlock Premium</Text>
                <Text style={styles.headerSubtitle}>
                    Deepen your prayer life with exclusive features
                </Text>
            </LinearGradient>

            {Platform.OS !== 'android' && (
                <View style={styles.notAvailableContainer}>
                    <Text style={styles.notAvailableText}>
                        In-app purchases coming soon to iOS. Visit myprayertower.com to subscribe.
                    </Text>
                </View>
            )}

            {Platform.OS === 'android' && (
                <>
                    <View style={styles.plansContainer}>
                        <Text style={styles.sectionTitle}>Choose Your Plan</Text>

                        <View style={styles.planRow}>
                            {renderPlanCard('plus', 'yearly')}
                            {renderPlanCard('premium', 'yearly')}
                        </View>

                        <Text style={styles.monthlyLabel}>Or pay monthly:</Text>

                        <View style={styles.planRow}>
                            {renderPlanCard('plus', 'monthly')}
                            {renderPlanCard('premium', 'monthly')}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.purchaseButton, !selectedPlan && styles.purchaseButtonDisabled]}
                        onPress={handlePurchase}
                        disabled={!selectedPlan || !!purchasing}
                    >
                        {purchasing ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.purchaseButtonText}>
                                Subscribe Now
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.restoreButton}
                        onPress={handleRestorePurchases}
                        disabled={loading}
                    >
                        <Text style={styles.restoreButtonText}>Restore Purchases</Text>
                    </TouchableOpacity>

                    <Text style={styles.legalText}>
                        Subscriptions auto-renew unless cancelled at least 24 hours before the end of the current period.
                        Manage subscriptions in Google Play Store.
                    </Text>
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    contentContainer: {
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    header: {
        padding: 32,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 16,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#e0f2fe',
        marginTop: 8,
        textAlign: 'center',
    },
    notAvailableContainer: {
        margin: 16,
        padding: 16,
        backgroundColor: '#fef3c7',
        borderRadius: 12,
    },
    notAvailableText: {
        fontSize: 14,
        color: '#92400e',
        textAlign: 'center',
    },
    plansContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
        textAlign: 'center',
    },
    planRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    monthlyLabel: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 8,
    },
    planCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        position: 'relative',
    },
    planCardSelected: {
        borderColor: '#0ea5e9',
        backgroundColor: '#f0f9ff',
    },
    planCardPopular: {
        borderColor: '#8b5cf6',
    },
    popularBadge: {
        position: 'absolute',
        top: -10,
        left: '50%',
        transform: [{ translateX: -40 }],
        backgroundColor: '#8b5cf6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    popularBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    planHeader: {
        marginBottom: 8,
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    planNameSelected: {
        color: '#0369a1',
    },
    planPeriod: {
        fontSize: 12,
        color: '#64748b',
    },
    planPeriodSelected: {
        color: '#0ea5e9',
    },
    planPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    planPriceSelected: {
        color: '#0369a1',
    },
    planBillingPeriod: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 8,
    },
    savingsText: {
        fontSize: 12,
        color: '#22c55e',
        fontWeight: '600',
        marginBottom: 12,
    },
    featuresContainer: {
        marginTop: 8,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    featureNotIncluded: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#e2e8f0',
    },
    featureText: {
        fontSize: 12,
        color: '#475569',
        marginLeft: 8,
    },
    featureTextDisabled: {
        color: '#94a3b8',
    },
    selectedIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#0ea5e9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    purchaseButton: {
        backgroundColor: '#0ea5e9',
        marginHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    purchaseButtonDisabled: {
        backgroundColor: '#94a3b8',
    },
    purchaseButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    restoreButton: {
        marginHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 12,
    },
    restoreButtonText: {
        color: '#0ea5e9',
        fontSize: 14,
    },
    legalText: {
        fontSize: 11,
        color: '#94a3b8',
        textAlign: 'center',
        marginHorizontal: 24,
        marginTop: 16,
        lineHeight: 16,
    },
});

export default PremiumScreen;
