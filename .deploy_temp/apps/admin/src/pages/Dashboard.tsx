import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, Spin, Alert, Progress, Tabs, Badge, Modal, Input, Select, message } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    HeartOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    RiseOutlined,
    EyeOutlined,
    BellOutlined,
    SettingOutlined,
    SafetyOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const { TabPane } = Tabs;
const { TextArea } = Input;

export function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [moderationQueue, setModerationQueue] = useState<any[]>([]);
    const [reportsQueue, setReportsQueue] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);

    useEffect(() => {
        fetchDashboardData();
        fetchModerationQueue();
        fetchReportsQueue();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/admin/dashboard`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch dashboard data');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            console.error(err);
            setError('Could not load dashboard statistics.');
        } finally {
            setLoading(false);
        }
    };

    const fetchModerationQueue = async () => {
        try {
            const res = await fetch(`${API_URL}/moderation/queue`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setModerationQueue(data || []);
            }
        } catch (err) {
            console.error('Failed to fetch moderation queue', err);
        }
    };

    const fetchReportsQueue = async () => {
        // In production, fetch from /admin/reports endpoint
        // For demo, use mock data
        setReportsQueue([
            { id: '1', reporter: { displayName: 'John D.' }, reportedUser: { displayName: 'User123' }, reason: 'SPAM', status: 'PENDING', createdAt: new Date().toISOString() },
        ]);
    };

    const handleModerateAction = async (prayerId: string, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`${API_URL}/moderation/${prayerId}/${action}`, {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ moderatorId: 'admin' })
            });
            if (res.ok) {
                message.success(`Prayer ${action}d successfully`);
                fetchModerationQueue();
            }
        } catch (err) {
            message.error(`Failed to ${action} prayer`);
        }
    };

    const prayerColumns = [
        {
            title: 'User',
            dataIndex: ['user', 'displayName'],
            key: 'user',
            render: (_: any, record: any) => record.user?.displayName || 'Anonymous'
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat: string) => <Tag>{cat}</Tag>
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d: string) => dayjs(d).fromNow()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="small" type="primary" onClick={() => handleModerateAction(record.id, 'approve')}>
                        Approve
                    </Button>
                    <Button size="small" danger onClick={() => handleModerateAction(record.id, 'reject')}>
                        Reject
                    </Button>
                </div>
            )
        }
    ];

    const reportColumns = [
        {
            title: 'Reporter',
            dataIndex: ['reporter', 'displayName'],
            key: 'reporter',
        },
        {
            title: 'Reported User',
            dataIndex: ['reportedUser', 'displayName'],
            key: 'reportedUser',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (r: string) => <Tag color="red">{r}</Tag>
        },
        {
            title: 'Reported',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d: string) => dayjs(d).fromNow()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Button size="small" onClick={() => { setSelectedReport(record); setActionModalVisible(true); }}>
                    Review
                </Button>
            )
        }
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 48 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: 24 }}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <Button type="primary" icon={<BankOutlined />} onClick={() => window.location.href = '/churches'}>
                        Add Church
                    </Button>
                    <Button icon={<UserOutlined />} onClick={() => message.info('Saints management coming soon!')}>
                        Add Saint
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={stats?.users || 0}
                            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Churches"
                            value={stats?.churches || 0}
                            prefix={<BankOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Prayer Requests"
                            value={stats?.prayers || 0}
                            prefix={<HeartOutlined style={{ color: '#eb2f96' }} />}
                            valueStyle={{ color: '#eb2f96' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Pending Moderation"
                            value={moderationQueue.length}
                            prefix={<SafetyOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Stats Row */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} md={8}>
                    <Card title="Verified Churches" size="small">
                        <Progress
                            percent={stats?.verifiedChurches && stats?.churches ? Math.round((stats.verifiedChurches / stats.churches) * 100) : 0}
                            status="active"
                        />
                        <p style={{ marginTop: 8, color: '#666' }}>
                            {stats?.verifiedChurches || 0} of {stats?.churches || 0} churches verified
                        </p>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="Email Verified Users" size="small">
                        <Progress
                            percent={stats?.verifiedUsers && stats?.users ? Math.round((stats.verifiedUsers / stats.users) * 100) : 0}
                            status="active"
                            strokeColor="#52c41a"
                        />
                        <p style={{ marginTop: 8, color: '#666' }}>
                            {stats?.verifiedUsers || 0} of {stats?.users || 0} users verified
                        </p>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card title="Today's Activity" size="small">
                        <Statistic
                            value={stats?.todayPrayers || 0}
                            suffix="prayers today"
                            valueStyle={{ fontSize: 20 }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Tabs for different sections */}
            <Card>
                <Tabs defaultActiveKey="moderation">
                    <TabPane
                        tab={<span><SafetyOutlined /> Moderation Queue <Badge count={moderationQueue.length} size="small" /></span>}
                        key="moderation"
                    >
                        <Table
                            dataSource={moderationQueue}
                            columns={prayerColumns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            locale={{ emptyText: 'No prayers pending moderation 🎉' }}
                        />
                    </TabPane>
                    <TabPane
                        tab={<span><ExclamationCircleOutlined /> User Reports <Badge count={reportsQueue.length} size="small" /></span>}
                        key="reports"
                    >
                        <Table
                            dataSource={reportsQueue}
                            columns={reportColumns}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                            locale={{ emptyText: 'No pending user reports 🎉' }}
                        />
                    </TabPane>
                    <TabPane
                        tab={<span><HeartOutlined /> Recent Prayers</span>}
                        key="prayers"
                    >
                        <Table
                            dataSource={stats?.recentPrayers || []}
                            columns={prayerColumns.filter(c => c.key !== 'actions')}
                            rowKey="id"
                            pagination={{ pageSize: 5 }}
                        />
                    </TabPane>
                </Tabs>
            </Card>

            {/* Report Action Modal */}
            <Modal
                title="Review Report"
                open={actionModalVisible}
                onCancel={() => setActionModalVisible(false)}
                footer={[
                    <Button key="dismiss" onClick={() => { message.info('Report dismissed'); setActionModalVisible(false); }}>
                        Dismiss
                    </Button>,
                    <Button key="warn" type="primary" onClick={() => { message.success('User warned'); setActionModalVisible(false); }}>
                        Warn User
                    </Button>,
                    <Button key="suspend" danger onClick={() => { message.success('User suspended'); setActionModalVisible(false); }}>
                        Suspend User
                    </Button>,
                ]}
            >
                {selectedReport && (
                    <div>
                        <p><strong>Reporter:</strong> {selectedReport.reporter?.displayName}</p>
                        <p><strong>Reported User:</strong> {selectedReport.reportedUser?.displayName}</p>
                        <p><strong>Reason:</strong> <Tag color="red">{selectedReport.reason}</Tag></p>
                        <p><strong>Details:</strong> {selectedReport.details || 'No additional details'}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}
