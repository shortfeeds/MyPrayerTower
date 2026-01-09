import { useState } from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
    DashboardOutlined,
    HeartOutlined,
    BankOutlined,
    SafetyCertificateOutlined,
    UserOutlined,
    SyncOutlined,
    SettingOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = AntLayout;

const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: '/prayers', icon: <HeartOutlined />, label: <Link to="/prayers">Prayer Moderation</Link> },
    { key: '/churches', icon: <BankOutlined />, label: <Link to="/churches">Church Management</Link> },
    { key: '/claims', icon: <SafetyCertificateOutlined />, label: <Link to="/claims">Claim Review</Link> },
    { key: '/users', icon: <UserOutlined />, label: <Link to="/users">User Management</Link> },
    { key: '/sync', icon: <SyncOutlined />, label: <Link to="/sync">Sync Control</Link> },
    { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">Settings</Link> },
];

export function Layout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    // Map path to breadcrumb name
    const pathNameMap: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/prayers': 'Prayers',
        '/churches': 'Churches',
        '/claims': 'Claims',
        '/users': 'Users',
        '/sync': 'Sync',
        '/settings': 'Settings',
    };

    const currentPathName = pathNameMap[location.pathname] || 'Dashboard';

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
                icon: <SettingOutlined />
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                label: 'Logout',
                icon: <LogoutOutlined />,
                danger: true
            },
        ]
    };

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
                            <Badge count={5} size="small" offset={[-2, 2]}>
                                <BellOutlined style={{ fontSize: 20, color: '#94a3b8', cursor: 'pointer' }} />
                            </Badge>

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
                        // background: colorBgContainer,
                        // borderRadius: borderRadiusLG,
                    }}>
                        {children}
                    </div>
                </Content>
            </AntLayout>
        </AntLayout>
    );
}
