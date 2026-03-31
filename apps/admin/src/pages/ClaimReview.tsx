import { Card, Table, Tag, Button, Space, Steps, Descriptions, Modal, Input, message, Spin } from 'antd';
import { MailOutlined, PhoneOutlined, FileOutlined } from '@ant-design/icons';
import { api } from '../utils/api';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

export function ClaimReview() {
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClaim, setSelectedClaim] = useState<any>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchClaims();
    }, []);

    const fetchClaims = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/claims/pending');
            setClaims(data || []);
        } catch (err) {
            message.error('Failed to load pending claims');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            await api.post(`/admin/claims/${id}/approve`);
            message.success('Claim approved! Church is now verified.');
            setSelectedClaim(null);
            fetchClaims();
        } catch (err) {
            message.error('Failed to approve claim');
        }
    };

    const handleReject = async () => {
        if (!selectedClaim) return;
        try {
            await api.post(`/admin/claims/${selectedClaim.id}/reject`, { reason: rejectionReason });
            message.success('Claim rejected');
            setRejectModalOpen(false);
            setSelectedClaim(null);
            setRejectionReason('');
            fetchClaims();
        } catch (err) {
            message.error('Failed to reject claim');
        }
    };

    const columns = [
        { title: 'Church', dataIndex: 'churchName', key: 'churchName' },
        { title: 'Claimant', dataIndex: 'claimantName', key: 'claimantName' },
        { title: 'Title', dataIndex: 'claimantTitle', key: 'claimantTitle' },
        {
            title: 'Verification',
            key: 'verification',
            render: (_: any, record: any) => (
                <Space>
                    <Tag color={record.emailVerified ? 'green' : 'default'} icon={<MailOutlined />}>Email</Tag>
                    <Tag color={record.smsVerified ? 'green' : 'default'} icon={<PhoneOutlined />}>SMS</Tag>
                    <Tag color={record.documentsSubmitted ? 'green' : 'default'} icon={<FileOutlined />}>Docs</Tag>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'under_review' ? 'blue' : 'orange'}>
                    {status.replace('_', ' ').toUpperCase()}
                </Tag>
            ),
        },
        { title: 'Submitted', dataIndex: 'createdAt', key: 'createdAt' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Button type="primary" onClick={() => setSelectedClaim(record)}>
                    Review
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: 48 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Church Claim Review</h1>
            <p style={{ marginBottom: 24, color: '#666' }}>
                <Tag color="orange">{claims.length}</Tag> claims awaiting review
            </p>

            <Card>
                <Table
                    columns={columns}
                    dataSource={claims}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No pending claims found' }}
                />
            </Card>

            {/* Review Modal */}
            <Modal
                title="Review Church Claim"
                open={!!selectedClaim && !rejectModalOpen}
                onCancel={() => setSelectedClaim(null)}
                width={700}
                footer={[
                    <Button key="reject" danger onClick={() => setRejectModalOpen(true)}>
                        Reject
                    </Button>,
                    <Button key="approve" type="primary" onClick={() => handleApprove(selectedClaim.id)}>
                        Approve & Verify Church
                    </Button>,
                ]}
            >
                {selectedClaim && (
                    <div>
                        <Steps
                            current={3}
                            size="small"
                            style={{ marginBottom: 24 }}
                            items={[
                                { title: 'Email OTP', status: selectedClaim.emailVerified ? 'finish' : 'wait' },
                                { title: 'SMS OTP', status: selectedClaim.smsVerified ? 'finish' : 'wait' },
                                { title: 'Documents', status: selectedClaim.documentsSubmitted ? 'finish' : 'wait' },
                                { title: 'Admin Review', status: 'process' },
                            ]}
                        />

                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Church Name">{selectedClaim.churchName}</Descriptions.Item>
                            <Descriptions.Item label="Submitted">{new Date(selectedClaim.createdAt).toLocaleDateString()}</Descriptions.Item>
                            <Descriptions.Item label="Claimant Name">{selectedClaim.claimantName}</Descriptions.Item>
                            <Descriptions.Item label="Title">{selectedClaim.claimantTitle}</Descriptions.Item>
                            <Descriptions.Item label="Email">{selectedClaim.claimantEmail}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{selectedClaim.claimantPhone}</Descriptions.Item>
                        </Descriptions>

                        <Card title="Submitted Documents" size="small" style={{ marginTop: 16 }}>
                            {selectedClaim.documents && selectedClaim.documents.length > 0 ? (
                                selectedClaim.documents.map((doc: any, index: number) => (
                                    <p key={index}>📄 {doc.name} - <a href={doc.url} target="_blank" rel="noreferrer">View</a></p>
                                ))
                            ) : (
                                <p>No documents submitted</p>
                            )}
                        </Card>
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal
                title="Reject Claim"
                open={rejectModalOpen}
                onCancel={() => setRejectModalOpen(false)}
                onOk={handleReject}
                okText="Reject"
                okButtonProps={{ danger: true }}
            >
                <p>Reason for rejection:</p>
                <TextArea 
                    rows={4} 
                    placeholder="Explain why this claim is being rejected..." 
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                />
            </Modal>
        </div>
    );
}
