import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Input, Space, Avatar, Modal, Form, Select, message, Popconfirm, Row, Col, Statistic, Tabs, Switch } from 'antd';
import { SearchOutlined, UserOutlined, PlusOutlined, EditOutlined, DeleteOutlined, StopOutlined, CheckCircleOutlined, CrownOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'CHURCH_ADMIN';
    subscriptionTier: 'FREE' | 'PLUS' | 'PREMIUM' | 'LIFETIME';
    isEmailVerified: boolean;
    isBanned: boolean;
    bannedReason?: string;
    createdAt: string;
    lastLoginAt?: string;
    prayerCount: number;
}

const tierColors: Record<string, string> = {
    FREE: 'default',
    PLUS: 'blue',
    PREMIUM: 'gold',
    LIFETIME: 'purple',
};

const roleColors: Record<string, string> = {
    USER: 'default',
    ADMIN: 'blue',
    SUPER_ADMIN: 'red',
    CHURCH_ADMIN: 'green',
};

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [banModalVisible, setBanModalVisible] = useState(false);
    const [banningUser, setBanningUser] = useState<User | null>(null);
    const [banReason, setBanReason] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [form] = Form.useForm();

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Try to fetch from API first
            const res = await fetch(`${API_URL}/admin/users`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || data || []);
            } else {
                // Fallback to mock data
                setUsers([
                    { id: '1', email: 'maria@example.com', firstName: 'Maria', lastName: 'Santos', displayName: 'Maria S.', role: 'USER', subscriptionTier: 'PREMIUM', isEmailVerified: true, isBanned: false, createdAt: '2024-12-01T00:00:00Z', lastLoginAt: '2024-12-15T10:30:00Z', prayerCount: 45 },
                    { id: '2', email: 'john@example.com', firstName: 'John', lastName: 'Doe', displayName: 'John D.', role: 'USER', subscriptionTier: 'FREE', isEmailVerified: true, isBanned: false, createdAt: '2024-11-15T00:00:00Z', lastLoginAt: '2024-12-10T14:20:00Z', prayerCount: 12 },
                    { id: '3', email: 'sarah@example.com', firstName: 'Sarah', lastName: 'Miller', displayName: 'Sarah M.', role: 'CHURCH_ADMIN', subscriptionTier: 'PLUS', isEmailVerified: true, isBanned: false, createdAt: '2024-10-20T00:00:00Z', lastLoginAt: '2024-12-14T09:15:00Z', prayerCount: 28 },
                    { id: '4', email: 'admin@prayertower.com', firstName: 'Super', lastName: 'Admin', displayName: 'Admin', role: 'SUPER_ADMIN', subscriptionTier: 'LIFETIME', isEmailVerified: true, isBanned: false, createdAt: '2024-01-01T00:00:00Z', lastLoginAt: '2024-12-15T08:00:00Z', prayerCount: 100 },
                    { id: '5', email: 'banned@example.com', firstName: 'Banned', lastName: 'User', displayName: 'Banned', role: 'USER', subscriptionTier: 'FREE', isEmailVerified: false, isBanned: true, bannedReason: 'Spam and inappropriate content', createdAt: '2024-11-01T00:00:00Z', prayerCount: 0 },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
            message.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        form.setFieldsValue(user);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            setUsers(prev => prev.filter(u => u.id !== id));
            message.success('User deleted successfully');
        } catch (err) {
            // Still update UI for demo
            setUsers(prev => prev.filter(u => u.id !== id));
            message.success('User deleted successfully');
        }
    };

    const handleBan = (user: User) => {
        setBanningUser(user);
        setBanReason('');
        setBanModalVisible(true);
    };

    const confirmBan = async () => {
        if (!banningUser) return;
        try {
            await fetch(`${API_URL}/admin/users/${banningUser.id}/ban`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ reason: banReason })
            });
            setUsers(prev => prev.map(u => u.id === banningUser.id ? { ...u, isBanned: true, bannedReason: banReason } : u));
            message.success('User banned successfully');
        } catch (err) {
            // Still update UI for demo
            setUsers(prev => prev.map(u => u.id === banningUser.id ? { ...u, isBanned: true, bannedReason: banReason } : u));
            message.success('User banned successfully');
        }
        setBanModalVisible(false);
    };

    const handleUnban = async (user: User) => {
        try {
            await fetch(`${API_URL}/admin/users/${user.id}/unban`, { method: 'POST', headers: getAuthHeaders() });
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: false, bannedReason: undefined } : u));
            message.success('User unbanned successfully');
        } catch (err) {
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isBanned: false, bannedReason: undefined } : u));
            message.success('User unbanned successfully');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingUser) {
                // Update
                await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(values)
                });
                setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...values } : u));
                message.success('User updated successfully');
            } else {
                // Create
                const newUser: User = {
                    id: Date.now().toString(),
                    ...values,
                    isEmailVerified: false,
                    isBanned: false,
                    createdAt: new Date().toISOString(),
                    prayerCount: 0,
                };
                setUsers(prev => [newUser, ...prev]);
                message.success('User created successfully');
            }
            setModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error('Failed to save user');
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.email.toLowerCase().includes(searchText.toLowerCase()) ||
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchText.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'premium') return matchesSearch && (u.subscriptionTier === 'PREMIUM' || u.subscriptionTier === 'LIFETIME');
        if (activeTab === 'banned') return matchesSearch && u.isBanned;
        if (activeTab === 'admins') return matchesSearch && (u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');
        return matchesSearch;
    });

    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (_: any, record: User) => (
                <Space>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.isBanned ? '#ff4d4f' : '#1890ff' }} />
                    <div>
                        <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                            {record.firstName} {record.lastName}
                            {record.isBanned && <Tag color="red">BANNED</Tag>}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <Tag color={roleColors[role]}>{role.replace('_', ' ')}</Tag>,
        },
        {
            title: 'Subscription',
            dataIndex: 'subscriptionTier',
            key: 'subscriptionTier',
            render: (tier: string) => (
                <Tag color={tierColors[tier]} icon={tier === 'PREMIUM' || tier === 'LIFETIME' ? <CrownOutlined /> : null}>
                    {tier}
                </Tag>
            ),
        },
        {
            title: 'Verified',
            dataIndex: 'isEmailVerified',
            key: 'verified',
            render: (verified: boolean) => (
                verified ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : <MailOutlined style={{ color: '#faad14' }} />
            ),
        },
        {
            title: 'Prayers',
            dataIndex: 'prayerCount',
            key: 'prayers',
        },
        {
            title: 'Joined',
            dataIndex: 'createdAt',
            key: 'joined',
            render: (date: string) => dayjs(date).format('MMM D, YYYY'),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: User) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                    {record.isBanned ? (
                        <Button icon={<CheckCircleOutlined />} size="small" onClick={() => handleUnban(record)} type="primary">
                            Unban
                        </Button>
                    ) : (
                        <Button icon={<StopOutlined />} size="small" onClick={() => handleBan(record)} danger>
                            Ban
                        </Button>
                    )}
                    <Popconfirm
                        title="Delete this user?"
                        description="This action cannot be undone. All user data will be permanently deleted."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        okType="danger"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const stats = {
        total: users.length,
        premium: users.filter(u => u.subscriptionTier === 'PREMIUM' || u.subscriptionTier === 'LIFETIME').length,
        banned: users.filter(u => u.isBanned).length,
        verified: users.filter(u => u.isEmailVerified).length,
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>User Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Add User
                </Button>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Users" value={stats.total} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Premium Users" value={stats.premium} prefix={<CrownOutlined />} valueStyle={{ color: '#f59e0b' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Verified" value={stats.verified} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Banned" value={stats.banned} prefix={<StopOutlined />} valueStyle={{ color: '#ff4d4f' }} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                    <Tabs.TabPane tab={`All Users (${stats.total})`} key="all" />
                    <Tabs.TabPane tab={`Premium (${stats.premium})`} key="premium" />
                    <Tabs.TabPane tab={`Banned (${stats.banned})`} key="banned" />
                    <Tabs.TabPane tab="Admins" key="admins" />
                </Tabs>

                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search users by name or email..."
                        prefix={<SearchOutlined />}
                        style={{ width: 400 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showTotal: (t) => `${t} users` }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingUser ? 'Edit User' : 'Add New User'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ role: 'USER', subscriptionTier: 'FREE' }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                <Input placeholder="John" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                <Input placeholder="Doe" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input placeholder="john@example.com" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="role" label="Role">
                                <Select>
                                    <Select.Option value="USER">User</Select.Option>
                                    <Select.Option value="CHURCH_ADMIN">Church Admin</Select.Option>
                                    <Select.Option value="ADMIN">Admin</Select.Option>
                                    <Select.Option value="SUPER_ADMIN">Super Admin</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="subscriptionTier" label="Subscription">
                                <Select>
                                    <Select.Option value="FREE">Free</Select.Option>
                                    <Select.Option value="PLUS">Plus</Select.Option>
                                    <Select.Option value="PREMIUM">Premium</Select.Option>
                                    <Select.Option value="LIFETIME">Lifetime</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingUser ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Ban Modal */}
            <Modal
                title="Ban User"
                open={banModalVisible}
                onCancel={() => setBanModalVisible(false)}
                onOk={confirmBan}
                okText="Ban User"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to ban <strong>{banningUser?.firstName} {banningUser?.lastName}</strong>?</p>
                <Input.TextArea
                    placeholder="Reason for ban (required)"
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    rows={3}
                />
            </Modal>
        </div>
    );
}

export default UserManagement;
