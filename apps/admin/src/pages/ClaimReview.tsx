import { Card, Table, Tag, Button, Space, Steps, Descriptions, Modal, Input, message } from 'antd';
import { useState } from 'react';
import { CheckOutlined, CloseOutlined, MailOutlined, PhoneOutlined, FileOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const mockClaims = [
    {
        id: '1',
        churchName: 'Holy Trinity Parish',
        claimantName: 'Fr. Michael Johnson',
        claimantTitle: 'Pastor',
        claimantEmail: 'fr.michael@holytrinityparish.org',
        claimantPhone: '+1 555-0123',
        emailVerified: true,
        smsVerified: true,
        documentsSubmitted: true,
        status: 'documents_submitted',
        createdAt: '2 days ago',
    },
    {
        id: '2',
        churchName: 'St. Mary\'s Catholic Church',
        claimantName: 'Deacon Paul Smith',
        claimantTitle: 'Parish Administrator',
        claimantEmail: 'admin@stmaryschurch.com',
        claimantPhone: '+1 555-0456',
        emailVerified: true,
        smsVerified: true,
        documentsSubmitted: true,
        status: 'under_review',
        createdAt: '5 days ago',
    },
];

export function ClaimReview() {
    const [selectedClaim, setSelectedClaim] = useState<any>(null);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);

    const handleApprove = (id: string) => {
        message.success('Claim approved! Church is now verified.');
        setSelectedClaim(null);
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

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Church Claim Review</h1>
            <p style={{ marginBottom: 24, color: '#666' }}>
                <Tag color="orange">{mockClaims.length}</Tag> claims awaiting review
            </p>

            <Card>
                <Table
                    columns={columns}
                    dataSource={mockClaims}
                    rowKey="id"
                    pagination={false}
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
                    <Button key="approve" type="primary" onClick={() => handleApprove(selectedClaim?.id)}>
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
                                { title: 'Email OTP', status: 'finish' },
                                { title: 'SMS OTP', status: 'finish' },
                                { title: 'Documents', status: 'finish' },
                                { title: 'Admin Review', status: 'process' },
                            ]}
                        />

                        <Descriptions bordered column={2}>
                            <Descriptions.Item label="Church Name">{selectedClaim.churchName}</Descriptions.Item>
                            <Descriptions.Item label="Submitted">{selectedClaim.createdAt}</Descriptions.Item>
                            <Descriptions.Item label="Claimant Name">{selectedClaim.claimantName}</Descriptions.Item>
                            <Descriptions.Item label="Title">{selectedClaim.claimantTitle}</Descriptions.Item>
                            <Descriptions.Item label="Email">{selectedClaim.claimantEmail}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{selectedClaim.claimantPhone}</Descriptions.Item>
                        </Descriptions>

                        <Card title="Submitted Documents" size="small" style={{ marginTop: 16 }}>
                            <p>📄 church_letterhead.pdf - <a href="#">View</a></p>
                            <p>📄 pastor_id.jpg - <a href="#">View</a></p>
                            <p>📄 utility_bill.pdf - <a href="#">View</a></p>
                        </Card>
                    </div>
                )}
            </Modal>

            {/* Reject Modal */}
            <Modal
                title="Reject Claim"
                open={rejectModalOpen}
                onCancel={() => setRejectModalOpen(false)}
                onOk={() => { message.warning('Claim rejected'); setRejectModalOpen(false); setSelectedClaim(null); }}
                okText="Reject"
                okButtonProps={{ danger: true }}
            >
                <p>Reason for rejection:</p>
                <TextArea rows={4} placeholder="Explain why this claim is being rejected..." />
            </Modal>
        </div>
    );
}
