import { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Breadcrumb, Input, Badge, Dropdown, Avatar, theme, List, Typography, Empty, Popover, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    HeartOutlined,
    BankOutlined,
    BarChartOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    SyncOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SearchOutlined,
    LogoutOutlined,
    BellOutlined,
    FileTextOutlined,
    TeamOutlined,
    NotificationOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

interface Notification {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
}

export function Layout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    // Fetch pending count and notifications
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                // Fetch dashboard stats for pending count
                const dashRes = await fetch(`${API_URL}/admin/dashboard`, {
                    headers: getAuthHeaders()
                });
                if (dashRes.ok) {
                    const data = await dashRes.json();
                    setPendingCount(data.pendingPrayers || 0);
                }

                // Fetch real notifications from API
                const notifRes = await fetch(`${API_URL}/admin/notifications/recent`, {
                    headers: getAuthHeaders()
                });
                if (notifRes.ok) {
                    const data = await notifRes.json();
                    setNotifications(data.notifications || data || []);
                    setNotificationCount(data.unreadCount || data.filter((n: Notification) => !n.read).length || 0);
                } else {
                    // Fallback to mock notifications if API unavailable
                    setNotifications([
                        { id: '1', title: 'New Prayer Request', message: 'A new prayer needs moderation', createdAt: new Date().toISOString(), read: false },
                        { id: '2', title: 'Church Claim', message: 'New claim submitted for St. Patrick\'s', createdAt: new Date(Date.now() - 3600000).toISOString(), read: false },
                        { id: '3', title: 'User Report', message: 'User reported for spam', createdAt: new Date(Date.now() - 7200000).toISOString(), read: true },
                    ]);
                    setNotificationCount(2);
                }
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    // Map path to breadcrumb name
    const pathNameMap: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/prayers': 'Prayer Moderation',
        '/churches': 'Church Management',
        '/claims': 'Claim Review',
        '/users': 'User Management',
        '/sync': 'Sync Control',
        '/settings': 'Settings',
        '/analytics': 'Analytics',
        '/articles': 'Articles',
        '/memorials': 'Memorials',
        '/notifications': 'Notifications',
        '/abandoned-carts': 'Abandoned Carts',
        '/failed-payments': 'Failed Payments',
        '/ads': 'Ads Management',
    };

    const menuItems = [
        { key: '/dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
        {
            key: '/prayers',
            icon: <HeartOutlined />,
            label: (
                <Link to="/prayers" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Prayer Moderation</span>
                    {pendingCount > 0 && <Badge count={pendingCount} size="small" style={{ marginLeft: 8 }} />}
                </Link>
            )
        },
        { key: '/churches', icon: <BankOutlined />, label: <Link to="/churches">Church Management</Link> },
        { key: '/mass-offerings', icon: <HeartOutlined />, label: <Link to="/mass-offerings">Mass Offerings</Link> },
        { key: '/pilgrimages', icon: <EnvironmentOutlined />, label: <Link to="/pilgrimages">Pilgrimages</Link> },
        { key: '/donations', icon: <DollarOutlined />, label: <Link to="/donations">Donations</Link> },
        { key: '/failed-payments', icon: <ShoppingCartOutlined />, label: <Link to="/failed-payments">Failed Payments</Link> },
        { key: '/abandoned-carts', icon: <ShoppingCartOutlined />, label: <Link to="/abandoned-carts">Abandoned Carts</Link> },
        { key: '/memorials', icon: <TeamOutlined />, label: <Link to="/memorials">Memorials</Link> },
        { key: '/saints', icon: <SafetyCertificateOutlined />, label: <Link to="/saints">Saints</Link> }, // Added Saints navigation item
        { key: '/analytics', icon: <BarChartOutlined />, label: <Link to="/analytics">Analytics</Link> },
        { key: '/articles', icon: <FileTextOutlined />, label: <Link to="/articles">Articles (CMS)</Link> },
        { key: '/claims', icon: <SafetyCertificateOutlined />, label: <Link to="/claims">Claim Review</Link> },
        { key: '/users', icon: <UserOutlined />, label: <Link to="/users">User Management</Link> },
        { key: '/notifications', icon: <NotificationOutlined />, label: <Link to="/notifications">Notifications</Link> },
        { key: '/reports', icon: <BarChartOutlined />, label: <Link to="/reports">Reports</Link> },
        { key: '/ads', icon: <NotificationOutlined />, label: <Link to="/ads">Ads Management</Link> },
        { key: '/sync', icon: <SyncOutlined />, label: <Link to="/sync">Sync Control</Link> },
        { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">Settings</Link> },
    ];

    const currentPathName = pathNameMap[location.pathname] || 'Dashboard';

    const handleLogout = () => {
        localStorage.removeItem('token');
        message.success('Logged out successfully');
        navigate('/login');
    };

    const userMenu = {
        items: [
            {
                key: 'profile',
                label: 'Profile',
                icon: <UserOutlined />
            },
            {
                key: 'settings',
                label: 'Settings',
                icon: <SettingOutlined />,
                onClick: () => navigate('/settings')
            },
            {
                type: 'divider' as const,
            },
            {
                key: 'logout',
                label: 'Logout',
                icon: <LogoutOutlined />,
                danger: true,
                onClick: handleLogout
            },
        ]
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setNotificationCount(0);
        message.success('All notifications marked as read');
    };

    const notificationContent = (
        <div style={{ width: 320 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #1e293b' }}>
                <Typography.Text strong>Notifications</Typography.Text>
                <Typography.Link onClick={markAllRead} style={{ fontSize: 12 }}>Mark all read</Typography.Link>
            </div>
            {notifications.length > 0 ? (
                <List
                    dataSource={notifications}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                padding: '12px',
                                background: item.read ? 'transparent' : 'rgba(245, 158, 11, 0.1)',
                                cursor: 'pointer'
                            }}
                        >
                            <List.Item.Meta
                                title={<span style={{ fontSize: 13, fontWeight: item.read ? 400 : 600 }}>{item.title}</span>}
                                description={<span style={{ fontSize: 12, color: '#64748b' }}>{item.message}</span>}
                            />
                        </List.Item>
                    )}
                />
            ) : (
                <Empty description="No notifications" style={{ padding: 24 }} />
            )}
            <div style={{ textAlign: 'center', padding: '8px', borderTop: '1px solid #1e293b' }}>
                <Link to="/notifications" style={{ fontSize: 12 }}>View all notifications</Link>
            </div>
        </div>
    );

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                width={260}
                style={{
                    borderRight: '1px solid #1e293b',
                    zIndex: 10
                }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: 8
                }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 32, height: 32,
                            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                            borderRadius: 8,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 'bold', color: 'white'
                        }}>
                            MP
                        </div>
                        {!collapsed && (
                            <span style={{
                                color: 'white',
                                fontSize: 18,
                                fontWeight: 700,
                                fontFamily: 'serif',
                                letterSpacing: '0.5px'
                            }}>
                                PrayerTower
                            </span>
                        )}
                    </Link>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ background: 'transparent', borderRight: 0 }}
                />
            </Sider>
            <AntLayout>
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #1e293b',
                    height: 64,
                    position: 'sticky',
                    top: 0,
                    zIndex: 9
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        {collapsed ?
                            <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: 18, cursor: 'pointer', color: '#94a3b8' }} /> :
                            <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: 18, cursor: 'pointer', color: '#94a3b8' }} />
                        }

                        {/* Breadcrumb */}
                        <Breadcrumb
                            items={[
                                { title: 'Admin' },
                                { title: currentPathName },
                            ]}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        {/* Global Search */}
                        <Input
                            placeholder="Search anything (Cmd+K)..."
                            prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                            style={{
                                width: 300,
                                background: '#0f172a',
                                border: '1px solid #1e293b',
                                color: 'white',
                                borderRadius: 8
                            }}
                            variant="filled"
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <Popover content={notificationContent} trigger="click" placement="bottomRight">
                                <Badge count={notificationCount} size="small" offset={[-2, 2]}>
                                    <BellOutlined style={{ fontSize: 20, color: '#94a3b8', cursor: 'pointer' }} />
                                </Badge>
                            </Popover>

                            <Dropdown menu={userMenu} placement="bottomRight">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                                    <Avatar size="default" style={{ backgroundColor: '#f59e0b', verticalAlign: 'middle' }}>
                                        A
                                    </Avatar>
                                    <div style={{ lineHeight: '1.2' }}>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>Super Admin</div>
                                        <div style={{ fontSize: 11, color: '#64748b' }}>Administrator</div>
                                    </div>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Content style={{ margin: '24px 24px 0', overflow: 'initial' }}>
                    <div style={{
                        padding: 0,
                        minHeight: 360,
                    }}>
                        {children}
                    </div>
                </Content>
            </AntLayout>
        </AntLayout>
    );
}
