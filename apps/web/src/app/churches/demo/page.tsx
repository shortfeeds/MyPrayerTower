import { ChurchProfile } from '@/components/churches/ChurchProfile';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Demo Parish Profile | MyPrayerTower',
    description: 'See what a verified church listing looks like on MyPrayerTower. Claim your parish today to manage Mass times, events, and parishioners.',
};

export default function DemoParishPage() {
    // Fully populated mock data for a "perfect" profile
    const demoChurch = {
        id: 'demo-church-123',
        name: "St. Jude's Catholic Church",
        slug: 'st-judes-demo',
        type: 'Parish',
        denomination: 'Roman Catholic',
        address: '123 Faithful Avenue\nSpringfield, IL 62704',
        city: 'Springfield',
        state: 'IL',
        postalCode: '62704',
        country: 'USA',
        phone: '+1 (555) 123-4567',
        website: 'https://www.example.com',
        email: 'office@stjudedemo.org',
        description: `Welcome to St. Jude's! We are a vibrant community of faith, hope, and love. Our parish has been serving the Springfield community for over 50 years. \n\nWe invite you to join us for Holy Mass, Confession, and our many community events. Whether you are a long-time parishioner or a visitor, you are always welcome here.\n\n"Faith is the assurance of things hoped for, the conviction of things not seen." - Hebrews 11:1`,
        isVerified: true,
        followerCount: 1543,
        viewCount: 15200,
        latitude: 39.7817,
        longitude: -89.6501,
        // High quality placeholder images
        primaryImageUrl: 'https://images.unsplash.com/photo-1548625361-e88cbb5adf69?q=80&w=2574&auto=format&fit=crop',
        Diocese: { id: 'dio-1', name: 'Diocese of Springfield', type: 'Diocese' },
        massSchedule: {
            sunday: ['7:30 AM', '9:00 AM', '11:00 AM', '5:00 PM'],
            monday: ['8:00 AM'],
            tuesday: ['8:00 AM', '6:00 PM'],
            wednesday: ['8:00 AM'],
            thursday: ['8:00 AM'],
            friday: ['8:00 AM', '12:00 PM'],
            saturday: ['8:00 AM', '4:00 PM (Vigil)'],
        },
        confessionSchedule: {
            saturday: ['3:00 PM - 3:45 PM'],
            tuesday: ['5:00 PM - 5:45 PM'],
        },
        adorationSchedule: {
            friday: ['8:30 AM - 12:00 PM'],
        },
        ChurchStaff: [
            { id: 's1', name: 'Fr. Michael O\'Connor', title: 'Pastor', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop' },
            { id: 's2', name: 'Dcn. Paul Wilson', title: 'Deacon', imageUrl: null },
            { id: 's3', name: 'Sarah Jenkins', title: 'Music Director', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop' },
        ],
        ChurchImage: [
            { id: 'i1', url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop', caption: 'Main Altar', isPrimary: true },
            { id: 'i2', url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=2671&auto=format&fit=crop', caption: 'Stained Glass', isPrimary: false },
            { id: 'i3', url: 'https://images.unsplash.com/photo-1548544149-4835e62ee5b3?q=80&w=2574&auto=format&fit=crop', caption: 'Easter Vigil', isPrimary: false },
        ],
        ChurchEvent: [
            { id: 'e1', title: 'Parish Picnic', startDate: new Date(Date.now() + 86400000 * 2).toISOString(), eventType: 'Community' },
            { id: 'e2', title: 'Bible Study: Gospel of John', startDate: new Date(Date.now() + 86400000 * 5).toISOString(), eventType: 'Education' },
            { id: 'e3', title: 'Young Adult Holy Hour', startDate: new Date(Date.now() + 86400000 * 7).toISOString(), eventType: 'Prayer' },
        ]
    };

    return (
        <div className="relative pb-24">
            {/* Demo Banner */}
            <div className="bg-amber-600 text-white text-center py-2 px-4 shadow-md sticky top-0 z-50">
                <span className="text-sm font-semibold flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    DEMO MODE: This is an example of a verified parish profile.
                </span>
            </div>

            <ChurchProfile church={demoChurch as any} />

            {/* Sales CTA Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-40 p-4 md:p-6 transition-transform translate-y-0">
                <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            Is your parish listed? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Claim your church profile for free to manage Mass times, update info, and connect with parishioners.
                        </p>
                    </div>
                    <Link
                        href="/churches?claim=true"
                        className="flex-shrink-0 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        Claim Your Church Free
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
