import { useState, useEffect } from 'react';
import { Table, Card, Statistic, Row, Col, Tag, Typography } from 'antd';
import { DollarOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import { api } from '../utils/api';

const { Title } = Typography;

export default function DonationsList() {
    const [donations, setDonations] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [listRes, statsRes] = await Promise.all([
                api.get('/donations/admin/all'),
                api.get('/donations/admin/statistics')
            ]);

            const listData = listRes?.data || [];
            // Backend returns { data: [], total: N } for list if I updated service correctly?
            // Service returns { data: donations, total }
            // So listRes.data is { data: [], total }.
            // So rows = listRes.data.data

            if (listRes?.data?.data) {
                setDonations(listRes.data.data);
            } else if (Array.isArray(listRes?.data)) {
                setDonations(listRes.data);
            }

            setStats(statsRes?.data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderNumber',
            key: 'orderNumber',
            render: (text: string) => <small>{text}</small>
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleDateString()
        },
        {
            title: 'Donor',
            key: 'donor',
            render: (_: any, r: any) => (
                <div>
                    <div>{r.isAnonymous ? 'Anonymous' : r.name}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                </div>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, r: any) => (
                <span className="font-semibold">
                    {(amount / 100).toLocaleString('en-US', { style: 'currency', currency: r.currency })}
                </span>
            )
        },
        {
            title: 'Type/Tier',
            dataIndex: 'tier',
            key: 'tier',
            render: (tier: string) => <Tag>{tier}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'COMPLETED') color = 'success';
                else if (status === 'PENDING') color = 'warning';
                return <Tag color={color}>{status}</Tag>;
            }
        }
    ];

    return (
        <div className="space-y-6">
            <Title level={2}>Donations & Support</Title>

            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Donations"
                            value={stats?.totalDonationsFormatted || '$0.00'}
                            prefix={<DollarOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Total Transactions"
                            value={stats?.donationCount || 0}
                            prefix={<HeartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic
                            title="Active Subscriptions"
                            value={stats?.activeSubscriptions || 0}
                            prefix={<UserOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Recent Donations" style={{ marginTop: 24 }}>
                <Table
                    dataSource={donations}
                    columns={columns}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                />
            </Card>
        </div>
    );
}
