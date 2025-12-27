import { Card, Button, Table, Tag, Row, Col, Statistic, message, Switch, Select } from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const mockSyncHistory = [
    { id: '1', type: 'Full Sync', status: 'completed', startedAt: 'Dec 22, 2024 02:00 AM', duration: '45 min', records: 12450 },
    { id: '2', type: 'Full Sync', status: 'completed', startedAt: 'Dec 15, 2024 02:00 AM', duration: '42 min', records: 12380 },
    { id: '3', type: 'Manual Sync', status: 'completed', startedAt: 'Dec 10, 2024 11:30 AM', duration: '38 min', records: 12100 },
    { id: '4', type: 'Full Sync', status: 'failed', startedAt: 'Dec 8, 2024 02:00 AM', duration: '5 min', records: 0, error: 'Connection timeout' },
];

export function SyncControl() {
    const [syncing, setSyncing] = useState(false);

    const handleSync = () => {
        setSyncing(true);
        message.loading('Starting sync...');
        setTimeout(() => {
            setSyncing(false);
            message.success('Sync completed successfully!');
        }, 2000);
    };

    const columns = [
        { title: 'Type', dataIndex: 'type', key: 'type' },
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
        { title: 'Started', dataIndex: 'startedAt', key: 'startedAt' },
        { title: 'Duration', dataIndex: 'duration', key: 'duration' },
        { title: 'Records', dataIndex: 'records', key: 'records', render: (r: number) => r.toLocaleString() },
        {
            title: 'Error',
            dataIndex: 'error',
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
                    dataSource={mockSyncHistory}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
}
