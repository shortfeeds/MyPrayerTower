import { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, message, Space, Card, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { api } from '../utils/api';

interface Pilgrimage {
    id: string;
    name: string;
    location: string;
    country: string;
    description: string;
    significance: string;
    imageUrl: string;
    virtualTourUrl?: string;
    viewCount: number;
}

export default function PilgrimagesManagement() {
    const [sites, setSites] = useState<Pilgrimage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSite, setEditingSite] = useState<Pilgrimage | null>(null);
    const [form] = Form.useForm();

    const fetchSites = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/pilgrimages');
            setSites(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error('Failed to load pilgrimages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSites();
    }, []);

    const handleEdit = (record: Pilgrimage) => {
        setEditingSite(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Pilgrimage Site?',
            content: 'This cannot be undone.',
            onOk: async () => {
                try {
                    await api.delete(`/pilgrimages/${id}`);
                    message.success('Deleted successfully');
                    fetchSites();
                } catch (error) {
                    message.error('Failed to delete');
                }
            }
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingSite) {
                await api.put(`/pilgrimages/${editingSite.id}`, values);
                message.success('Updated successfully');
            } else {
                await api.post('/pilgrimages', values);
                message.success('Created successfully');
            }
            setIsModalVisible(false);
            fetchSites();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: 'Image',
            key: 'image',
            render: (_: any, r: Pilgrimage) => (
                <Image src={r.imageUrl} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} />
            )
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Location',
            key: 'location',
            render: (_: any, r: Pilgrimage) => `${r.location}, ${r.country}`
        },
        { title: 'Significance', dataIndex: 'significance', key: 'significance', ellipsis: true },
        { title: 'Views', dataIndex: 'viewCount', key: 'viewCount' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Pilgrimage) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <Card title="Pilgrimage Sites" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingSite(null);
                form.resetFields();
                setIsModalVisible(true);
            }}>
                Add Site
            </Button>
        }>
            <Table
                dataSource={sites}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title={editingSite ? "Edit Site" : "Add Site"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Space style={{ display: 'flex' }} align="baseline">
                        <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Space>
                    <Form.Item name="significance" label="Significance / Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="imageUrl" label="Image URL" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="virtualTourUrl" label="Virtual Tour URL">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
