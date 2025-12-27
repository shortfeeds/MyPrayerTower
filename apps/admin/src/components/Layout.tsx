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

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ background: '#001529' }}
            >
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: collapsed ? 16 : 18,
                    fontWeight: 'bold',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    {collapsed ? 'MPT' : 'MyPrayerTower'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    style={{ borderRight: 0 }}
                />
            </Sider>
            <AntLayout>
                <Header style={{
                    padding: '0 24px',
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        {collapsed ?
                            <MenuUnfoldOutlined onClick={() => setCollapsed(false)} style={{ fontSize: 18, cursor: 'pointer' }} /> :
                            <MenuFoldOutlined onClick={() => setCollapsed(true)} style={{ fontSize: 18, cursor: 'pointer' }} />
                        }
                        <span style={{ fontWeight: 600, fontSize: 18 }}>Admin Panel</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <span>admin@myprayertower.com</span>
                    </div>
                </Header>
                <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 280 }}>
                    {children}
                </Content>
            </AntLayout>
        </AntLayout>
    );
}
