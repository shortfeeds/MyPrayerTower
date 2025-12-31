/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef5ff',
                    100: '#d9e8ff',
                    200: '#bcceef',
                    300: '#8eb0e6',
                    400: '#5a8ddf',
                    500: '#3366cc',
                    600: '#1e4eb8',
                    700: '#1a3d94',
                    800: '#173377',
                    900: '#0f2554',
                    950: '#0a1835',
                },
                // Sacred Navy - Primary dark color for trust and faith
                sacred: {
                    50: '#f0f4f9',
                    100: '#d9e2f0',
                    200: '#b8c9e3',
                    300: '#8ca7d1',
                    400: '#5f82bc',
                    500: '#1e3a5f',
                    600: '#1a3354',
                    700: '#152a47',
                    800: '#11223b',
                    900: '#0d1a2e',
                    950: '#080f1a',
                },
                gold: {
                    50: '#fffbf0',
                    100: '#fef5d6',
                    200: '#fce8ad',
                    300: '#fad575',
                    400: '#f8c044',
                    500: '#d4af37',
                    600: '#b8942c',
                    700: '#947223',
                    800: '#7a5c22',
                    900: '#654b22',
                    950: '#3a290e',
                },
                purple: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#6d28d9',
                    600: '#5b21b6',
                    700: '#4c1d95',
                    800: '#5b21b6',
                    900: '#4c1d95',
                    950: '#2e1065',
                },
                // Warm Cream - Peaceful background color
                cream: {
                    50: '#fdfbf7',
                    100: '#f8f5ed',
                    200: '#f5f2eb',
                    300: '#ebe7dc',
                },
                // Warm Brown - Earthly, grounded accent
                earth: {
                    500: '#8B4513',
                    600: '#7a3d10',
                    700: '#69350e',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                serif: ['Merriweather', 'Georgia', 'serif'],
                display: ['Playfair Display', 'Georgia', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'fade-in-up': 'fadeInUp 0.8s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'blob': 'blob 7s infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'scale-in': 'scaleIn 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)' },
                    '50%': { boxShadow: '0 0 30px rgba(212, 175, 55, 0.6)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
        },
    },
    plugins: [],
};
