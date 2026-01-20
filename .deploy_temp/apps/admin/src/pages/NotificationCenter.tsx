import { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, Form, Select, message, Tabs, Row, Col, Statistic, Typography, DatePicker, Empty } from 'antd';
import { SearchOutlined, PlusOutlined, SendOutlined, BellOutlined, UserOutlined, TeamOutlined, MailOutlined, MobileOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'PUSH' | 'EMAIL' | 'IN_APP' | 'ALL';
    targetAudience: 'ALL' | 'PREMIUM' | 'FREE' | 'SPECIFIC';
    status: 'SENT' | 'SCHEDULED' | 'DRAFT';
    sentAt?: string;
    scheduledFor?: string;
    createdAt: string;
    recipientCount: number;
}

const typeColors: Record<string, string> = {
    PUSH: 'blue',
    EMAIL: 'green',
    IN_APP: 'orange',
    ALL: 'purple',
};

const statusColors: Record<string, string> = {
    SENT: 'green',
    SCHEDULED: 'blue',
    DRAFT: 'default',
};

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // Mock data for now
            setNotifications([
                { id: '1', title: 'New Feature: Mass Offerings', message: 'Request a Holy Mass for your intentions...', type: 'ALL', targetAudience: 'ALL', status: 'SENT', sentAt: new Date().toISOString(), createdAt: new Date().toISOString(), recipientCount: 12543 },
                { id: '2', title: 'Easter Celebration', message: 'Join us for special Easter services...', type: 'PUSH', targetAudience: 'ALL', status: 'SCHEDULED', scheduledFor: new Date(Date.now() + 86400000).toISOString(), createdAt: new Date().toISOString(), recipientCount: 0 },
                { id: '3', title: 'Premium Features Update', message: 'Exclusive new features for premium members...', type: 'EMAIL', targetAudience: 'PREMIUM', status: 'SENT', sentAt: new Date(Date.now() - 86400000).toISOString(), createdAt: new Date().toISOString(), recipientCount: 3421 },
            ]);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            message.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        form.resetFields();
        setModalVisible(true);
    };

    const handleSend = async (values: any) => {
        try {
            const isScheduled = values.scheduledFor && dayjs(values.scheduledFor).isAfter(dayjs());

            const newNotification: Notification = {
                id: Date.now().toString(),
                ...values,
                status: isScheduled ? 'SCHEDULED' : 'SENT',
                sentAt: isScheduled ? undefined : new Date().toISOString(),
                scheduledFor: values.scheduledFor?.toISOString(),
                createdAt: new Date().toISOString(),
                recipientCount: isScheduled ? 0 : Math.floor(Math.random() * 10000) + 1000,
            };

            setNotifications(prev => [newNotification, ...prev]);
            message.success(isScheduled ? 'Notification scheduled successfully' : 'Notification sent successfully');
            setModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error('Failed to send notification');
        }
    };

    const columns = [
        {
            title: 'Notification',
            key: 'notification',
            render: (_: any, record: Notification) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{record.message.substring(0, 80)}...</div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag color={typeColors[type]}>{type}</Tag>,
        },
        {
            title: 'Audience',
            dataIndex: 'targetAudience',
            key: 'targetAudience',
            render: (audience: string) => <Tag>{audience}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: Notification) => (
                <Space direction="vertical" size={0}>
                    <Tag color={statusColors[status]}>{status}</Tag>
                    {record.status === 'SCHEDULED' && record.scheduledFor && (
                        <span style={{ fontSize: 11, color: '#64748b' }}>{dayjs(record.scheduledFor).format('MMM D, h:mm A')}</span>
                    )}
                </Space>
            ),
        },
        {
            title: 'Recipients',
            dataIndex: 'recipientCount',
            key: 'recipientCount',
            render: (count: number) => count > 0 ? count.toLocaleString() : '-',
        },
        {
            title: 'Sent',
            key: 'sentAt',
            render: (_: any, record: Notification) => record.sentAt ? dayjs(record.sentAt).fromNow() : '-',
        },
    ];

    const stats = {
        total: notifications.length,
        sent: notifications.filter(n => n.status === 'SENT').length,
        scheduled: notifications.filter(n => n.status === 'SCHEDULED').length,
        totalRecipients: notifications.reduce((sum, n) => sum + n.recipientCount, 0),
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>Notification Center</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    New Notification
                </Button>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Notifications" value={stats.total} prefix={<BellOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Sent" value={stats.sent} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Scheduled" value={stats.scheduled} valueStyle={{ color: '#1890ff' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Recipients" value={stats.totalRecipients} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Table
                    columns={columns}
                    dataSource={notifications}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showTotal: (t) => `${t} notifications` }}
                />
            </Card>

            {/* Create Notification Modal */}
            <Modal
                title="Send New Notification"
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSend}
                    initialValues={{ type: 'ALL', targetAudience: 'ALL' }}
                >
                    <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
                        <Input placeholder="Notification title" />
                    </Form.Item>

                    <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                        <Input.TextArea rows={3} placeholder="Notification message" maxLength={500} showCount />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="ALL">
                                        <Space><BellOutlined /> All Channels</Space>
                                    </Select.Option>
                                    <Select.Option value="PUSH">
                                        <Space><MobileOutlined /> Push Only</Space>
                                    </Select.Option>
                                    <Select.Option value="EMAIL">
                                        <Space><MailOutlined /> Email Only</Space>
                                    </Select.Option>
                                    <Select.Option value="IN_APP">
                                        <Space><BellOutlined /> In-App Only</Space>
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="targetAudience" label="Target Audience" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="ALL">
                                        <Space><TeamOutlined /> All Users</Space>
                                    </Select.Option>
                                    <Select.Option value="PREMIUM">
                                        <Space><UserOutlined /> Premium Users</Space>
                                    </Select.Option>
                                    <Select.Option value="FREE">
                                        <Space><UserOutlined /> Free Users</Space>
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="scheduledFor" label="Schedule For (Optional)">
                        <DatePicker
                            showTime
                            style={{ width: '100%' }}
                            placeholder="Leave empty to send immediately"
                            disabledDate={(current) => current && current < dayjs().startOf('day')}
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                                Send Notification
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default NotificationCenter;
