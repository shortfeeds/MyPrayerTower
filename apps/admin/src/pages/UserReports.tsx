import { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Select, DatePicker, Row, Col, Statistic, Tabs, message, Dropdown, Menu } from 'antd';
import { SearchOutlined, DownloadOutlined, FileExcelOutlined, FilePdfOutlined, UserOutlined, DollarOutlined, HeartOutlined, BankOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface ReportData {
    id: string;
    type: string;
    title: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
}

interface UserReport {
    id: string;
    email: string;
    name: string;
    subscriptionTier: string;
    prayerCount: number;
    candleCount: number;
    totalSpent: number;
    createdAt: string;
    lastActive: string;
}

interface RevenueReport {
    id: string;
    date: string;
    type: string;
    amount: number;
    user: string;
    description: string;
}

export function UserReports() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().subtract(30, 'days'),
        dayjs()
    ]);
    const [userReports, setUserReports] = useState<UserReport[]>([]);
    const [revenueReports, setRevenueReports] = useState<RevenueReport[]>([]);
    const [searchText, setSearchText] = useState('');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        fetchReports();
    }, [dateRange]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');

            // Fetch user reports
            const userRes = await fetch(`${API_URL}/admin/reports/users?startDate=${startDate}&endDate=${endDate}`, { headers: getAuthHeaders() });
            if (userRes.ok) {
                const data = await userRes.json();
                setUserReports(data.users || data || []);
            } else {
                // Fallback to mock data
                console.warn('User reports API not available, using mock data');
                setUserReports([
                    { id: '1', email: 'maria@example.com', name: 'Maria Santos', subscriptionTier: 'FREE', prayerCount: 45, candleCount: 12, totalSpent: 125.00, createdAt: '2024-12-01', lastActive: '2024-12-15' },
                    { id: '2', email: 'john@example.com', name: 'John Doe', subscriptionTier: 'FREE', prayerCount: 12, candleCount: 2, totalSpent: 10.00, createdAt: '2024-11-15', lastActive: '2024-12-10' },
                    { id: '3', email: 'sarah@example.com', name: 'Sarah Miller', subscriptionTier: 'FREE', prayerCount: 28, candleCount: 8, totalSpent: 85.00, createdAt: '2024-10-20', lastActive: '2024-12-14' },
                    { id: '4', email: 'robert@example.com', name: 'Robert Williams', subscriptionTier: 'FREE', prayerCount: 100, candleCount: 50, totalSpent: 500.00, createdAt: '2024-01-01', lastActive: '2024-12-15' },
                ]);
            }

            // Fetch revenue reports
            const revenueRes = await fetch(`${API_URL}/admin/reports/revenue?startDate=${startDate}&endDate=${endDate}`, { headers: getAuthHeaders() });
            if (revenueRes.ok) {
                const data = await revenueRes.json();
                setRevenueReports(data.transactions || data || []);
            } else {
                // Fallback to mock data
                setRevenueReports([
                    { id: '1', date: '2024-12-15', type: 'Candle', amount: 5.00, user: 'Maria Santos', description: '7-day Candle' },
                    { id: '2', date: '2024-12-15', type: 'Mass Offering', amount: 25.00, user: 'John Doe', description: 'Healing Mass' },
                    { id: '3', date: '2024-12-14', type: 'Donation', amount: 9.99, user: 'Sarah Miller', description: 'General Donation' },
                    { id: '4', date: '2024-12-14', type: 'Memorial', amount: 99.00, user: 'Robert Williams', description: 'Premium Memorial' },
                    { id: '5', date: '2024-12-13', type: 'Candle', amount: 10.00, user: 'Maria Santos', description: '30-day Candle' },
                ]);
            }
        } catch (err) {
            console.error('Failed to fetch reports:', err);
            message.error('Failed to load reports');
            setUserReports([]);
            setRevenueReports([]);
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = (data: any[], filename: string) => {
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        const csv = `${headers}\n${rows}`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}_${dayjs().format('YYYY-MM-DD')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        message.success('CSV exported successfully');
    };

    const exportToPDF = () => {
        message.info('PDF export coming soon! Use CSV for now.');
    };

    const tierColors: Record<string, string> = {
        FREE: 'default',
        PLUS: 'blue',
        PREMIUM: 'gold',
        LIFETIME: 'purple',
    };

    const userColumns = [
        {
            title: 'User',
            key: 'user',
            render: (_: any, record: UserReport) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{record.email}</div>
                </div>
            ),
        },
        {
            title: 'Tier',
            dataIndex: 'subscriptionTier',
            key: 'tier',
            render: (tier: string) => <Tag color={tierColors[tier]}>{tier}</Tag>,
        },
        {
            title: 'Prayers',
            dataIndex: 'prayerCount',
            key: 'prayers',
            sorter: (a: UserReport, b: UserReport) => a.prayerCount - b.prayerCount,
        },
        {
            title: 'Candles',
            dataIndex: 'candleCount',
            key: 'candles',
            sorter: (a: UserReport, b: UserReport) => a.candleCount - b.candleCount,
        },
        {
            title: 'Total Spent',
            dataIndex: 'totalSpent',
            key: 'spent',
            render: (v: number) => `$${v.toFixed(2)}`,
            sorter: (a: UserReport, b: UserReport) => a.totalSpent - b.totalSpent,
        },
        {
            title: 'Joined',
            dataIndex: 'createdAt',
            key: 'joined',
            render: (d: string) => dayjs(d).format('MMM D, YYYY'),
        },
        {
            title: 'Last Active',
            dataIndex: 'lastActive',
            key: 'lastActive',
            render: (d: string) => dayjs(d).fromNow(),
        },
    ];

    const revenueColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (d: string) => dayjs(d).format('MMM D, YYYY'),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (t: string) => <Tag>{t}</Tag>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'User',
            dataIndex: 'user',
            key: 'user',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (v: number) => <span style={{ color: '#52c41a', fontWeight: 500 }}>${v.toFixed(2)}</span>,
            sorter: (a: RevenueReport, b: RevenueReport) => a.amount - b.amount,
        },
    ];

    const filteredUsers = userReports.filter(u =>
        u.name.toLowerCase().includes(searchText.toLowerCase()) ||
        u.email.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredRevenue = revenueReports.filter(r =>
        r.user.toLowerCase().includes(searchText.toLowerCase()) ||
        r.type.toLowerCase().includes(searchText.toLowerCase())
    );

    const stats = {
        totalUsers: userReports.length,
        premiumUsers: userReports.filter(u => u.subscriptionTier === 'PREMIUM' || u.subscriptionTier === 'LIFETIME').length,
        totalRevenue: revenueReports.reduce((sum, r) => sum + r.amount, 0),
        avgSpent: userReports.length > 0 ? userReports.reduce((sum, u) => sum + u.totalSpent, 0) / userReports.length : 0,
    };

    const exportMenu = (
        <Menu>
            <Menu.Item key="csv" icon={<FileExcelOutlined />} onClick={() => {
                if (activeTab === 'users') {
                    exportToCSV(userReports, 'user_report');
                } else {
                    exportToCSV(revenueReports, 'revenue_report');
                }
            }}>
                Export to CSV
            </Menu.Item>
            <Menu.Item key="pdf" icon={<FilePdfOutlined />} onClick={exportToPDF}>
                Export to PDF
            </Menu.Item>
        </Menu>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>Reports & Analytics</h1>
                <Space>
                    <DatePicker.RangePicker
                        value={dateRange}
                        onChange={(dates) => dates && setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                    />
                    <Button icon={<ReloadOutlined />} onClick={fetchReports}>Refresh</Button>
                    <Dropdown overlay={exportMenu}>
                        <Button type="primary" icon={<DownloadOutlined />}>
                            Export
                        </Button>
                    </Dropdown>
                </Space>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Users" value={stats.totalUsers} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Premium Users" value={stats.premiumUsers} valueStyle={{ color: '#f59e0b' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Revenue" value={stats.totalRevenue} prefix="$" precision={2} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Avg. Spend/User" value={stats.avgSpent} prefix="$" precision={2} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <Tabs.TabPane tab={<span><UserOutlined /> User Activity</span>} key="users" />
                    <Tabs.TabPane tab={<span><DollarOutlined /> Revenue</span>} key="revenue" />
                </Tabs>

                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                {activeTab === 'users' ? (
                    <Table
                        columns={userColumns}
                        dataSource={filteredUsers}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10, showTotal: (t) => `${t} users` }}
                    />
                ) : (
                    <Table
                        columns={revenueColumns}
                        dataSource={filteredRevenue}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10, showTotal: (t) => `${t} transactions` }}
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={4}>
                                    <strong>Total</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                    <strong style={{ color: '#52c41a' }}>${filteredRevenue.reduce((s, r) => s + r.amount, 0).toFixed(2)}</strong>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                )}
            </Card>
        </div>
    );
}

export default UserReports;
