import { Metadata } from 'next';
import MemorialsClient from './MemorialsClient';

export const metadata: Metadata = {
    title: 'Digital Memorials | Sacred Remembrance',
    description: 'Create a lasting tribute. Honor your loved ones with digital memorials, prayers, and remembrance.',
    openGraph: {
        title: 'Digital Memorials | Sacred Remembrance - MyPrayerTower',
        description: 'Honor your loved ones with digital memorials, prayers, and sacred remembrance.',
        type: 'website',
    },
};

export default function MemorialsPage() {
    return <MemorialsClient />;
}
