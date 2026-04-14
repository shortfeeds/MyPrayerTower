import React, { useState, useEffect } from 'react';
import { Table, Tag, Typography, Card, Space, Button, DatePicker, Select } from 'antd';
import { ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { api } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

export const FailedPayments: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
        total: 0,
    });
    const [filterType, setFilterType] = useState<string | undefined>(undefined);

    const fetchData = async (page = 1, type?: string) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', pagination.pageSize.toString());
            if (type) params.append('type', type);

            const response = await api.get(`/admin/failed-payments?${params.toString()}`);
            setData(response.data.items);
            setPagination({
                ...pagination,
                current: response.data.page,
                total: response.data.total,
            });
        } catch (error) {
            console.error('Error fetching failed payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(1, filterType);
    }, [filterType]);

    const handleTableChange = (paginationConfig: any) => {
        fetchData(paginationConfig.current, filterType);
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: 'User Email',
            dataIndex: 'userEmail',
            key: 'userEmail',
            render: (text: string, record: any) => (
                <Text>
                    {text || 'Unknown'}
                    {record.user && (
                        <div style={{ fontSize: '12px', color: '#888' }}>
                            {record.user.firstName} {record.user.lastName}
                        </div>
                    )}
                </Text>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number, record: any) => 
                amount ? `${(amount / 100).toFixed(2)} ${record.currency.toUpperCase()}` : 'N/A',
        },
        {
            title: 'Type',
            dataIndex: 'paymentType',
            key: 'paymentType',
            render: (type: string) => <Tag color="blue">{type}</Tag>,
        },
        {
            title: 'Failure Reason',
            dataIndex: 'failureReason',
            key: 'failureReason',
            render: (text: string) => (
                <Text type="danger">
                    <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                    {text}
                </Text>
            ),
        },
        {
            title: 'Stripe Session',
            dataIndex: 'stripeSessionId',
            key: 'stripeSessionId',
            render: (text: string) => text ? <Text copyable>{text}</Text> : '-',
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>Failed Payments</Title>
                <Space>
                    <Select
                        placeholder="Filter by Type"
                        allowClear
                        style={{ width: 150 }}
                        onChange={(value) => setFilterType(value)}
                    >
                        <Option value="SUBSCRIPTION">Subscription</Option>
                        <Option value="DONATION">Donation</Option>
                        <Option value="CANDLE">Candle</Option>
                        <Option value="MASS_OFFERING">Mass Offering</Option>
                        <Option value="BOUQUET">Bouquet</Option>
                        <Option value="MEMORIAL">Memorial</Option>
                        <Option value="OTHER">Other</Option>
                    </Select>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={() => fetchData(pagination.current, filterType)}
                    >
                        Refresh
                    </Button>
                </Space>
            </div>

            <Card>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={pagination}
                    onChange={handleTableChange}
                    loading={loading}
                />
            </Card>
        </Space>
    );
};
