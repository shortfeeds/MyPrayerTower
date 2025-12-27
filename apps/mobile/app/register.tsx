import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, User, Eye, EyeOff, X, Check } from 'lucide-react-native';
import { useState } from 'react';

export default function RegisterScreen() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = () => {
        console.log('Register:', formData);
        router.back();
    };

    const benefits = [
        'Access 2,000+ prayers',
        'Prayer Wall participation',
        'Church finder worldwide',
        'Daily saints & readings',
    ];

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()}>
                            <X color="#6b7280" size={24} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join millions growing in faith</Text>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.row}>
                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <User color="#9ca3af" size={20} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="First Name"
                                    placeholderTextColor="#9ca3af"
                                    value={formData.firstName}
                                    onChangeText={(v) => setFormData({ ...formData, firstName: v })}
                                />
                            </View>
                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Last Name"
                                    placeholderTextColor="#9ca3af"
                                    value={formData.lastName}
                                    onChangeText={(v) => setFormData({ ...formData, lastName: v })}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Mail color="#9ca3af" size={20} />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor="#9ca3af"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(v) => setFormData({ ...formData, email: v })}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Lock color="#9ca3af" size={20} />
                            <TextInput
                                style={styles.input}
                                placeholder="Password (8+ characters)"
                                placeholderTextColor="#9ca3af"
                                secureTextEntry={!showPassword}
                                value={formData.password}
                                onChangeText={(v) => setFormData({ ...formData, password: v })}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff color="#9ca3af" size={20} /> : <Eye color="#9ca3af" size={20} />}
                            </TouchableOpacity>
                        </View>

                        {/* Benefits */}
                        <View style={styles.benefits}>
                            <Text style={styles.benefitsTitle}>Free account includes:</Text>
                            {benefits.map((benefit, i) => (
                                <View key={i} style={styles.benefitItem}>
                                    <Check color="#10b981" size={16} />
                                    <Text style={styles.benefitText}>{benefit}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Create Free Account</Text>
                        </TouchableOpacity>

                        <Text style={styles.terms}>
                            By signing up, you agree to our Terms of Service and Privacy Policy
                        </Text>
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginLink}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.replace('/login')}>
                            <Text style={styles.loginLinkText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    form: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    benefits: {
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        padding: 16,
    },
    benefitsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#166534',
        marginBottom: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    benefitText: {
        fontSize: 14,
        color: '#166534',
    },
    registerButton: {
        backgroundColor: '#0ea5e9',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    terms: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 12,
        lineHeight: 18,
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    loginText: {
        color: '#6b7280',
        fontSize: 15,
    },
    loginLinkText: {
        color: '#0ea5e9',
        fontSize: 15,
        fontWeight: '600',
    },
});
