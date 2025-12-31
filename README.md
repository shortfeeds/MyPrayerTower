# MyPrayerTower

**The #1 All-in-One Catholic Services App**

Find Catholic churches worldwide, join a global prayer community, and grow in faith together.

[![Website](https://img.shields.io/badge/Website-myprayertower.com-blue)](https://myprayertower.com)
[![Play Store](https://img.shields.io/badge/Android-Play%20Store-green)](https://play.google.com/store/apps/details?id=com.myprayertower.app)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## 📋 Features

### 🏛️ Core Features
| Feature | Description | Status |
|---------|-------------|--------|
| **Church Finder** | 10,000+ churches with Mass times, directions, and contact info | ✅ |
| **Prayer Wall** | Share intentions and pray for others worldwide | ✅ |
| **Prayer Library** | 2,000+ traditional and contemporary prayers | ✅ |
| **Rosary Guide** | Interactive rosary with all mysteries | ✅ |
| **Daily Readings** | USCCB daily Mass readings | ✅ |
| **Saint of the Day** | Learn about saints throughout the year | ✅ |
| **Confession Guide** | Examination of conscience tool | ✅ |
| **Bible Reader** | Full Bible with chapter navigation | ✅ |

### 📖 Faith Resources
| Feature | Description | Status |
|---------|-------------|--------|
| **Catechism** | Full Catechism of the Catholic Church | ✅ |
| **Stations of the Cross** | 14 Stations devotional guide | ✅ |
| **Novenas** | Popular novena prayers | ✅ |
| **Chaplets** | Divine Mercy and other chaplets | ✅ |
| **Hymns** | Catholic hymn library | ✅ |
| **Gregorian Chant** | Traditional chant resources | ✅ |
| **Liturgical Calendar** | Feast days and observances | ✅ |
| **Fasting Guide** | Fasting and abstinence rules | ✅ |
| **Encyclicals** | Papal documents | ✅ |
| **Vatican II Documents** | Council documents | ✅ |
| **Summa Theologica** | St. Thomas Aquinas reference | ✅ |
| **Canon Law** | Church law reference | ✅ |

### 👤 User Features
| Feature | Description | Status |
|---------|-------------|--------|
| **User Dashboard** | Personal prayer stats and saved content | ✅ |
| **Prayer Streaks** | Gamification with streak tracking | ✅ |
| **Badges & Achievements** | 12+ badges for prayer milestones | ✅ |
| **Prayer Groups** | Create and join prayer communities | ✅ |
| **Sacrament Records** | Track personal sacrament history | ✅ |
| **Order History** | Track Mass offerings and donations | ✅ |

### 💳 Payments & Donations (Cashfree)
| Feature | Description | Status |
|---------|-------------|--------|
| **Mass Offerings** | Request Masses for intentions | ✅ |
| **Platform Donations** | One-time and recurring donations | ✅ |
| **Prayer Subscriptions** | Monthly subscription plans | ✅ |
| **International Payments** | USD support via Cashfree | ✅ |

### 🏢 For Churches (B2B)
| Feature | Description | Status |
|---------|-------------|--------|
| **Church Claiming** | 3-step verification to claim listing | ✅ |
| **Church Dashboard** | Manage church information | ✅ |
| **Event Management** | Post parish events | ✅ |
| **Announcements** | Push notifications to followers | ✅ |
| **Analytics** | View engagement stats | ✅ |

### 🛠️ Platform Features
| Feature | Description | Status |
|---------|-------------|--------|
| **Dark Mode** | System-aware theme with toggle | ✅ |
| **PWA Support** | Install on any device | ✅ |
| **Push Notifications** | Prayer reminders | ✅ |
| **Dynamic Sitemap** | Auto-generated for SEO | ✅ |
| **Social Sharing** | OG images for prayers | ✅ |
| **Vercel Analytics** | Performance monitoring | ✅ |
| **Speed Insights** | Core Web Vitals tracking | ✅ |

### 📰 Content
| Feature | Description | Status |
|---------|-------------|--------|
| **Catholic News** | Aggregated Catholic news feed | ✅ |
| **Pilgrimages** | Holy site information | ✅ |
| **Podcasts** | Catholic podcast directory | ✅ |
| **Catholic Art** | Sacred art gallery | ✅ |
| **Glossary** | Catholic terminology | ✅ |
| **Quiz** | Faith knowledge quizzes | ✅ |

---

## 🏗️ Project Structure

```
myprayertower/
├── apps/
│   ├── web/          # Next.js 14 Website (Main)
│   ├── admin/        # React Admin Panel (Vite)
│   ├── mobile/       # Expo React Native App
│   ├── api/          # NestJS Backend (Optional)
│   └── scraper/      # GCatholic Data Scraper
├── packages/
│   └── database/     # Prisma Schema & Migrations
├── vercel.json       # Vercel deployment config
└── turbo.json        # Turborepo config
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 16+ (or Supabase)

### Installation

```bash
# Clone repository
git clone https://github.com/shortfeeds/MyPrayerTower.git
cd MyPrayerTower

# Install dependencies
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local

# Start development
pnpm --filter @mpt/web dev
```

### Environment Variables

```bash
# Database (Required)
DATABASE_URL="postgresql://user:pass@localhost:5432/myprayertower"

# Cashfree Payments (Required for payments)
CASHFREE_CLIENT_ID="your_app_id"
CASHFREE_CLIENT_SECRET="your_secret_key"
CASHFREE_ENVIRONMENT="sandbox"  # or "production"

# AdSense (Optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"
```

---

## 📱 Mobile App (Android)

The Android app is built using Expo React Native.

### Automatic Content Updates
✅ Website data updates automatically sync to the app!

### Building for Production

```bash
cd apps/mobile
eas build --platform android --profile production
```

---

## 🌐 Deployment

### Vercel (Recommended)

The `vercel.json` is pre-configured to build only `apps/web`:

```json
{
    "buildCommand": "cd apps/web && pnpm run build",
    "outputDirectory": "apps/web/.next",
    "framework": "nextjs"
}
```

### Cashfree Webhook URL
```
https://myprayertower.com/api/webhooks/cashfree
```

---

## 📄 Legal Pages

| Page | URL |
|------|-----|
| Privacy Policy | `/privacy` |
| Terms of Service | `/terms` |
| Cookie Policy | `/cookies` |
| Community Guidelines | `/guidelines` |
| DMCA Policy | `/dmca` |

---

## 🔒 Security

- ✅ JWT authentication with refresh tokens
- ✅ Cashfree webhook signature verification
- ✅ Prayer request moderation
- ✅ Church 3-step verification
- ✅ GDPR/CCPA compliant
- ✅ SSL/TLS encryption

---

## 📞 Support

- **Email**: support@myprayertower.com
- **Website**: https://myprayertower.com/contact

---

## 📃 License

Copyright © 2025 MyPrayerTower. All rights reserved.