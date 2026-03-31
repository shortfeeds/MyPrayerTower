import { useEffect, useState } from 'react';
import { Card, Form, Input, Switch, Button, message, Divider, Alert, Row, Col } from 'antd';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons';

import { api } from '../utils/api';

export function Settings() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/settings');
            form.setFieldsValue(data);
        } catch (err) {
            message.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values: any) => {
        try {
            setSaving(true);
            await api.post('/admin/settings', values);
            message.success('Settings updated successfully');
        } catch (err) {
            message.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Settings</h1>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saving}
                    onClick={() => form.submit()}
                >
                    Save Changes
                </Button>
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                disabled={loading}
            >
                <Row gutter={24}>
                    <Col span={16}>
                        <Card title="General Settings" style={{ marginBottom: 24 }}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="siteName" label="Site Name">
                                        <Input prefix={<SettingOutlined />} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="siteTagline" label="Tagline">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="Feature Flags" style={{ marginBottom: 24 }}>
                            <Form.Item name="maintenanceMode" label="Maintenance Mode" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                            <Alert
                                message="Enabling Maintenance Mode will prevent non-admin users from accessing the site."
                                type="warning"
                                showIcon
                                style={{ marginBottom: 16 }}
                            />

                            <Divider />

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item name="registrationEnabled" label="User Registration" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="prayerWallEnabled" label="Prayer Wall" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item name="syncEnabled" label="Data Sync" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="AdMob Configuration" style={{ marginBottom: 24 }}>
                            <Divider orientation="left">Banner Ads</Divider>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="bannerAdUnitIdAndroid" label="Android Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="bannerAdUnitIdiOS" label="iOS Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">Interstitial Ads</Divider>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="interstitialAdUnitIdAndroid" label="Android Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="interstitialAdUnitIdiOS" label="iOS Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">Native Ads</Divider>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="nativeAdUnitIdAndroid" label="Android Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="nativeAdUnitIdiOS" label="iOS Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">Rewarded Ads</Divider>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="rewardedAdUnitIdAndroid" label="Android Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="rewardedAdUnitIdiOS" label="iOS Unit ID">
                                        <Input placeholder="ca-app-pub-..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    <Col span={8}>
                        <Card title="Pricing Control" style={{ marginBottom: 24 }}>
                            <Form.Item name="plusMonthlyPrice" label="Plus Monthly (cents)">
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="premiumMonthlyPrice" label="Premium Monthly (cents)">
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="lifetimePrice" label="Lifetime (cents)">
                                <Input type="number" />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}


