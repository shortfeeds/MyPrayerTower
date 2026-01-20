import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Modal, Input, Space, Select, message, Spin, Empty } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { TextArea } = Input;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const rejectionReasons = [
    'Contains inappropriate content',
    'Contains personal contact information',
    'Not a prayer request',
    'Contains spam or advertising',
    'Violates community guidelines',
    'Needs more context (resubmit)',
];

export function PrayerModeration() {
    const [prayers, setPrayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPrayer, setSelectedPrayer] = useState<any>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPendingPrayers();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchPendingPrayers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/admin/prayers/pending`, {
                headers: getAuthHeaders()
            });
            if (res.ok) {
                const data = await res.json();
                setPrayers(data);
            }
        } catch (err) {
            console.error('Failed to fetch pending prayers', err);
            message.error('Failed to load pending prayers');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            setProcessing(true);
            const res = await fetch(`${API_URL}/admin/prayers/${id}/approve`, {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }
            });

            if (res.ok) {
                message.success('Prayer approved and published');
                setPrayers(prev => prev.filter(p => p.id !== id));
                setSelectedPrayer(null);
            } else {
                throw new Error('Failed to approve');
            }
        } catch (err) {
            message.error('Failed to approve prayer');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedPrayer) return;

        try {
            setProcessing(true);
            const res = await fetch(`${API_URL}/admin/prayers/${selectedPrayer.id}/reject`, {
                method: 'POST',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: rejectionReason })
            });

            if (res.ok) {
                message.warning('Prayer rejected');
                setPrayers(prev => prev.filter(p => p.id !== selectedPrayer.id));
                setRejectModalOpen(false);
                setSelectedPrayer(null);
                setRejectionReason('');
            } else {
                throw new Error('Failed to reject');
            }
        } catch (err) {
            message.error('Failed to reject prayer');
        } finally {
            setProcessing(false);
        }
    };

    const columns = [
        {
            title: 'Prayer Content',
            dataIndex: 'content',
            key: 'content',
            width: '40%',
            render: (text: string) => (
                <span style={{ display: 'block', maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'User',
            dataIndex: ['user', 'displayName'],
            key: 'user',
            render: (text: string, record: any) => text || record.user?.firstName || 'Anonymous'
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (cat: string) => <Tag color="blue">{cat}</Tag>,
        },
        {
            title: 'Visibility',
            dataIndex: 'visibility',
            key: 'visibility',
            render: (vis: string) => (
                <Tag color={vis === 'PUBLIC' ? 'green' : 'orange'}>
                    {vis === 'PUBLIC' ? '🌍 Public' : '👤 Anonymous'}
                </Tag>
            ),
        },
        {
            title: 'Submitted',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (d: string) => dayjs(d).fromNow()
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedPrayer(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => handleApprove(record.id)}
                        loading={processing && selectedPrayer?.id === record.id}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => {
                            setSelectedPrayer(record);
                            setRejectModalOpen(true);
                        }}
                    >
                        Reject
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Prayer Moderation</h1>
            <p style={{ marginBottom: 24, color: '#666' }}>
                <Tag color="orange">{prayers.length}</Tag> prayers awaiting moderation
            </p>

            <Card>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={prayers}
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                        locale={{ emptyText: <Empty description="No pending prayers found" /> }}
                    />
                )}
            </Card>

            {/* View Modal */}
            <Modal
                title="Prayer Request Details"
                open={!!selectedPrayer && !rejectModalOpen}
                onCancel={() => setSelectedPrayer(null)}
                footer={[
                    <Button key="reject" danger onClick={() => setRejectModalOpen(true)}>
                        Reject
                    </Button>,
                    <Button
                        key="approve"
                        type="primary"
                        onClick={() => handleApprove(selectedPrayer?.id)}
                        loading={processing}
                    >
                        Approve
                    </Button>,
                ]}
            >
                {selectedPrayer && (
                    <div>
                        <p><strong>From:</strong> {selectedPrayer.user?.displayName || selectedPrayer.user?.firstName || 'Anonymous'}</p>
                        <p><strong>Category:</strong> {selectedPrayer.category}</p>
                        <p><strong>Visibility:</strong> {selectedPrayer.visibility}</p>
                        <p><strong>Submitted:</strong> {dayjs(selectedPrayer.createdAt).format('MMMM D, YYYY h:mm A')}</p>
                        <p><strong>Content:</strong></p>
                        <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, marginTop: 8 }}>
                            {selectedPrayer.content}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal
                title="Reject Prayer Request"
                open={rejectModalOpen}
                onCancel={() => { setRejectModalOpen(false); setRejectionReason(''); }}
                onOk={handleReject}
                okText="Reject"
                okButtonProps={{ danger: true, loading: processing }}
            >
                <p>Select a reason for rejection:</p>
                <Select
                    style={{ width: '100%', marginBottom: 16 }}
                    placeholder="Select reason"
                    value={rejectionReason}
                    onChange={setRejectionReason}
                >
                    {rejectionReasons.map((reason) => (
                        <Select.Option key={reason} value={reason}>{reason}</Select.Option>
                    ))}
                </Select>
                <p>Additional notes (optional):</p>
                <TextArea rows={3} placeholder="Add notes for the user..." />
            </Modal>
        </div>
    );
}

