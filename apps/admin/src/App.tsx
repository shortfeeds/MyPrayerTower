import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PrayerModeration } from './pages/PrayerModeration';
import { ChurchManagement } from './pages/ChurchManagement';
import { ClaimReview } from './pages/ClaimReview';
import { UserManagement } from './pages/UserManagement';
import { SyncControl } from './pages/SyncControl';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';

function RequireAuth({ children }: { children: JSX.Element }) {
    const token = localStorage.getItem('token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={
                <RequireAuth>
                    <Layout>
                        <Navigate to="/dashboard" replace />
                    </Layout>
                </RequireAuth>
            } />

            <Route path="/dashboard" element={
                <RequireAuth>
                    <Layout><Dashboard /></Layout>
                </RequireAuth>
            } />
            <Route path="/prayers" element={
                <RequireAuth>
                    <Layout><PrayerModeration /></Layout>
                </RequireAuth>
            } />
            <Route path="/churches" element={
                <RequireAuth>
                    <Layout><ChurchManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/claims" element={
                <RequireAuth>
                    <Layout><ClaimReview /></Layout>
                </RequireAuth>
            } />
            <Route path="/users" element={
                <RequireAuth>
                    <Layout><UserManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/sync" element={
                <RequireAuth>
                    <Layout><SyncControl /></Layout>
                </RequireAuth>
            } />
            <Route path="/settings" element={
                <RequireAuth>
                    <Layout><Settings /></Layout>
                </RequireAuth>
            } />
        </Routes>
    );
}

export default App;
