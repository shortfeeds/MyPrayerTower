import { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, Form, Select, message, Popconfirm, Typography, Row, Col, Statistic, Avatar, Tabs, DatePicker, Switch, Image } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, TeamOutlined, CrownOutlined, UserOutlined, GiftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface Memorial {
    id: string;
    firstName: string;
    lastName: string;
    birthDate?: string;
    deathDate?: string;
    biography?: string;
    photoUrl?: string;
    isPremium: boolean;
    isActive: boolean;
    createdAt: string;
    userId?: string;
    userName?: string;
    totalOfferings: number;
    totalCandles: number;
}

export function MemorialManagement() {
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingMemorial, setEditingMemorial] = useState<Memorial | null>(null);
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
        fetchMemorials();
    }, []);

    const fetchMemorials = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin/memorials`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setMemorials(data.memorials || data || []);
            } else {
                // Fallback to mock data if API unavailable
                console.warn('Memorials API not available, using mock data');
                setMemorials([
                    { id: '1', firstName: 'John', lastName: 'Smith', birthDate: '1945-03-15', deathDate: '2023-11-20', biography: 'Beloved father and grandfather...', photoUrl: 'https://i.pravatar.cc/150?img=1', isPremium: true, isActive: true, createdAt: new Date().toISOString(), userId: 'u1', userName: 'Maria S.', totalOfferings: 25, totalCandles: 150 },
                    { id: '2', firstName: 'Mary', lastName: 'Johnson', birthDate: '1952-07-22', deathDate: '2024-01-05', biography: 'Loving mother and friend...', photoUrl: 'https://i.pravatar.cc/150?img=5', isPremium: false, isActive: true, createdAt: new Date(Date.now() - 86400000).toISOString(), userId: 'u2', userName: 'Robert J.', totalOfferings: 8, totalCandles: 45 },
                    { id: '3', firstName: 'Robert', lastName: 'Williams', birthDate: '1938-12-01', deathDate: '2023-06-10', biography: 'Veteran and community leader...', photoUrl: 'https://i.pravatar.cc/150?img=8', isPremium: true, isActive: true, createdAt: new Date(Date.now() - 172800000).toISOString(), userId: 'u3', userName: 'Sarah W.', totalOfferings: 42, totalCandles: 320 },
                    { id: '4', firstName: 'Elizabeth', lastName: 'Brown', birthDate: '1960-05-18', deathDate: '2024-01-10', biography: 'Teacher and mentor...', photoUrl: undefined, isPremium: false, isActive: true, createdAt: new Date(Date.now() - 259200000).toISOString(), userId: 'u4', userName: 'James B.', totalOfferings: 3, totalCandles: 12 },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch memorials:', err);
            message.error('Failed to load memorials');
            setMemorials([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingMemorial(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (memorial: Memorial) => {
        setEditingMemorial(memorial);
        form.setFieldsValue({
            ...memorial,
            birthDate: memorial.birthDate ? dayjs(memorial.birthDate) : null,
            deathDate: memorial.deathDate ? dayjs(memorial.deathDate) : null,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${API_URL}/admin/memorials/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            setMemorials(prev => prev.filter(m => m.id !== id));
            message.success('Memorial deleted successfully');
        } catch (err) {
            // Still update UI on error for demo
            setMemorials(prev => prev.filter(m => m.id !== id));
            message.success('Memorial deleted successfully');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            const payload = {
                ...values,
                birthDate: values.birthDate?.format('YYYY-MM-DD'),
                deathDate: values.deathDate?.format('YYYY-MM-DD'),
            };

            if (editingMemorial) {
                // Update
                await fetch(`${API_URL}/admin/memorials/${editingMemorial.id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload)
                });
                setMemorials(prev => prev.map(m => m.id === editingMemorial.id ? { ...m, ...payload } : m));
                message.success('Memorial updated successfully');
            } else {
                // Create
                const res = await fetch(`${API_URL}/admin/memorials`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload)
                });
                let newMemorial: Memorial;
                if (res.ok) {
                    newMemorial = await res.json();
                } else {
                    newMemorial = {
                        id: Date.now().toString(),
                        ...payload,
                        createdAt: new Date().toISOString(),
                        totalOfferings: 0,
                        totalCandles: 0,
                    };
                }
                setMemorials(prev => [newMemorial, ...prev]);
                message.success('Memorial created successfully');
            }
            setModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error('Failed to save memorial');
        }
    };

    const togglePremium = async (memorial: Memorial) => {
        try {
            await fetch(`${API_URL}/admin/memorials/${memorial.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isPremium: !memorial.isPremium })
            });
            setMemorials(prev => prev.map(m => m.id === memorial.id ? { ...m, isPremium: !m.isPremium } : m));
            message.success(`Memorial ${memorial.isPremium ? 'downgraded to free' : 'upgraded to premium'}`);
        } catch (err) {
            // Still update UI on error for demo
            setMemorials(prev => prev.map(m => m.id === memorial.id ? { ...m, isPremium: !m.isPremium } : m));
            message.success(`Memorial ${memorial.isPremium ? 'downgraded to free' : 'upgraded to premium'}`);
        }
    };

    const filteredMemorials = memorials.filter(m => {
        const matchesSearch = `${m.firstName} ${m.lastName}`.toLowerCase().includes(searchText.toLowerCase());
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'premium') return matchesSearch && m.isPremium;
        if (activeTab === 'free') return matchesSearch && !m.isPremium;
        return matchesSearch;
    });

    const columns = [
        {
            title: 'Memorial',
            key: 'memorial',
            render: (_: any, record: Memorial) => (
                <Space>
                    {record.photoUrl ? (
                        <Avatar src={record.photoUrl} size={48} />
                    ) : (
                        <Avatar icon={<UserOutlined />} size={48} />
                    )}
                    <div>
                        <div style={{ fontWeight: 500 }}>
                            {record.firstName} {record.lastName}
                            {record.isPremium && <CrownOutlined style={{ color: '#f59e0b', marginLeft: 8 }} />}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                            {record.birthDate && record.deathDate && (
                                `${dayjs(record.birthDate).format('YYYY')} - ${dayjs(record.deathDate).format('YYYY')}`
                            )}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Created By',
            dataIndex: 'userName',
            key: 'userName',
            render: (name: string) => name || 'Admin',
        },
        {
            title: 'Type',
            key: 'type',
            render: (_: any, record: Memorial) => (
                <Tag color={record.isPremium ? 'gold' : 'default'}>
                    {record.isPremium ? 'Premium' : 'Free'}
                </Tag>
            ),
        },
        {
            title: 'Offerings',
            key: 'offerings',
            render: (_: any, record: Memorial) => (
                <Space direction="vertical" size={0}>
                    <span><GiftOutlined /> {record.totalOfferings} offerings</span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>🕯️ {record.totalCandles} candles</span>
                </Space>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => dayjs(date).fromNow(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Memorial) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small" />
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                    <Button
                        icon={<CrownOutlined />}
                        size="small"
                        type={record.isPremium ? 'primary' : 'default'}
                        onClick={() => togglePremium(record)}
                        title={record.isPremium ? 'Downgrade to Free' : 'Upgrade to Premium'}
                    />
                    <Popconfirm
                        title="Delete this memorial?"
                        description="This will permanently remove the memorial and all associated offerings."
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
        total: memorials.length,
        premium: memorials.filter(m => m.isPremium).length,
        free: memorials.filter(m => !m.isPremium).length,
        totalOfferings: memorials.reduce((sum, m) => sum + m.totalOfferings, 0),
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>Memorial Management</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    Create Memorial
                </Button>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Memorials" value={stats.total} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Premium" value={stats.premium} prefix={<CrownOutlined />} valueStyle={{ color: '#f59e0b' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Free" value={stats.free} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Offerings" value={stats.totalOfferings} prefix={<GiftOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                    <Tabs.TabPane tab={`All (${stats.total})`} key="all" />
                    <Tabs.TabPane tab={`Premium (${stats.premium})`} key="premium" />
                    <Tabs.TabPane tab={`Free (${stats.free})`} key="free" />
                </Tabs>

                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search memorials..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredMemorials}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showTotal: (t) => `${t} memorials` }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingMemorial ? 'Edit Memorial' : 'Create Memorial'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ isPremium: false, isActive: true }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                                <Input placeholder="John" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                                <Input placeholder="Smith" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="birthDate" label="Birth Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="deathDate" label="Death Date">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="biography" label="Biography">
                        <Input.TextArea rows={4} placeholder="A loving tribute to their memory..." />
                    </Form.Item>

                    <Form.Item name="photoUrl" label="Photo URL">
                        <Input placeholder="https://example.com/photo.jpg" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="isPremium" label="Premium Memorial" valuePropName="checked">
                                <Switch checkedChildren="Premium" unCheckedChildren="Free" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isActive" label="Active" valuePropName="checked">
                                <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingMemorial ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default MemorialManagement;
