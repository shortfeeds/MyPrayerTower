import { Card, Table, Tag, Button, Input, Space, Tooltip } from 'antd';
import { SearchOutlined, EditOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';

const mockChurches = [
    { id: '1', name: 'St. Patrick\'s Cathedral', city: 'New York', country: 'USA', type: 'Cathedral', isVerified: true, viewCount: 15420 },
    { id: '2', name: 'Holy Name of Jesus Church', city: 'New York', country: 'USA', type: 'Parish', isVerified: true, viewCount: 8320 },
    { id: '3', name: 'Church of St. Francis of Assisi', city: 'New York', country: 'USA', type: 'Parish', isVerified: false, viewCount: 5210 },
    { id: '4', name: 'Our Lady of Guadalupe', city: 'Los Angeles', country: 'USA', type: 'Parish', isVerified: false, viewCount: 3100 },
];

export function ChurchManagement() {
    const columns = [
        { title: 'Church Name', dataIndex: 'name', key: 'name' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Country', dataIndex: 'country', key: 'country' },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag>{type}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'isVerified',
            key: 'isVerified',
            render: (verified: boolean) => (
                verified ? (
                    <Tag color="green" icon={<CheckCircleOutlined />}>Verified</Tag>
                ) : (
                    <Tag color="default">Unverified</Tag>
                )
            ),
        },
        {
            title: 'Views',
            dataIndex: 'viewCount',
            key: 'viewCount',
            render: (count: number) => count.toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space>
                    <Tooltip title="View"><Button icon={<EyeOutlined />} /></Tooltip>
                    <Tooltip title="Edit"><Button icon={<EditOutlined />} /></Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Church Management</h1>

            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <Input
                        placeholder="Search churches..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                    />
                    <Button type="primary">Add Church</Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={mockChurches}
                    rowKey="id"
                    pagination={{ pageSize: 10, total: 48721, showTotal: (t) => `${t} churches` }}
                />
            </Card>
        </div>
    );
}
