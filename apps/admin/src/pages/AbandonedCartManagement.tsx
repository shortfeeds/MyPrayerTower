'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    Tag,
    Space,
    Modal,
    Popconfirm,
    message,
    Statistic,
    Row,
    Col,
    Select,
    Input,
    Tooltip,
    Badge,
    Descriptions,
    Typography,
} from 'antd';
import {
    ShoppingCartOutlined,
    MailOutlined,
    BellOutlined,
    CheckCircleOutlined,
    DeleteOutlined,
    EyeOutlined,
    ReloadOutlined,
    DollarOutlined,
    ClockCircleOutlined,
    SendOutlined,
} from '@ant-design/icons';

const { Search } = Input;
const { Text, Title } = Typography;

interface AbandonedCart {
    id: string;
    type: string;
    email: string;
    name?: string;
    phone?: string;
    data: any;
    step: string;
    reminderCount: number;
    lastReminder?: string;
    converted: boolean;
    convertedAt?: string;
    createdAt: string;
    cartValue?: { items: { name: string; price: number }[]; total: number };
}

interface CartStats {
    total: number;
    today: number;
    converted: number;
    pending: number;
    conversionRate: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export default function AbandonedCartManagement() {
    const [carts, setCarts] = useState<AbandonedCart[]>([]);
    const [stats, setStats] = useState<CartStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [filters, setFilters] = useState({ type: '', converted: '' });
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchCarts();
        fetchStats();
    }, [page, filters]);

    const fetchCarts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: '20',
                ...(filters.type && { type: filters.type }),
                ...(filters.converted && { converted: filters.converted }),
            });
            const res = await fetch(`${API_BASE}/admin/abandoned-carts?${params}`);
            const data = await res.json();
            setCarts(data.carts || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error('Failed to fetch carts:', err);
            // Mock data for development
            setCarts([
                {
                    id: '1',
                    type: 'CANDLE',
                    email: 'john@example.com',
                    name: 'John Doe',
                    step: 'payment',
                    data: { duration: 'SEVEN_DAYS', intention: 'For my family' },
                    reminderCount: 1,
                    converted: false,
                    createdAt: new Date().toISOString(),
                    cartValue: { items: [{ name: 'Candle (7 Days)', price: 5.99 }], total: 5.99 },
                },
                {
                    id: '2',
                    type: 'MASS',
                    email: 'jane@example.com',
                    name: 'Jane Smith',
                    step: 'details',
                    data: { massType: 'novena', intention: 'For healing' },
                    reminderCount: 0,
                    converted: false,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    cartValue: { items: [{ name: 'Mass Offering (novena)', price: 50 }], total: 50 },
                },
            ]);
            setTotal(2);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/abandoned-carts/stats`);
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setStats({ total: 15, today: 3, converted: 5, pending: 7, conversionRate: '33.3' });
        }
    };

    const handleSendReminder = async (id: string, method: 'email' | 'push' | 'both') => {
        try {
            const res = await fetch(`${API_BASE}/admin/abandoned-carts/${id}/remind`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: method === 'email' || method === 'both',
                    push: method === 'push' || method === 'both',
                }),
            });
            if (res.ok) {
                message.success(`Reminder sent successfully via ${method}`);
                fetchCarts();
            } else {
                message.error('Failed to send reminder');
            }
        } catch (err) {
            message.error('Failed to send reminder');
        }
    };

    const handleBulkRemind = async () => {
        if (selectedRowKeys.length === 0) {
            message.warning('Please select carts to remind');
            return;
        }
        try {
            const res = await fetch(`${API_BASE}/admin/abandoned-carts/bulk-remind`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedRowKeys, email: true, push: true }),
            });
            const data = await res.json();
            message.success(`Sent ${data.sent} reminders`);
            setSelectedRowKeys([]);
            fetchCarts();
        } catch (err) {
            message.error('Failed to send bulk reminders');
        }
    };

    const handleMarkConverted = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/admin/abandoned-carts/${id}/convert`, {
                method: 'PATCH',
            });
            if (res.ok) {
                message.success('Marked as converted');
                fetchCarts();
                fetchStats();
            }
        } catch (err) {
            message.error('Failed to update');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_BASE}/admin/abandoned-carts/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                message.success('Cart deleted');
                fetchCarts();
                fetchStats();
            }
        } catch (err) {
            message.error('Failed to delete');
        }
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            CANDLE: 'orange',
            MASS: 'purple',
            DONATION: 'green',
            MEMORIAL: 'blue',
            OFFERING: 'gold',
        };
        return colors[type] || 'default';
    };

    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag color={getTypeColor(type)}>{type}</Tag>,
        },
        {
            title: 'Customer',
            key: 'customer',
            render: (_: any, record: AbandonedCart) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.name || 'Anonymous'}</div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
                </div>
            ),
        },
        {
            title: 'Cart Value',
            key: 'value',
            render: (_: any, record: AbandonedCart) => (
                <Text strong style={{ color: '#52c41a' }}>
                    ${record.cartValue?.total?.toFixed(2) || '0.00'}
                </Text>
            ),
            sorter: (a: AbandonedCart, b: AbandonedCart) =>
                (a.cartValue?.total || 0) - (b.cartValue?.total || 0),
        },
        {
            title: 'Step',
            dataIndex: 'step',
            key: 'step',
            render: (step: string) => <Tag>{step}</Tag>,
        },
        {
            title: 'Reminders',
            dataIndex: 'reminderCount',
            key: 'reminders',
            render: (count: number) => (
                <Badge count={count} style={{ backgroundColor: count > 0 ? '#faad14' : '#d9d9d9' }} />
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_: any, record: AbandonedCart) =>
                record.converted ? (
                    <Tag color="success" icon={<CheckCircleOutlined />}>
                        Converted
                    </Tag>
                ) : (
                    <Tag color="warning" icon={<ClockCircleOutlined />}>
                        Pending
                    </Tag>
                ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AbandonedCart) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedCart(record);
                                setDetailsOpen(true);
                            }}
                        />
                    </Tooltip>
                    {!record.converted && (
                        <>
                            <Tooltip title="Send Email">
                                <Button
                                    type="text"
                                    icon={<MailOutlined />}
                                    onClick={() => handleSendReminder(record.id, 'email')}
                                />
                            </Tooltip>
                            <Tooltip title="Send Push">
                                <Button
                                    type="text"
                                    icon={<BellOutlined />}
                                    onClick={() => handleSendReminder(record.id, 'push')}
                                />
                            </Tooltip>
                            <Tooltip title="Mark Converted">
                                <Button
                                    type="text"
                                    icon={<CheckCircleOutlined />}
                                    style={{ color: '#52c41a' }}
                                    onClick={() => handleMarkConverted(record.id)}
                                />
                            </Tooltip>
                        </>
                    )}
                    <Popconfirm
                        title="Delete this cart?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>
                    <ShoppingCartOutlined style={{ marginRight: 12 }} />
                    Abandoned Carts
                </Title>
                <Button icon={<ReloadOutlined />} onClick={() => { fetchCarts(); fetchStats(); }}>
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Abandoned"
                            value={stats?.total || 0}
                            prefix={<ShoppingCartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Today"
                            value={stats?.today || 0}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Converted"
                            value={stats?.converted || 0}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Conversion Rate"
                            value={stats?.conversionRate || '0'}
                            suffix="%"
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters & Bulk Actions */}
            <Card style={{ marginBottom: 16 }}>
                <Space wrap>
                    <Select
                        placeholder="Filter by Type"
                        style={{ width: 150 }}
                        allowClear
                        value={filters.type || undefined}
                        onChange={v => setFilters({ ...filters, type: v || '' })}
                    >
                        <Select.Option value="CANDLE">Candle</Select.Option>
                        <Select.Option value="MASS">Mass Offering</Select.Option>
                        <Select.Option value="DONATION">Donation</Select.Option>
                        <Select.Option value="MEMORIAL">Memorial</Select.Option>
                    </Select>
                    <Select
                        placeholder="Status"
                        style={{ width: 150 }}
                        allowClear
                        value={filters.converted || undefined}
                        onChange={v => setFilters({ ...filters, converted: v || '' })}
                    >
                        <Select.Option value="false">Pending</Select.Option>
                        <Select.Option value="true">Converted</Select.Option>
                    </Select>
                    {selectedRowKeys.length > 0 && (
                        <Button
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={handleBulkRemind}
                        >
                            Send Reminders ({selectedRowKeys.length})
                        </Button>
                    )}
                </Space>
            </Card>

            {/* Table */}
            <Card>
                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: keys => setSelectedRowKeys(keys as string[]),
                        getCheckboxProps: (record) => ({
                            disabled: record.converted,
                        }),
                    }}
                    columns={columns}
                    dataSource={carts}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: page,
                        total,
                        pageSize: 20,
                        onChange: p => setPage(p),
                        showTotal: t => `${t} carts`,
                    }}
                />
            </Card>

            {/* Details Modal */}
            <Modal
                title="Cart Details"
                open={detailsOpen}
                onCancel={() => setDetailsOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailsOpen(false)}>
                        Close
                    </Button>,
                    !selectedCart?.converted && (
                        <Button
                            key="remind"
                            type="primary"
                            icon={<SendOutlined />}
                            onClick={() => {
                                if (selectedCart) handleSendReminder(selectedCart.id, 'both');
                                setDetailsOpen(false);
                            }}
                        >
                            Send Reminder (Email + Push)
                        </Button>
                    ),
                ]}
                width={600}
            >
                {selectedCart && (
                    <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Type" span={1}>
                            <Tag color={getTypeColor(selectedCart.type)}>{selectedCart.type}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Status" span={1}>
                            {selectedCart.converted ? (
                                <Tag color="success">Converted</Tag>
                            ) : (
                                <Tag color="warning">Pending</Tag>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Name" span={1}>
                            {selectedCart.name || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email" span={1}>
                            {selectedCart.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone" span={2}>
                            {selectedCart.phone || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Step" span={1}>
                            {selectedCart.step}
                        </Descriptions.Item>
                        <Descriptions.Item label="Reminders Sent" span={1}>
                            {selectedCart.reminderCount}
                        </Descriptions.Item>
                        <Descriptions.Item label="Cart Items" span={2}>
                            {selectedCart.cartValue?.items.map((item, i) => (
                                <div key={i}>
                                    {item.name}: <strong>${item.price.toFixed(2)}</strong>
                                </div>
                            ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="Total Value" span={2}>
                            <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                                ${selectedCart.cartValue?.total?.toFixed(2) || '0.00'}
                            </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Created" span={1}>
                            {new Date(selectedCart.createdAt).toLocaleString()}
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Reminder" span={1}>
                            {selectedCart.lastReminder
                                ? new Date(selectedCart.lastReminder).toLocaleString()
                                : 'Never'}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
}
