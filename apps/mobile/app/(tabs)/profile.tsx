import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { User, ChevronRight, Bell, Moon, Globe, Heart, Shield, LogOut, Crown } from 'lucide-react-native';
import { useState } from 'react';

export default function ProfileScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    // Mock user - replace with actual auth
    const user = {
        name: 'Guest User',
        email: 'guest@myprayertower.com',
        tier: 'free',
        isLoggedIn: false,
    };

    const menuItems = [
        { icon: Heart, label: 'My Prayers', route: '/my-prayers' },
        { icon: Crown, label: 'Upgrade to Premium', route: '/premium', highlight: true },
        { icon: Bell, label: 'Notifications', toggle: true, value: notifications, onChange: setNotifications },
        { icon: Moon, label: 'Dark Mode', toggle: true, value: darkMode, onChange: setDarkMode },
        { icon: Globe, label: 'Language', value: 'English', route: '/language' },
        { icon: Shield, label: 'Privacy Policy', route: '/privacy' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* User Card */}
                <View style={styles.userCard}>
                    <View style={styles.avatar}>
                        <User color="#0ea5e9" size={32} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.name}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                        <View style={styles.tierBadge}>
                            <Text style={styles.tierText}>FREE</Text>
                        </View>
                    </View>
                </View>

                {/* Login/Register for guests */}
                {!user.isLoggedIn && (
                    <View style={styles.authSection}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => router.push('/login')}
                        >
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.registerButton}
                            onPress={() => router.push('/register')}
                        >
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Menu Items */}
                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, item.highlight && styles.menuItemHighlight]}
                            onPress={item.route ? () => router.push(item.route as any) : undefined}
                            disabled={item.toggle}
                        >
                            <View style={styles.menuItemLeft}>
                                <item.icon color={item.highlight ? '#f59e0b' : '#6b7280'} size={22} />
                                <Text style={[styles.menuItemLabel, item.highlight && styles.menuItemLabelHighlight]}>
                                    {item.label}
                                </Text>
                            </View>
                            {item.toggle ? (
                                <Switch
                                    value={item.value}
                                    onValueChange={item.onChange}
                                    trackColor={{ false: '#e5e7eb', true: '#bae6fd' }}
                                    thumbColor={item.value ? '#0ea5e9' : '#ffffff'}
                                />
                            ) : (
                                <View style={styles.menuItemRight}>
                                    {item.value && <Text style={styles.menuItemValue}>{item.value}</Text>}
                                    <ChevronRight color="#9ca3af" size={20} />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Logout */}
                {user.isLoggedIn && (
                    <TouchableOpacity style={styles.logoutButton}>
                        <LogOut color="#ef4444" size={20} />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                )}

                {/* Version */}
                <Text style={styles.version}>MyPrayerTower v1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        margin: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#e0f2fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfo: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    userEmail: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    tierBadge: {
        backgroundColor: '#e5e7eb',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 50,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    tierText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6b7280',
    },
    authSection: {
        marginHorizontal: 16,
        marginBottom: 16,
        gap: 12,
    },
    loginButton: {
        backgroundColor: '#0ea5e9',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        borderWidth: 1,
        borderColor: '#0ea5e9',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#0ea5e9',
        fontSize: 16,
        fontWeight: '600',
    },
    menuSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    menuItemHighlight: {
        backgroundColor: '#fffbeb',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemLabel: {
        fontSize: 16,
        color: '#374151',
    },
    menuItemLabelHighlight: {
        color: '#f59e0b',
        fontWeight: '600',
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    menuItemValue: {
        fontSize: 14,
        color: '#9ca3af',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: 16,
        marginTop: 24,
        paddingVertical: 14,
        backgroundColor: '#fef2f2',
        borderRadius: 12,
    },
    logoutText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
    version: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 12,
        marginTop: 24,
        marginBottom: 32,
    },
});
