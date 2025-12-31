import { useState } from 'react';
import { Card, Table, Tag, Button, Modal, Input, Space, Select, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const { TextArea } = Input;

// Mock data
const mockPrayers = [
    { id: '1', content: 'Please pray for my mother who is having surgery tomorrow.', user: 'Maria S.', category: 'Health', visibility: 'public', createdAt: '5 min ago' },
    { id: '2', content: 'For peace in our family and reconciliation between my siblings.', user: 'Anonymous', category: 'Family', visibility: 'anonymous', createdAt: '12 min ago' },
    { id: '3', content: 'For guidance in finding a new job.', user: 'John D.', category: 'Work', visibility: 'public', createdAt: '1 hour ago' },
];

const rejectionReasons = [
    'Contains inappropriate content',
    'Contains personal contact information',
    'Not a prayer request',
    'Contains spam or advertising',
    'Violates community guidelines',
    'Needs more context (resubmit)',
];

export function PrayerModeration() {
    const [selectedPrayer, setSelectedPrayer] = useState<any>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleApprove = (_id: string) => {
        message.success('Prayer approved and published');
        // TODO: Call API
    };

    const handleReject = () => {
        message.warning('Prayer rejected');
        setRejectModalOpen(false);
        setSelectedPrayer(null);
        // TODO: Call API
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
        { title: 'User', dataIndex: 'user', key: 'user' },
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
                <Tag color={vis === 'public' ? 'green' : 'orange'}>
                    {vis === 'public' ? '🌍 Public' : '👤 Anonymous'}
                </Tag>
            ),
        },
        { title: 'Submitted', dataIndex: 'createdAt', key: 'createdAt' },
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
                <Tag color="orange">{mockPrayers.length}</Tag> prayers awaiting moderation
            </p>

            <Card>
                <Table
                    columns={columns}
                    dataSource={mockPrayers}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                />
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
                    <Button key="approve" type="primary" onClick={() => { handleApprove(selectedPrayer?.id); setSelectedPrayer(null); }}>
                        Approve
                    </Button>,
                ]}
            >
                {selectedPrayer && (
                    <div>
                        <p><strong>From:</strong> {selectedPrayer.user}</p>
                        <p><strong>Category:</strong> {selectedPrayer.category}</p>
                        <p><strong>Visibility:</strong> {selectedPrayer.visibility}</p>
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
                okButtonProps={{ danger: true }}
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
