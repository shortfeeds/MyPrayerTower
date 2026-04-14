import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PrayerModeration } from './pages/PrayerModeration';
import { ChurchManagement } from './pages/ChurchManagement';
import { ClaimReview } from './pages/ClaimReview';
import { UserManagement } from './pages/UserManagement';
import { SyncControl } from './pages/SyncControl';
import { Settings } from './pages/Settings';
import AnalyticsDashboard from './pages/Analytics';
import { Login } from './pages/Login';
import { Articles } from './pages/Articles';
import { MemorialManagement } from './pages/MemorialManagement';
import MassOfferingsManagement from './pages/MassOfferingsManagement';
import PilgrimagesManagement from './pages/PilgrimagesManagement';
import DonationsList from './pages/DonationsList';
import { NotificationCenter } from './pages/NotificationCenter';
import { AdManagement } from './pages/AdManagement';
import { UserReports } from './pages/UserReports';
import SaintsManagement from './pages/SaintsManagement';
import { AbandonedCartManagement } from './pages/AbandonedCartManagement';
import { FailedPayments } from './pages/FailedPayments';


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
            <Route path="/analytics" element={
                <RequireAuth>
                    <Layout><AnalyticsDashboard /></Layout>
                </RequireAuth>
            } />
            <Route path="/settings" element={
                <RequireAuth>
                    <Layout><Settings /></Layout>
                </RequireAuth>
            } />
            <Route path="/articles" element={
                <RequireAuth>
                    <Layout><Articles /></Layout>
                </RequireAuth>
            } />
            <Route path="/memorials" element={
                <RequireAuth>
                    <Layout><MemorialManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/notifications" element={
                <RequireAuth>
                    <Layout><NotificationCenter /></Layout>
                </RequireAuth>
            } />
            <Route path="/reports" element={
                <RequireAuth>
                    <Layout><UserReports /></Layout>
                </RequireAuth>
            } />
            <Route path="/saints" element={
                <RequireAuth>
                    <Layout><SaintsManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/mass-offerings" element={
                <RequireAuth>
                    <Layout><MassOfferingsManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/pilgrimages" element={
                <RequireAuth>
                    <Layout><PilgrimagesManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/donations" element={
                <RequireAuth>
                    <Layout><DonationsList /></Layout>
                </RequireAuth>
            } />
            <Route path="/ads" element={
                <RequireAuth>
                    <Layout><AdManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/abandoned-carts" element={
                <RequireAuth>
                    <Layout><AbandonedCartManagement /></Layout>
                </RequireAuth>
            } />
            <Route path="/failed-payments" element={
                <RequireAuth>
                    <Layout><FailedPayments /></Layout>
                </RequireAuth>
            } />
        </Routes>
    );
}

export default App;
