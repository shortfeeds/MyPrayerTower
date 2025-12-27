import { Card, Table, Tag, Button, Input, Space, Avatar } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

const mockUsers = [
    { id: '1', name: 'Maria Santos', email: 'maria@example.com', tier: 'premium', joinedAt: 'Dec 1, 2024', prayers: 45 },
    { id: '2', name: 'John Doe', email: 'john@example.com', tier: 'free', joinedAt: 'Nov 15, 2024', prayers: 12 },
    { id: '3', name: 'Sarah Miller', email: 'sarah@example.com', tier: 'plus', joinedAt: 'Oct 20, 2024', prayers: 28 },
    { id: '4', name: 'Michael Brown', email: 'michael@example.com', tier: 'free', joinedAt: 'Dec 10, 2024', prayers: 5 },
];

const tierColors: Record<string, string> = {
    free: 'default',
    plus: 'blue',
    premium: 'gold',
    lifetime: 'purple',
};

export function UserManagement() {
    const columns = [
        {
            title: 'User',
            key: 'user',
            render: (_: any, record: any) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Subscription',
            dataIndex: 'tier',
            key: 'tier',
            render: (tier: string) => <Tag color={tierColors[tier]}>{tier.toUpperCase()}</Tag>,
        },
        { title: 'Joined', dataIndex: 'joinedAt', key: 'joinedAt' },
        { title: 'Prayers', dataIndex: 'prayers', key: 'prayers' },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Button size="small">View</Button>
                    <Button size="small">Edit</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>User Management</h1>

            <Card>
                <div style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Search users..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={mockUsers}
                    rowKey="id"
                    pagination={{ pageSize: 10, total: 12543, showTotal: (t) => `${t} users` }}
                />
            </Card>
        </div>
    );
}
