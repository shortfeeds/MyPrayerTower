import { useState, useEffect } from 'react';
import { Table, Button, Input, Modal, Form, message, Space, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from '../utils/api';

interface Saint {
    id: string;
    name: string;
    title?: string;
    feastMonth: number;
    feastDayOfMonth: number;
    biography?: string;
    imageUrl?: string;
}

export default function SaintsManagement() {
    const [saints, setSaints] = useState<Saint[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingSaint, setEditingSaint] = useState<Saint | null>(null);
    const [form] = Form.useForm();

    const fetchSaints = async () => {
        setLoading(true);
        try {
            // Using search endpoint to get list
            const endpoint = searchText ? `/saints/search?q=${searchText}` : '/saints/search?q=a';
            const { data } = await api.get(endpoint);
            setSaints(Array.isArray(data) ? data : []);
        } catch (error) {
            message.error('Failed to load saints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSaints();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchText]);

    const handleEdit = (record: Saint) => {
        setEditingSaint(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: 'Are you sure?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await api.delete(`/saints/${id}`);
                    message.success('Saint deleted');
                    fetchSaints();
                } catch (error) {
                    message.error('Failed to delete');
                }
            }
        });
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                feastMonth: Number(values.feastMonth),
                feastDayOfMonth: Number(values.feastDayOfMonth),
                // Simple slug generation
                slug: values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)
            };

            if (editingSaint) {
                await api.put(`/saints/${editingSaint.id}`, payload);
                message.success('Updated successfully');
            } else {
                await api.post('/saints', payload);
                message.success('Created successfully');
            }
            setIsModalVisible(false);
            fetchSaints();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        {
            title: 'Feast Day',
            key: 'feast',
            render: (_: any, r: Saint) => `${r.feastMonth}/${r.feastDayOfMonth}`
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Saint) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
                </Space>
            )
        }
    ];

    return (
        <Card title="Saints Management" extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                setEditingSaint(null);
                form.resetFields();
                setIsModalVisible(true);
            }}>
                Add Saint
            </Button>
        }>
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="Search Saints"
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
            </div>
            <Table
                dataSource={saints}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title={editingSaint ? "Edit Saint" : "Add Saint"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="title" label="Title">
                        <Input />
                    </Form.Item>
                    <Space>
                        <Form.Item name="feastMonth" label="Month" rules={[{ required: true }]}>
                            <Input type="number" min={1} max={12} />
                        </Form.Item>
                        <Form.Item name="feastDayOfMonth" label="Day" rules={[{ required: true }]}>
                            <Input type="number" min={1} max={31} />
                        </Form.Item>
                    </Space>
                    <Form.Item name="biography" label="Biography">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="imageUrl" label="Image URL">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
