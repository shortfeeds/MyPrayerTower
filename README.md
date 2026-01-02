# MyPrayerTower

**The #1 All-in-One Catholic Services App**

Find Catholic churches worldwide, join a global prayer community, and grow in faith together.

[![Website](https://img.shields.io/badge/Website-myprayertower.com-blue)](https://myprayertower.com)
[![Play Store](https://img.shields.io/badge/Android-Play%20Store-green)](https://play.google.com/store/apps/details?id=com.myprayertower.app)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## ✨ What's New (January 2026)

- 🕯️ **Virtual Candles** - Light digital prayer candles for intentions
- 🏆 **Challenges & Leaderboards** - Join spiritual challenges and track progress
- 💳 **Google Play Billing** - In-app subscriptions on Android
- 🌸 **Spiritual Bouquets** - Send digital prayer bouquets as gifts
- 📿 **Daily Examen** - Guided examination of conscience
- 🔔 **Prayer Reminders** - Custom notifications for prayer times
- 🎨 **Wallpapers** - Catholic-themed phone wallpapers
- 📊 **Year in Review** - Annual prayer statistics summary

---

## 📋 Features

### 🏛️ Core Features
| Feature | Description | Status |
|---------|-------------|--------|
| **Church Finder** | 10,000+ churches with Mass times, directions, and contact info | ✅ |
| **Prayer Wall** | Share intentions and pray for others worldwide | ✅ |
| **Prayer Library** | 4,000+ traditional and contemporary prayers | ✅ |
| **Rosary Guide** | Interactive rosary with all mysteries | ✅ |
| **Daily Readings** | USCCB daily Mass readings | ✅ |
| **Saint of the Day** | Learn about saints throughout the year | ✅ |
| **Confession Guide** | Examination of conscience tool | ✅ |
| **Bible Reader** | Full Bible with chapter navigation | ✅ |
| **Virtual Candles** | Light digital prayer candles for intentions | ✅ NEW |
| **Daily Examen** | Guided examination of conscience | ✅ NEW |

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
| **Challenges** | Join spiritual challenges (Rosary, Novena, Lent) | ✅ NEW |
| **Leaderboards** | Community rankings by prayer activity | ✅ NEW |
| **Prayer Reminders** | Custom notifications for prayer times | ✅ NEW |
| **Year in Review** | Annual prayer statistics summary | ✅ NEW |

### 🕯️ Spiritual Gifts
| Feature | Description | Status |
|---------|-------------|--------|
| **Virtual Candles** | 1-30 day digital prayer candles ($0-$15) | ✅ NEW |
| **Spiritual Bouquets** | Gift prayer collections to loved ones | ✅ NEW |
| **Mass Offerings** | Request Masses for intentions | ✅ |
| **Prayer Certificates** | Digital Mass cards for gifts | ✅ |

### 💳 Payments & Subscriptions
| Feature | Description | Status |
|---------|-------------|--------|
| **Free Tier** | Basic features with ads | ✅ |
| **Plus Subscription** | $4.99/mo - Ad-free, offline mode, 2 family members | ✅ |
| **Premium Subscription** | $9.99/mo - All Plus + AI suggestions, 5 family members | ✅ |
| **Lifetime Access** | $149.99 - All features forever | ✅ |
| **Google Play Billing** | In-app purchases on Android | ✅ NEW |
| **Cashfree (Web)** | Web payments via Cashfree | ✅ |
| **Mass Offerings** | Request Masses for intentions | ✅ |
| **Platform Donations** | One-time and recurring donations | ✅ |

### 🏢 For Churches (B2B)
| Feature | Description | Status |
|---------|-------------|--------|
| **Church Claiming** | 3-step verification to claim listing | ✅ |
| **Church Dashboard** | Manage church information | ✅ |
| **Event Management** | Post parish events | ✅ |
| **Announcements** | Push notifications to followers | ✅ |
| **Analytics** | View engagement stats | ✅ |
| **B2B Plans** | Basic ($99), Pro ($249), Cathedral ($499), Diocese ($2,499) | ✅ |

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
| **Offline Mode** | Use without internet (Premium) | ✅ NEW |

### 📰 Content
| Feature | Description | Status |
|---------|-------------|--------|
| **Catholic News** | Aggregated Catholic news feed | ✅ |
| **Pilgrimages** | Holy site information | ✅ |
| **Podcasts** | Catholic podcast directory | ✅ |
| **Catholic Art** | Sacred art gallery | ✅ |
| **Glossary** | Catholic terminology | ✅ |
| **Quiz** | Faith knowledge quizzes | ✅ |
| **Wallpapers** | Catholic-themed phone wallpapers | ✅ NEW |

---

## 🏗️ Project Structure

```
myprayertower/
├── apps/
│   ├── web/          # Next.js 14 Website (Main)
│   ├── admin/        # React Admin Panel (Vite)
│   ├── mobile/       # Expo React Native App
│   ├── api/          # NestJS Backend
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

# Cashfree Payments (Required for web payments)
CASHFREE_APP_ID="your_app_id"
CASHFREE_SECRET_KEY="your_secret_key"
CASHFREE_ENVIRONMENT="sandbox"  # or "production"

# Google Play Billing (Required for Android)
ANDROID_PACKAGE_NAME="com.myprayertower.app"
GOOGLE_PLAY_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_PLAY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AdSense (Optional)
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"
```

---

## 📱 Mobile App (Android)

The Android app is built using Expo React Native with Google Play Billing.

### Features
- ✅ All prayer and devotional content
- ✅ In-app subscriptions via Google Play
- ✅ Push notifications for reminders
- ✅ Offline mode (Premium)
- ✅ Virtual candle lighting

### Building for Production

```bash
cd apps/mobile

# Install dependencies
npm install

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production
```

### Building Locally (APK)

```bash
cd apps/mobile
npx expo prebuild
cd android
./gradlew assembleRelease
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

### Webhook URLs
```
Cashfree: https://myprayertower.com/api/webhooks/cashfree
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
- ✅ Google Play purchase verification
- ✅ Prayer request moderation
- ✅ Church 3-step verification
- ✅ GDPR/CCPA compliant
- ✅ SSL/TLS encryption

---

## 💳 Subscription Tiers

| Tier | Price | Features |
|------|-------|----------|
| **Free** | $0 | Basic prayers, ads supported, 14-day premium trial |
| **Plus** | $4.99/mo or $39.99/yr | Ad-free, offline mode, audio prayers, 2 family members |
| **Premium** | $9.99/mo or $79.99/yr | All Plus + AI suggestions, 5 family members, priority support |
| **Lifetime** | $149.99 (one-time) | All Premium features forever |

---

## 📞 Support

- **Email**: support@myprayertower.com
- **Website**: https://myprayertower.com/contact

---

## 📃 License

Copyright © 2025-2026 MyPrayerTower. All rights reserved.