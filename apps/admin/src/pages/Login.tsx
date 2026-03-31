import { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values: any) => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                console.error('Login error:', res.status, errData);
                throw new Error(errData.message || 'Login failed');
            }

            const data = await res.json();
            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                message.success('Welcome back!');
                navigate('/dashboard', { replace: true });
            } else {
                throw new Error('No token received');
            }
        } catch (err: any) {
            console.error('Login exception:', err);
            message.error(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
            <Card style={{ width: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <span style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>M</span>
                    </div>
                    <h2 style={{ margin: 0 }}>Admin Login</h2>
                    <p style={{ color: '#888' }}>MyPrayerTower Administration</p>
                </div>

                <Form form={form} layout="vertical" onFinish={handleLogin}>
                    <Form.Item
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email' }]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

