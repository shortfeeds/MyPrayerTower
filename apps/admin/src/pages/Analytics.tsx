import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Radio, Space, Table, Spin, message, Typography } from 'antd';
import { TeamOutlined, HeartOutlined, EnvironmentOutlined, DollarOutlined, BarChartOutlined, GlobalOutlined } from '@ant-design/icons';
import { api } from '../utils/api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface ChartData {
    label: string;
    value: number;
}

export default function AnalyticsDashboard() {
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalChurches: 0,
        totalPrayers: 0,
        totalDonations: 0,
        monthlyNewUsers: 0
    });
    const [prayerHeatmap, setPrayerHeatmap] = useState<ChartData[]>([]);
    const [topCategories, setTopCategories] = useState<{ name: string; count: number; percent: number }[]>([]);
    const [geographicData, setGeographicData] = useState<{ country: string; churches: number }[]>([]);

    useEffect(() => {
        fetchAllData();
    }, [dateRange]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;

            const [statsRes, heatmapRes, categoriesRes, geoRes, revenueRes] = await Promise.all([
                api.get('/analytics/stats'),
                api.get(`/analytics/heatmap?days=${days}`),
                api.get('/analytics/categories'),
                api.get('/analytics/geo'),
                api.get('/analytics/revenue')
            ]);

            setStats({
                totalUsers: statsRes.data.totalUsers || 0,
                totalChurches: statsRes.data.totalChurches || 0,
                totalPrayers: statsRes.data.totalPrayers || 0,
                totalDonations: revenueRes.data.totalDonations || 0,
                monthlyNewUsers: statsRes.data.monthlyNewUsers || 0
            });

            if (heatmapRes.data) {
                setPrayerHeatmap(heatmapRes.data.map((d: any) => ({
                    label: dayjs(d.date).format('ddd'),
                    value: d.count
                })).slice(-7));
            }

            if (categoriesRes.data) {
                const data = categoriesRes.data;
                const total = data.reduce((sum: number, c: any) => sum + c.count, 0);
                setTopCategories(data.map((c: any) => ({
                    name: c.category,
                    count: c.count,
                    percent: total > 0 ? Math.round((c.count / total) * 100) : 0
                })));
            }

            if (geoRes.data) {
                setGeographicData(geoRes.data);
            }

        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            message.error('Failed to load some analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Loading platform analytics..." />
            </div>
        );
    }

    const geoColumns = [
        { title: 'Country', dataIndex: 'country', key: 'country' },
        { title: 'Churches', dataIndex: 'churches', key: 'churches', render: (val: number) => val.toLocaleString() },
        { 
            title: 'Coverage', 
            key: 'coverage', 
            render: (_: any, record: any) => (
                <Progress percent={Math.round((record.churches / stats.totalChurches) * 100)} size="small" />
            ) 
        }
    ];

    return (
        <div style={{ padding: 24 }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>Analytics Dashboard</Title>
                    <Text type="secondary">Platform insights and metrics</Text>
                </Col>
                <Col>
                    <Radio.Group value={dateRange} onChange={e => setDateRange(e.target.value)} buttonStyle="solid">
                        <Radio.Button value="7d">7 Days</Radio.Button>
                        <Radio.Button value="30d">30 Days</Radio.Button>
                        <Radio.Button value="90d">90 Days</Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="stat-card">
                        <Statistic
                            title="Total Users"
                            value={stats.totalUsers}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                        <div style={{ marginTop: 8 }}>
                            <Text type="success">+{stats.monthlyNewUsers} this month</Text>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total Churches"
                            value={stats.totalChurches}
                            prefix={<EnvironmentOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                        <Text type="secondary">Verified locations</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Prayer Requests"
                            value={stats.totalPrayers}
                            prefix={<HeartOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                        <Text type="secondary">Moderated & Approved</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Total Revenue"
                            value={stats.totalDonations / 100}
                            precision={2}
                            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                        <Text type="secondary">Donations & Offerings</Text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} lg={12}>
                    <Card title={<span><BarChartOutlined /> Prayer Activity (Last 7 Days)</span>} bordered={false} style={{ height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 200, paddingTop: 20 }}>
                            {prayerHeatmap.map((day, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                    <div style={{ 
                                        width: '60%', 
                                        backgroundColor: '#1890ff', 
                                        borderRadius: '4px 4px 0 0',
                                        height: `${Math.max(10, (day.value / (Math.max(...prayerHeatmap.map(d => d.value)) || 1)) * 150)}px`,
                                        transition: 'height 0.3s'
                                    }} />
                                    <Text style={{ marginTop: 8 }}>{day.label}</Text>
                                    <Text strong>{day.value}</Text>
                                </div>
                            ))}
                            {prayerHeatmap.length === 0 && <Text type="secondary">No recent activity data</Text>}
                        </div>
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Top Prayer Categories" bordered={false} style={{ height: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {topCategories.map((cat, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <Text>{cat.name}</Text>
                                        <Text type="secondary">{cat.count.toLocaleString()}</Text>
                                    </div>
                                    <Progress percent={cat.percent} strokeColor={{ '0%': '#1890ff', '100%': '#722ed1' }} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Card title={<span><GlobalOutlined /> Geographic Distribution</span>} bordered={false}>
                        <Table 
                            dataSource={geographicData} 
                            columns={geoColumns} 
                            pagination={false} 
                            rowKey="country"
                            size="middle"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
