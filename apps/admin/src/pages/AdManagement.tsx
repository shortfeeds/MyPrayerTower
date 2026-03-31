import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Modal, Form, Input, Select, Switch, Space, message, Popconfirm, Typography, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, GoogleOutlined, MobileOutlined, AppleOutlined } from '@ant-design/icons';
import { api } from '../utils/api';

const { Title, Text } = Typography;

interface AdContainer {
    id: string;
    sectionKey: string;
    description?: string;
    adType: 'BANNER' | 'NATIVE' | 'NEWSLETTER' | 'FEATURED';
    androidUnitId?: string;
    iosUnitId?: string;
    isActive: boolean;
    updatedAt: string;
}

export function AdManagement() {
    const [ads, setAds] = useState<AdContainer[]>([]);
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
            const res = await api.get('/admin/ads');
            setAds(res.data);
        } catch (err) {
            message.error('Failed to load ad units');
        } finally {
            setLoading(false);
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
                            <Select.Option value="NATIVE">Native</Select.Option>
                            <Select.Option value="FEATURED">Interstitial/Featured</Select.Option>
                            <Select.Option value="NEWSLETTER">Newsletter</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="androidUnitId" label={<span><MobileOutlined /> Android Unit ID</span>}>
                        <Input placeholder="ca-app-pub-3940256099942544/6300978111" />
                    </Form.Item>

                    <Form.Item name="iosUnitId" label={<span><AppleOutlined /> iOS Unit ID</span>}>
                        <Input placeholder="ca-app-pub-3940256099942544/2934735716" />
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
