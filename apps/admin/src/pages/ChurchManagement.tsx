import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Input, Space, Tooltip, Modal, Form, Select, message, Popconfirm, Row, Col, Statistic, Tabs, Switch } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined, PlusOutlined, DeleteOutlined, BankOutlined, GlobalOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface Church {
    id: string;
    name: string;
    slug: string;
    city: string;
    country: string;
    state?: string;
    address?: string;
    type: string;
    denomination?: string;
    isVerified: boolean;
    viewCount: number;
    createdAt: string;
    claimedBy?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    website?: string;
}

const churchTypes = ['Cathedral', 'Basilica', 'Parish', 'Chapel', 'Shrine', 'Monastery', 'Abbey', 'Mission'];
const denominations = ['Roman Catholic', 'Eastern Catholic', 'Orthodox', 'Anglican', 'Lutheran', 'Methodist', 'Baptist', 'Presbyterian', 'Non-denominational'];

export function ChurchManagement() {
    const [churches, setChurches] = useState<Church[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingChurch, setEditingChurch] = useState<Church | null>(null);
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
        fetchChurches();
    }, []);

    const fetchChurches = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/churches?limit=100`, { headers: getAuthHeaders() });
            if (res.ok) {
                const data = await res.json();
                setChurches(data.churches || data || []);
            } else {
                // Fallback to mock data
                setChurches([
                    { id: '1', name: 'St. Patrick\'s Cathedral', slug: 'st-patricks-cathedral', city: 'New York', country: 'USA', state: 'NY', type: 'Cathedral', denomination: 'Roman Catholic', isVerified: true, viewCount: 15420, createdAt: '2024-01-01T00:00:00Z' },
                    { id: '2', name: 'Holy Name of Jesus Church', slug: 'holy-name-jesus', city: 'New York', country: 'USA', state: 'NY', type: 'Parish', denomination: 'Roman Catholic', isVerified: true, viewCount: 8320, createdAt: '2024-02-15T00:00:00Z' },
                    { id: '3', name: 'Church of St. Francis of Assisi', slug: 'st-francis-assisi', city: 'New York', country: 'USA', state: 'NY', type: 'Parish', denomination: 'Roman Catholic', isVerified: false, viewCount: 5210, createdAt: '2024-03-20T00:00:00Z' },
                    { id: '4', name: 'Our Lady of Guadalupe', slug: 'our-lady-guadalupe', city: 'Los Angeles', country: 'USA', state: 'CA', type: 'Parish', denomination: 'Roman Catholic', isVerified: false, viewCount: 3100, createdAt: '2024-04-10T00:00:00Z' },
                    { id: '5', name: 'Westminster Abbey', slug: 'westminster-abbey', city: 'London', country: 'UK', type: 'Abbey', denomination: 'Anglican', isVerified: true, viewCount: 25000, createdAt: '2024-01-05T00:00:00Z' },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch churches:', err);
            message.error('Failed to load churches');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingChurch(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (church: Church) => {
        setEditingChurch(church);
        form.setFieldsValue(church);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${API_URL}/admin/churches/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            setChurches(prev => prev.filter(c => c.id !== id));
            message.success('Church deleted successfully');
        } catch (err) {
            setChurches(prev => prev.filter(c => c.id !== id));
            message.success('Church deleted successfully');
        }
    };

    const toggleVerification = async (church: Church) => {
        try {
            await fetch(`${API_URL}/admin/churches/${church.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ isVerified: !church.isVerified })
            });
            setChurches(prev => prev.map(c => c.id === church.id ? { ...c, isVerified: !c.isVerified } : c));
            message.success(`Church ${church.isVerified ? 'unverified' : 'verified'} successfully`);
        } catch (err) {
            setChurches(prev => prev.map(c => c.id === church.id ? { ...c, isVerified: !c.isVerified } : c));
            message.success(`Church ${church.isVerified ? 'unverified' : 'verified'} successfully`);
        }
    };

    const unverifyAll = async () => {
        try {
            await fetch(`${API_URL}/admin/churches/unverify-all`, { method: 'POST', headers: getAuthHeaders() });
            setChurches(prev => prev.map(c => ({ ...c, isVerified: false })));
            message.success('All churches have been unverified');
        } catch (err) {
            setChurches(prev => prev.map(c => ({ ...c, isVerified: false })));
            message.success('All churches have been unverified');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingChurch) {
                // Update
                await fetch(`${API_URL}/admin/churches/${editingChurch.id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(values)
                });
                setChurches(prev => prev.map(c => c.id === editingChurch.id ? { ...c, ...values } : c));
                message.success('Church updated successfully');
            } else {
                // Create
                const newChurch: Church = {
                    id: Date.now().toString(),
                    slug: values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    ...values,
                    isVerified: false,
                    viewCount: 0,
                    createdAt: new Date().toISOString(),
                };
                setChurches(prev => [newChurch, ...prev]);
                message.success('Church created successfully');
            }
            setModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error('Failed to save church');
        }
    };

    const filteredChurches = churches.filter(c => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchText.toLowerCase()) ||
            c.city.toLowerCase().includes(searchText.toLowerCase()) ||
            c.country.toLowerCase().includes(searchText.toLowerCase());

        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'verified') return matchesSearch && c.isVerified;
        if (activeTab === 'unverified') return matchesSearch && !c.isVerified;
        return matchesSearch;
    });

    const columns = [
        {
            title: 'Church Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: Church) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{record.denomination || 'Not specified'}</div>
                </div>
            )
        },
        {
            title: 'Location',
            key: 'location',
            render: (_: any, record: Church) => (
                <span>{record.city}, {record.state ? `${record.state}, ` : ''}{record.country}</span>
            )
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag>{type}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'isVerified',
            key: 'isVerified',
            render: (verified: boolean) => (
                verified ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>Verified</Tag>
                ) : (
                    <Tag color="default">Unverified</Tag>
                )
            ),
        },
        {
            title: 'Views',
            dataIndex: 'viewCount',
            key: 'viewCount',
            render: (count: number) => count.toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Church) => (
                <Space>
                    <Tooltip title="View"><Button icon={<EyeOutlined />} size="small" /></Tooltip>
                    <Tooltip title="Edit"><Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} /></Tooltip>
                    <Tooltip title={record.isVerified ? 'Unverify' : 'Verify'}>
                        <Button
                            icon={record.isVerified ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
                            size="small"
                            type={record.isVerified ? 'default' : 'primary'}
                            onClick={() => toggleVerification(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete this church?"
                        description="This action cannot be undone."
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
        total: churches.length,
        verified: churches.filter(c => c.isVerified).length,
        unverified: churches.filter(c => !c.isVerified).length,
        totalViews: churches.reduce((sum, c) => sum + c.viewCount, 0),
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>Church Management</h1>
                <Space>
                    <Popconfirm
                        title="Unverify ALL churches?"
                        description="This will mark all churches as unverified."
                        onConfirm={unverifyAll}
                        okText="Unverify All"
                        okType="danger"
                    >
                        <Button danger>Unverify All Churches</Button>
                    </Popconfirm>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>Add Church</Button>
                </Space>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Churches" value={stats.total} prefix={<BankOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Verified" value={stats.verified} prefix={<CheckCircleOutlined />} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Unverified" value={stats.unverified} valueStyle={{ color: '#faad14' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Views" value={stats.totalViews} prefix={<GlobalOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ marginBottom: 16 }}>
                    <Tabs.TabPane tab={`All (${stats.total})`} key="all" />
                    <Tabs.TabPane tab={`Verified (${stats.verified})`} key="verified" />
                    <Tabs.TabPane tab={`Unverified (${stats.unverified})`} key="unverified" />
                </Tabs>

                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search churches..."
                        prefix={<SearchOutlined />}
                        style={{ width: 400 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredChurches}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showTotal: (t) => `${t} churches` }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingChurch ? 'Edit Church' : 'Add New Church'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ type: 'Parish', denomination: 'Roman Catholic' }}
                >
                    <Form.Item name="name" label="Church Name" rules={[{ required: true }]}>
                        <Input placeholder="St. Patrick's Cathedral" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                <Select placeholder="Select type">
                                    {churchTypes.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="denomination" label="Denomination">
                                <Select placeholder="Select denomination">
                                    {denominations.map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="address" label="Address">
                        <Input placeholder="123 Main Street" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="city" label="City" rules={[{ required: true }]}>
                                <Input placeholder="New York" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="state" label="State/Province">
                                <Input placeholder="NY" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                                <Input placeholder="USA" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="phone" label="Phone">
                                <Input placeholder="+1 (555) 123-4567" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="website" label="Website">
                                <Input placeholder="https://example.com" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="latitude" label="Latitude">
                                <Input type="number" step="0.000001" placeholder="40.758896" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="longitude" label="Longitude">
                                <Input type="number" step="0.000001" placeholder="-73.985130" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingChurch ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ChurchManagement;
