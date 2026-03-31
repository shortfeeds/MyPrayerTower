import { useState, useEffect } from 'react';
import { Card, Table, Button, Input, Space, Tag, Modal, Form, Select, message, Popconfirm, Typography, Row, Col, Statistic } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

interface Article {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    category: string;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    author: string;
    featuredImage?: string;
    createdAt: string;
    updatedAt: string;
    views: number;
}

const statusColors: Record<string, string> = {
    DRAFT: 'default',
    PUBLISHED: 'green',
    ARCHIVED: 'orange',
};

const categories = [
    'Prayers',
    'Saints',
    'Devotions',
    'News',
    'Announcements',
    'Spiritual Guidance',
    'Church News',
];

import { api } from '../utils/api';

export function Articles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/articles');
            // Handle both simple array and paginated result { articles: [], total: 0 }
            setArticles(Array.isArray(data) ? data : (data.articles || []));
        } catch (err) {
            console.error('Failed to fetch articles:', err);
            message.error('Failed to load articles');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingArticle(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (article: Article) => {
        setEditingArticle(article);
        form.setFieldsValue(article);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/admin/articles/${id}`);
            setArticles(prev => prev.filter(a => a.id !== id));
            message.success('Article deleted successfully');
        } catch (err) {
            message.error('Failed to delete article');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            // Generate slug if missing
            if (!values.slug) {
                values.slug = values.title.toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');
            }

            if (editingArticle) {
                // Update
                const { data } = await api.put(`/admin/articles/${editingArticle.id}`, values);
                setArticles(prev => prev.map(a => a.id === editingArticle.id ? data : a));
                message.success('Article updated successfully');
            } else {
                // Create
                const userStr = localStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                
                if (!user?.id) {
                    message.error('You must be logged in to create articles');
                    return;
                }

                const payload = {
                    ...values,
                    authorId: user.id
                };

                const { data } = await api.post('/admin/articles', payload);
                setArticles(prev => [data, ...prev]);
                message.success('Article created successfully');
            }
            setModalVisible(false);
            form.resetFields();
        } catch (err) {
            message.error('Failed to save article');
        }
    };

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchText.toLowerCase()) ||
        a.category.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Article) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{record.excerpt?.substring(0, 60)}...</div>
                </div>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat: string) => <Tag>{cat}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>,
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
            render: (views: number) => views.toLocaleString(),
        },
        {
            title: 'Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => dayjs(date).fromNow(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Article) => (
                <Space>
                    <Button icon={<EyeOutlined />} size="small" />
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Delete this article?"
                        description="This action cannot be undone."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Delete"
                        okType="danger"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const stats = {
        total: articles.length,
        published: articles.filter(a => a.status === 'PUBLISHED').length,
        draft: articles.filter(a => a.status === 'DRAFT').length,
        totalViews: articles.reduce((sum, a) => sum + a.views, 0),
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ margin: 0 }}>Articles (CMS)</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    New Article
                </Button>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Articles" value={stats.total} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Published" value={stats.published} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Drafts" value={stats.draft} valueStyle={{ color: '#faad14' }} />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic title="Total Views" value={stats.totalViews} />
                    </Card>
                </Col>
            </Row>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search articles..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredArticles}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10, showTotal: (t) => `${t} articles` }}
                />
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                title={editingArticle ? 'Edit Article' : 'New Article'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{ status: 'DRAFT' }}
                >
                    <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
                        <Input placeholder="Article title" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                                <Select placeholder="Select category">
                                    {categories.map(cat => (
                                        <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="status" label="Status">
                                <Select>
                                    <Select.Option value="DRAFT">Draft</Select.Option>
                                    <Select.Option value="PUBLISHED">Published</Select.Option>
                                    <Select.Option value="ARCHIVED">Archived</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="excerpt" label="Excerpt">
                        <Input.TextArea rows={2} placeholder="Brief summary of the article" />
                    </Form.Item>

                    <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                        <Input.TextArea rows={8} placeholder="Full article content (supports Markdown)" />
                    </Form.Item>

                    <Form.Item name="featuredImage" label="Featured Image URL">
                        <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                {editingArticle ? 'Update' : 'Create'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default Articles;
