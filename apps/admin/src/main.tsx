import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider
            theme={{
                algorithm: theme.darkAlgorithm,
                token: {
                    colorPrimary: '#eab308', // Gold/Amber-500
                    colorBgBase: '#0b1120', // Slate-950
                    colorBgContainer: '#111827', // Slate-900
                    borderRadius: 8,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                },
                components: {
                    Layout: {
                        bodyBg: '#0f172a', // Slate-900
                        headerBg: '#111827',
                        siderBg: '#020617', // Slate-950
                    },
                    Card: {
                        colorBgContainer: '#1e293b',
                    },
                    Table: {
                        colorBgContainer: '#1e293b',
                        headerBg: '#0f172a',
                    }
                }
            }}
        >
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ConfigProvider>
    </React.StrictMode>
);
