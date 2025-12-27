import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react-native';
import { useState } from 'react';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // TODO: Call API
        console.log('Login:', { email, password });
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <X color="#6b7280" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Logo */}
                <View style={styles.logo}>
                    <View style={styles.logoIcon}>
                        <Text style={styles.logoText}>M</Text>
                    </View>
                    <Text style={styles.logoTitle}>MyPrayerTower</Text>
                </View>

                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue your journey</Text>

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Mail color="#9ca3af" size={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#9ca3af"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Lock color="#9ca3af" size={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <EyeOff color="#9ca3af" size={20} />
                            ) : (
                                <Eye color="#9ca3af" size={20} />
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>

                {/* Register Link */}
                <View style={styles.registerLink}>
                    <Text style={styles.registerText}>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => router.replace('/register')}>
                        <Text style={styles.registerLinkText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
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
    logo: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 32,
    },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#0ea5e9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    logoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
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
        marginBottom: 32,
    },
    form: {
        gap: 16,
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
    forgotPassword: {
        textAlign: 'right',
        color: '#0ea5e9',
        fontWeight: '500',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#0ea5e9',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    registerText: {
        color: '#6b7280',
        fontSize: 15,
    },
    registerLinkText: {
        color: '#0ea5e9',
        fontSize: 15,
        fontWeight: '600',
    },
});
