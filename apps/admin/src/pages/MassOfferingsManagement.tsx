import { useState, useEffect } from 'react';
import { Table, Tabs, Tag, Button, Modal, Form, Input, DatePicker, message, Card, Space } from 'antd';
import { CheckCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { api } from '../utils/api';
import dayjs from 'dayjs';

interface MassOffering {
    id: string;
    orderNumber: string;
    amount: number;
    currency: string;
    status: string;
    intention: string;
    offeredBy: string | null;
    inMemoryOf: string | null;
    celebrationDate: string | null;
    massTime: string | null;
    celebrant: string | null;
    createdAt: string;
    User: {
        email: string;
        fullName: string;
    } | null;
    name: string;
}

const { TabPane } = Tabs;

export default function MassOfferingsManagement() {
    const [offerings, setOfferings] = useState<MassOffering[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
    const [selectedOffering, setSelectedOffering] = useState<MassOffering | null>(null);
    const [form] = Form.useForm();

    const fetchOfferings = async () => {
        setLoading(true);
        try {
            const statusParams = activeTab === 'ALL' ? '' : `?status=${activeTab}`;
            const { data } = await api.get(`/mass-offerings/admin/all${statusParams}`);
            setOfferings(data.offerings || data || []);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch offerings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfferings();
    }, [activeTab]);

    const handleMarkOffered = (id: string) => {
        Modal.confirm({
            title: 'Mark as Offered?',
            content: 'This will notify the user that the Mass has been celebrated.',
            onOk: async () => {
                try {
                    await api.post(`/mass-offerings/admin/${id}/mark-offered`);
                    message.success('Marked as offered');
                    fetchOfferings();
                } catch (error) {
                    message.error('Failed to update status');
                }
            }
        });
    };

    const handleSchedule = (record: MassOffering) => {
        setSelectedOffering(record);
        form.setFieldsValue({
            celebrationDate: record.celebrationDate ? dayjs(record.celebrationDate) : null,
            massTime: record.massTime,
            celebrant: record.celebrant
        });
        setIsScheduleModalVisible(true);
    };

    const handleScheduleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!selectedOffering) return;

            await api.post(`/mass-offerings/admin/${selectedOffering.id}/schedule`, {
                celebrationDate: values.celebrationDate.toISOString(),
                massTime: values.massTime,
                celebrant: values.celebrant
            });
            message.success('Mass scheduled');
            setIsScheduleModalVisible(false);
            fetchOfferings();
        } catch (error) {
            message.error('Failed to schedule');
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Intention / Donor',
            key: 'intention',
            render: (_: any, r: MassOffering) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{r.intention}</div>
                    {r.inMemoryOf && <div style={{ fontSize: 12, color: '#64748b' }}>In Memory: {r.inMemoryOf}</div>}
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>By: {r.offeredBy || r.name}</div>
                </div>
            )
        },
        {
            title: 'Amount',
            key: 'amount',
            render: (_: any, r: MassOffering) => (
                <span>{(r.amount / 100).toLocaleString('en-US', { style: 'currency', currency: r.currency })}</span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'OFFERED') color = 'success';
                if (status === 'SCHEDULED') color = 'processing';
                if (status === 'ASSIGNED') color = 'cyan';
                if (status === 'PAID') color = 'warning';
                if (status === 'PENDING_PAYMENT') color = 'error';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Schedule',
            key: 'schedule',
            render: (_: any, r: MassOffering) => (
                <div>
                    {r.celebrationDate ? dayjs(r.celebrationDate).format('YYYY-MM-DD') : '-'}
                    {r.massTime && <div>{r.massTime}</div>}
                </div>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, r: MassOffering) => (
                <Space>
                    {r.status !== 'PENDING_PAYMENT' && (
                        <Button size="small" icon={<ScheduleOutlined />} onClick={() => handleSchedule(r)}>
                            Schedule
                        </Button>
                    )}
                    {r.status !== 'OFFERED' && r.status !== 'PENDING_PAYMENT' && (
                        <Button size="small" type="primary" icon={<CheckCircleOutlined />} onClick={() => handleMarkOffered(r.id)} />
                    )}
                </Space>
            )
        }
    ];

    const items = [
        { key: 'ALL', label: 'All' },
        { key: 'PENDING_PAYMENT', label: 'Unpaid' },
        { key: 'PAID', label: 'To Schedule' },
        { key: 'SCHEDULED', label: 'Scheduled' },
        { key: 'OFFERED', label: 'Offered' },
    ];

    return (
        <Card title="Mass Offerings">
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
            <Table
                dataSource={offerings}
                columns={columns}
                rowKey="id"
                loading={loading}
            />

            <Modal
                title="Schedule Mass"
                open={isScheduleModalVisible}
                onOk={handleScheduleSubmit}
                onCancel={() => setIsScheduleModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="celebrationDate" label="Date" rules={[{ required: true }]}>
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="massTime" label="Time">
                        <Input placeholder="e.g. 9:00 AM" />
                    </Form.Item>
                    <Form.Item name="celebrant" label="Celebrant">
                        <Input placeholder="Fr. Name" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
}
