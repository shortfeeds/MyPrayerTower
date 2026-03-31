import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Switch, Space, message, Popconfirm, Typography, Tooltip, Checkbox, Alert } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, GoogleOutlined, MobileOutlined, AppleOutlined, PushpinOutlined } from '@ant-design/icons';
import { api } from '../utils/api';

const { Title, Text } = Typography;

interface AdContainer {
    id: string;
    sectionKey: string;
    description?: string;
    adType: 'BANNER' | 'NATIVE' | 'INTERSTITIAL' | 'REWARDED' | 'APP_OPEN' | 'NEWSLETTER' | 'FEATURED';
    androidUnitId?: string;
    iosUnitId?: string;
    webUnitId?: string;
    isActive: boolean;
    updatedAt: string;
}

export function AdManagement() {
    const [ads, setAds] = useState<AdContainer[]>([]);
    const [matrix, setMatrix] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingAd, setEditingAd] = useState<AdContainer | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const [adsRes, matrixRes] = await Promise.all([
                api.get('/admin/ads'),
                api.get('/admin/settings/ad-placements')
            ]);
            setAds(adsRes.data);
            setMatrix(matrixRes.data || {});
        } catch (err) {
            message.error('Failed to load ad units');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMatrix = async (page: string, position: string, checked: boolean) => {
        const newMatrix = { ...matrix };
        if (!newMatrix[page]) newMatrix[page] = {};
        newMatrix[page][position] = checked;
        
        setMatrix(newMatrix);
        
        try {
            await api.post('/admin/settings/ad-placements', newMatrix);
            message.success('Ad placement instantly updated');
        } catch (err) {
            message.error('Failed to update ad placement');
        }
    };

    const handleAdd = () => {
        setEditingAd(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (ad: AdContainer) => {
        setEditingAd(ad);
        form.setFieldsValue(ad);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/admin/ads/${id}`);
            message.success('Ad unit deleted');
            fetchAds();
        } catch (err) {
            message.error('Failed to delete ad unit');
        }
    };

    const onFinish = async (values: any) => {
        try {
            const payload = editingAd ? { ...values, id: editingAd.id } : values;
            await api.post('/admin/ads', payload);
            message.success(editingAd ? 'Ad unit updated' : 'Ad unit created');
            setModalVisible(false);
            fetchAds();
        } catch (err) {
            message.error('Failed to save ad unit');
        }
    };

    const columns = [
        {
            title: 'Section & Description',
            key: 'section',
            render: (_: any, record: AdContainer) => (
                <div>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{record.sectionKey}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{record.description || 'No description'}</div>
                </div>
            )
        },
        {
            title: 'Type',
            dataIndex: 'adType',
            key: 'type',
            render: (type: string) => <Tag color="blue">{type}</Tag>
        },
        {
            title: 'Android ID',
            dataIndex: 'androidUnitId',
            key: 'android',
            render: (id: string) => (
                <Space>
                    <MobileOutlined style={{ color: '#3ddc84' }} />
                    <Text code copyable={!!id}>{id || 'Not set'}</Text>
                </Space>
            )
        },
        {
            title: 'iOS ID',
            dataIndex: 'iosUnitId',
            key: 'ios',
            render: (id: string) => (
                <Space>
                    <AppleOutlined style={{ color: '#000' }} />
                    <Text code copyable={!!id}>{id || 'Not set'}</Text>
                </Space>
            )
        },
        {
            title: 'Web Slot ID',
            dataIndex: 'webUnitId',
            key: 'web',
            render: (id: string) => (
                <Space>
                    <GoogleOutlined style={{ color: '#4285F4' }} />
                    <Text code copyable={!!id}>{id || 'Not set'}</Text>
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'status',
            render: (active: boolean) => (
                <Tag color={active ? 'success' : 'error'}>
                    {active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: AdContainer) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Popconfirm
                        title="Delete this ad unit?"
                        description="This may cause issues in the app if the section is still active."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];
    
    const pages = ['churches', 'saints', 'prayers', 'memorials', 'bible', 'readings', 'prayer-wall', 'home'];
    
    const matrixColumns = [
        { title: 'Page', dataIndex: 'page', key: 'page', render: (text: string) => <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{text.replace('-', ' ')}</span> },
        { title: 'Top', key: 'top', align: 'center' as const, render: (_: any, record: any) => <Checkbox checked={matrix[record.page]?.top} onChange={(e) => handleToggleMatrix(record.page, 'top', e.target.checked)} /> },
        { title: 'Sidebar', key: 'sidebar', align: 'center' as const, render: (_: any, record: any) => <Checkbox checked={matrix[record.page]?.sidebar} onChange={(e) => handleToggleMatrix(record.page, 'sidebar', e.target.checked)} /> },
        { title: 'Inline', key: 'inline', align: 'center' as const, render: (_: any, record: any) => <Checkbox checked={matrix[record.page]?.inline} onChange={(e) => handleToggleMatrix(record.page, 'inline', e.target.checked)} /> },
        { title: 'Bottom', key: 'bottom', align: 'center' as const, render: (_: any, record: any) => <Checkbox checked={matrix[record.page]?.bottom} onChange={(e) => handleToggleMatrix(record.page, 'bottom', e.target.checked)} /> },
    ];
    
    const matrixData = pages.map(p => ({ page: p }));

    return (
        <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>AdMob Management</Title>
                    <Text type="secondary">Manage dynamic Google AdMob unit IDs for different app sections</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Ad Unit
                </Button>
            </div>

            <Card bordered={false} style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 16 }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <PushpinOutlined style={{ color: '#eb2f96' }} /> Ad Slot Positions by Page
                    </h3>
                    <Text type="secondary">Toggle exactly where ads should appear across different app/web pages. Changes apply instantly.</Text>
                </div>
                
                <Alert
                    message="Setup your 3 Global AdSense/AdMob IDs in the table below, and then use this matrix to distribute them!"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />

                <Table
                    columns={matrixColumns}
                    dataSource={matrixData}
                    rowKey="page"
                    pagination={false}
                    size="small"
                    bordered
                />
            </Card>

            <Card bordered={false}>
                <Table
                    columns={columns}
                    dataSource={ads}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
            </Card>

            <Modal
                title={editingAd ? 'Edit Ad Unit' : 'New Ad Unit'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ adType: 'BANNER', isActive: true }}
                >
                    <Form.Item
                        name="sectionKey"
                        label="Section Key"
                        rules={[{ required: true, message: 'Please enter a unique key' }]}
                        tooltip={{ title: 'Unique identifier for the app section (e.g. HOME_BANNER)', icon: <InfoCircleOutlined /> }}
                    >
                        <Input placeholder="E.g. HOME_BANNER" disabled={!!editingAd} />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea rows={2} placeholder="Brief description of where this ad appears" />
                    </Form.Item>

                    <Form.Item name="adType" label="Ad Type" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="BANNER">Banner</Select.Option>
                            <Select.Option value="NATIVE">Native Advanced</Select.Option>
                            <Select.Option value="INTERSTITIAL">Interstitial</Select.Option>
                            <Select.Option value="REWARDED">Rewarded</Select.Option>
                            <Select.Option value="APP_OPEN">App Open</Select.Option>
                            <Select.Option value="FEATURED">Custom Featured</Select.Option>
                            <Select.Option value="NEWSLETTER">Newsletter Slot</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="androidUnitId" label={<span><MobileOutlined /> Android (AdMob) Unit ID</span>}>
                        <Input placeholder="ca-app-pub-3940256099942544/6300978111" />
                    </Form.Item>

                    <Form.Item name="iosUnitId" label={<span><AppleOutlined /> iOS (AdMob) Unit ID</span>}>
                        <Input placeholder="ca-app-pub-3940256099942544/2934735716" />
                    </Form.Item>

                    <Form.Item name="webUnitId" label={<span><GoogleOutlined /> Web (AdSense) Slot ID</span>}>
                        <Input placeholder="1234567890" />
                    </Form.Item>

                    <Form.Item name="isActive" label="Status" valuePropName="checked">
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AdManagement;
