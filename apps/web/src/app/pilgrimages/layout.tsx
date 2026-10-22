import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Virtual Catholic Pilgrimages & Virtual Passport | 360° Holy Sites | MyPrayerTower',
    description: 'Embark on virtual spiritual pilgrimages to the world\'s most sacred Catholic shrines: Jerusalem (Church of the Holy Sepulchre), Lourdes, Fátima, Santiago de Compostela, and Rome. Stamp your virtual passport and explore 360° tours.',
    alternates: {
        canonical: 'https://www.myprayertower.com/pilgrimages',
    },
    openGraph: {
        title: 'Virtual Catholic Pilgrimages & Virtual Passport | MyPrayerTower',
        description: 'Take 360° virtual tours of Jerusalem, Lourdes, Fátima, Santiago, and the Vatican. Stamp your virtual pilgrimage passport.',
        url: 'https://www.myprayertower.com/pilgrimages',
        siteName: 'MyPrayerTower',
        images: [
            {
                url: 'https://www.myprayertower.com/images/churches/st-peters-basilica.jpg',
                width: 1200,
                height: 800,
                alt: 'St. Peter\'s Basilica - Virtual Catholic Pilgrimages',
            },
        ],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Virtual Catholic Pilgrimages & Virtual Passport',
        description: 'Explore 360° virtual tours of holy Catholic shrines worldwide.',
        images: ['https://www.myprayertower.com/images/churches/st-peters-basilica.jpg'],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Virtual Catholic Pilgrimages & Virtual Passport',
    description: 'Explore 360° virtual tours of holy Catholic pilgrimage sites worldwide.',
    url: 'https://www.myprayertower.com/pilgrimages',
    hasPart: [
        {
            '@type': 'TouristDestination',
            name: 'Vatican City & St. Peter\'s Basilica',
            touristType: 'Religious / Pilgrimage',
            description: 'The heart of Catholicism, home to the Pope and the tomb of St. Peter.',
            image: 'https://www.myprayertower.com/images/churches/st-peters-basilica.jpg',
        },
        {
            '@type': 'TouristDestination',
            name: 'Holy Land - Jerusalem',
            touristType: 'Religious / Pilgrimage',
            description: 'Walk where Jesus walked. Visit the Church of the Holy Sepulchre and Via Dolorosa.',
            image: 'https://www.myprayertower.com/images/pilgrimages/holy-land.jpg',
        },
        {
            '@type': 'TouristDestination',
            name: 'Sanctuary of Our Lady of Lourdes',
            touristType: 'Religious / Marian Shrine',
            description: 'Where Our Lady appeared to St. Bernadette. A world-famous place of deep healing.',
            image: 'https://www.myprayertower.com/images/pilgrimages/lourdes.jpg',
        },
        {
            '@type': 'TouristDestination',
            name: 'Sanctuary of Fátima',
            touristType: 'Religious / Marian Shrine',
            description: 'Site of the 1917 Marian apparitions and the Miracle of the Sun in Portugal.',
            image: 'https://www.myprayertower.com/images/pilgrimages/fatima.jpg',
        },
        {
            '@type': 'TouristDestination',
            name: 'Santiago de Compostela',
            touristType: 'Religious / Pilgrimage Route',
            description: 'End point of the Camino de Santiago pilgrimage and burial site of St. James the Apostle.',
            image: 'https://www.myprayertower.com/images/pilgrimages/santiago.jpg',
        },
    ],
};

export default function PilgrimagesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
