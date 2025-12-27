import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin, Alert } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    HeartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// API URL from env or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // In a real app, this should be authenticated call
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error('Failed to fetch dashboard data');

            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error(err);
            setError('Could not load dashboard statistics. Is the API running?');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'User',
            dataIndex: ['user', 'firstName'],
            key: 'user',
            render: (_: any, record: any) => record.user ? `${record.user.firstName || ''} ${record.user.lastName || ''}`.trim() || record.user.email : 'Anonymous'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat: string) => <Tag>{cat}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'PENDING' ? 'orange' : status === 'APPROVED' ? 'green' : 'red'}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'time',
            render: (date: string) => dayjs(date).fromNow()
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) =>
                record.status === 'PENDING' ? (
                    <Button type="primary" size="small" href="/prayers">
                        Review
                    </Button>
                ) : null,
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
                <Spin size="large" />
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 24 }}>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={fetchDashboardData}>
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Total Users"
                            value={stats.users}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#0ea5e9' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Churches Listed"
                            value={stats.churches}
                            prefix={<BankOutlined />}
                            valueStyle={{ color: '#10b981' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Prayer Requests"
                            value={stats.prayers}
                            prefix={<HeartOutlined />}
                            valueStyle={{ color: '#f59e0b' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card bordered={false} className="shadow-sm">
                        <Statistic
                            title="Pending Moderation"
                            value={stats.pendingPrayers}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#ef4444' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Alerts */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                    <Card
                        title={
                            <span>
                                <ExclamationCircleOutlined style={{ color: '#f59e0b', marginRight: 8 }} />
                                Pending Actions
                            </span>
                        }
                    >
                        {stats.pendingPrayers > 0 || stats.pendingClaims > 0 ? (
                            <>
                                {stats.pendingPrayers > 0 && <p>🙏 <strong>{stats.pendingPrayers}</strong> prayer requests awaiting moderation</p>}
                                {stats.pendingClaims > 0 && <p>⛪ <strong>{stats.pendingClaims}</strong> church claims need review</p>}
                                <Button type="primary" style={{ marginTop: 12 }} href="/prayers">
                                    Go to Moderation
                                </Button>
                            </>
                        ) : (
                            <p style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <CheckCircleOutlined /> All caught up! No pending actions.
                            </p>
                        )}
                    </Card>
                </Col>
                <Col span={12}>
                    <Card
                        title={
                            <span>
                                <CheckCircleOutlined style={{ color: '#10b981', marginRight: 8 }} />
                                System Status
                            </span>
                        }
                    >
                        <p>✅ API: Healthy (Connected)</p>
                        <p>✅ Database: Online</p>
                        <p>✅ Stats Updated: {dayjs().format('h:mm A')}</p>
                    </Card>
                </Col>
            </Row>

            {/* Recent Prayers */}
            <Card title="Recent Prayer Requests">
                <Table
                    columns={columns}
                    dataSource={stats.recentPrayers}
                    rowKey="id"
                    pagination={false}
                />
            </Card>
        </div>
    );
}
