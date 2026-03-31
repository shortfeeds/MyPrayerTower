import { Card, Button, Table, Tag, Row, Col, Statistic, message, Switch, Select, Spin } from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import dayjs from 'dayjs';

export function SyncControl() {
    const [syncHistory, setSyncHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/sync/history');
            setSyncHistory(data || []);
        } catch (err) {
            console.error('Failed to fetch sync history:', err);
            message.error('Failed to load sync history');
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        try {
            setSyncing(true);
            message.loading('Starting manual synchronization...', 0);
            await api.post('/admin/sync/run');
            message.destroy();
            message.success('Sync triggered successfully! It will run in the background.');
            setTimeout(fetchHistory, 5000); // Wait 5s and refresh
        } catch (err) {
            message.destroy();
            message.error('Failed to start sync');
        } finally {
            setSyncing(false);
        }
    };

    const columns = [
        { title: 'Type', dataIndex: 'type', key: 'type', render: (t: string) => t.toUpperCase() },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag
                    color={status === 'completed' ? 'green' : status === 'running' ? 'blue' : 'red'}
                    icon={status === 'completed' ? <CheckCircleOutlined /> : status === 'running' ? <ClockCircleOutlined /> : <CloseCircleOutlined />}
                >
                    {status.toUpperCase()}
                </Tag>
            ),
        },
        { title: 'Started', dataIndex: 'startedAt', key: 'startedAt', render: (d: string) => dayjs(d).format('MMM D, YYYY HH:mm') },
        { title: 'Completed', dataIndex: 'completedAt', key: 'completedAt', render: (d: string) => d ? dayjs(d).format('MMM D, YYYY HH:mm') : '-' },
        { title: 'Records', dataIndex: 'recordsProcessed', key: 'records', render: (r: number) => r?.toLocaleString() || 0 },
        {
            title: 'Error',
            dataIndex: 'errorMessage',
            key: 'error',
            render: (error: string) => error ? <Tag color="red">{error}</Tag> : '-',
        },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>GCatholic Sync Control</h1>

            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Last Sync" value="Dec 22, 2024" valueStyle={{ fontSize: 16 }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Records" value={48721} prefix={<SyncOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Next Scheduled" value="Dec 29, 2024" valueStyle={{ fontSize: 16 }} suffix="02:00 AM" />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Status" value="Healthy" valueStyle={{ color: '#52c41a' }} prefix={<CheckCircleOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Card title="Sync Settings" style={{ marginBottom: 24 }}>
                <Row gutter={24}>
                    <Col span={8}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8 }}>Auto Sync Enabled</label>
                            <Switch defaultChecked />
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8 }}>Sync Schedule</label>
                            <Select defaultValue="weekly" style={{ width: '100%' }}>
                                <Select.Option value="daily">Daily at 2 AM</Select.Option>
                                <Select.Option value="weekly">Weekly (Sunday 2 AM)</Select.Option>
                                <Select.Option value="monthly">Monthly (1st at 2 AM)</Select.Option>
                            </Select>
                        </div>
                    </Col>
                    <Col span={8}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', marginBottom: 8 }}>Manual Sync</label>
                            <Button
                                type="primary"
                                icon={<SyncOutlined spin={syncing} />}
                                loading={syncing}
                                onClick={handleSync}
                            >
                                Sync Now
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Card title="Sync History">
                <Table
                    columns={columns}
                    dataSource={syncHistory}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No sync history found' }}
                />
            </Card>
        </div>
    );
}
