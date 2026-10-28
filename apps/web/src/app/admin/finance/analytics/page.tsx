import { redirect } from 'next/navigation';

export default function FinancialAnalyticsRedirect() {
    redirect('/admin/finance/overview');
}
