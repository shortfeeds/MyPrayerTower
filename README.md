# MyPrayerTower

**The #1 All-in-One Catholic Services App**

Find Catholic churches worldwide, join a global prayer community, and grow in faith together.

[![Website](https://img.shields.io/badge/Website-myprayertower.com-blue)](https://myprayertower.com)
[![Play Store](https://img.shields.io/badge/Android-Play%20Store-green)](https://play.google.com/store/apps/details?id=com.myprayertower.app)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## ✨ What's New (January 2026)
- 🕊️ **Sanctuary Redesign** - A complete visual transformation for a more sacred, contemplative experience.
- 🕯️ **Global Candle Community** - **2,500+ active candles** now visible with country flags and real-time prayer counters.
- ⏳ **Stillness Moment** - A mindful pause after every prayer action to foster spiritual reflection.
- 💐 **Spiritual Bouquets** - Send curated bundles of prayers and masses to loved ones.
- ⛪ **Digital Chapels** - Create beautiful, lasting tributes in our renamed Memorials section.
- 💎 **Sacred Offerings** - Simplified, whole-number pricing for all contributions.
- 📱 **Prayer Corner** - A renamed and refocused dashboard for your spiritual journey.
- 🌍 **Localization** - Added country support to prayers and intentions.

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
| **Virtual Candles** | Light digital prayer candles with premium effects | ✅ NEW |
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
| **Country Identification** | Display country flag with user profile | ✅ NEW |
| **Prayer Groups** | Create and join prayer communities | ✅ |
| **Sacrament Records** | Track personal sacrament history | ✅ |
| **Order History** | Track Mass offerings and donations | ✅ |
| **Challenges** | Join spiritual challenges (Rosary, Novena, Lent) | ✅ NEW |
| **Leaderboards** | Community rankings by prayer activity | ✅ NEW |
| **Prayer Reminders** | Custom notifications for prayer times | ✅ NEW |
| **Year in Review** | Annual prayer statistics summary | ✅ NEW |
| **Abandoned Cart** | Auto-recovery for incomplete offerings | ✅ NEW |

### 🕯️ Spiritual Gifts & Memorials
| Feature | Description | Status |
|---------|-------------|--------|
| **Virtual Candles** | 5 Tiers (1-30 days) with premium visuals | ✅ NEW |
| **Spiritual Bouquets** | Gift prayer collections to loved ones | ✅ NEW |
| **Mass Offerings** | Request Masses with simplified donation tiers | ✅ |
| **Digital Chapels** | Permanent memorial tributes (formerly Memorial Pages) | ✅ NEW |
| **Prayer Certificates** | Digital Mass cards for gifts | ✅ |
| **Admin Panel** | Manage offerings, tributes, and abandoned carts | ✅ NEW |

### 💳 Payments & Subscriptions
| Feature | Description | Status |
|---------|-------------|--------|
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
| **Offline Mode** | Use without internet | ✅ NEW |

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

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AZ3c6O0DJtvSCjr7LTBRSgugVnLfCJSZmIeB27xEFsgslNkjTu7wR92V1E-K2luCnN4ZIAreeCvx1-Fc
PAYPAL_CLIENT_SECRET=EHK0ebHCK7vtCuOOznhuoEupHi1rmB3weFoDdnkLbpnm_h7bzjEVhLyUmzSXiub2r-jgCAlGqmnPw9xj
PAYPAL_ENVIRONMENT=live  # or "live" for production


# AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-1009360672921924"
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
- ✅ **Secure Data Persistence**: All user interactions (payments, prayers, contact forms) are safely stored in our database.
- ✅ **Server-Side Validation**: Critical actions are validated securely on the server to prevent data loss or manipulation.

---

## 💎 Pricing & Plans

### 🕯️ Virtual Candles
Light a candle on the global prayer wall. Higher tiers offer extended visibility and premium visual effects.

| Duration | Tier | Price | Features |
|:---------|:-----|:------|:---------|
| **1 Day** | **Humble Prayer** | Free | Basic white candle, visible for 24 hours |
| **3 Days** | **Devotion Votive** | $2.49 | 3-day visibility, red glow effect |
| **7 Days** | **Sacred Altar** | $4.99 | 1-week visibility, amber altar glow |
| **14 Days** | **Blessed Marian** | $9.99 | 2-week visibility, blue Marian aura, **Premium Animation** |
| **30 Days** | **Divine Cathedral** | $14.99 | 1-month visibility, gold divine radiance, **Sparkle Effects**, **Top Placement** |

### ⛪ Mass Offerings
Request Holy Mass to be offered for your specific intentions.
| Type | Price | Description |
|:-----|:------|:------------|
| **Single Mass** | $10.00 | One Mass offered for your intention |
| **Novena** | $75.00 | 9 consecutive Masses (Great for urgent needs) |
| **Perpetual** | $100.00 | Enrollment in daily Masses forever (Best Value) |
| **Gregorian** | $200.00 | 30 consecutive Masses for a deceased soul |

**Add-ons:**
- 🕯️ **Virtual Candle**: +$5.00 (7-day candle added to request)
- 📮 **Printed Card**: +$10.00 (Mailed to you or recipient)
- 🖼️ **Framed Certificate**: +$35.00 (Premium framed enrollment)

### 🕊️ Memorial Tributes
Create a lasting digital memorial for a departed loved one.
| Plan | Price | Features |
|:-----|:------|:---------|
| **Basic** | **FREE** | Permanent page, 1 photo, biography, guestbook |
| **Premium** | $49.99 | All Basic + Unlimited photos, Music, Video tribute, "Featured" placement, QR Code |

### 💳 Monthly Subscriptions
Support the platform and unlock exclusive spiritual benefits.
| Plan | Price | Benefits |
|:-----|:------|:---------|
| **Prayer Partner** | $9.99/mo | 1 Mass/mo, Name on Daily Prayer List, Newsletter |
| **Family Plan** | $19.99/mo | 3 Masses/mo, Entire family on Prayer List, Priority Requests |
| **Patron Circle** | $49.99/mo | Unlimited requests, Perpetual Enrollment, VIP Support |

### 💝 One-Time Donations
Support the mission with a single contribution.
- **Light a Candle**: $10
- **Rosary Partner**: $20
- **Parish Supporter**: $50
- **Guardian Angel**: $100
- **Benefactor**: $250
- **Patron**: $500

---

## 📞 Support

- **Email**: support@myprayertower.com
- **Website**: https://myprayertower.com/contact

---

## 🔍 Website Audit Report (January 2026)

### ✅ Connectivity & Structure

| Component | Status | Details |
|-----------|--------|---------|
| **Page Routes** | ✅ 74+ routes | All major sections have dedicated pages |
| **API Endpoints** | ✅ 33 directories | Auth, Payments, Memorials, Candles, Webhooks, etc. |
| **Navigation** | ✅ Functional | Header (5 dropdowns), Footer (20+ links), Mobile nav |
| **Sitemap** | ✅ 45+ URLs | Dynamic sitemap.ts with all public routes |
| **SEO Metadata** | ✅ Complete | OpenGraph, Twitter Cards, JSON-LD Schema |
| **PWA Manifest** | ✅ Configured | manifest.ts for Add-to-Home-Screen |

### 📝 Pages Verified

#### Core Pages
- `/` - Homepage (Smart layout with Daily Journey, Trending, Stats, Testimonials)
- `/about` - About page
- `/contact` - Contact form
- `/login` / `/register` - Authentication

#### Prayer & Devotionals
- `/prayers` - Prayer library (4,000+ prayers)
- `/rosary` - Interactive rosary guide
- `/novenas`, `/chaplets`, `/stations` - Devotional content
- `/prayer-wall` - Community prayer intentions
- `/examen` - Daily Examen

#### Readings & Resources
- `/bible` - Full Bible reader
- `/readings` - Daily Mass readings
- `/saints` - Saints database
- `/catechism` - Catechism reference
- `/calendar` - Liturgical calendar

#### Revenue Features
- `/candles` - Virtual candle lighting ($0-$15)
- `/mass-offerings` - Mass intention requests
- `/memorials` - Memorial pages (Free & $49.99)
- `/donate` - One-time and recurring donations
- `/bouquets` - Spiritual bouquet gifts

#### Legal & Compliance
- `/privacy`, `/terms`, `/cookies` - Policy pages
- `/refunds` - Refund policy
- `/dmca` - DMCA compliance

### 🔌 API Endpoints Verified

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `/api/auth/login` | User authentication | ✅ |
| `/api/payments/verify` | Payment verification | ✅ |
| `/api/webhooks/cashfree` | Payment webhooks | ✅ |
| `/api/candles/*` | Virtual candle operations | ✅ |
| `/api/memorials/*` | Memorial CRUD | ✅ |
| `/api/donations/*` | Donation processing | ✅ |
| `/api/saints/*` | Saints data | ✅ |
| `/api/readings/*` | Daily readings | ✅ |

### 🎨 UI/UX Review

| Element | Status | Notes |
|---------|--------|-------|
| **Homepage Hero** | ✅ | Gradient backgrounds, particle effects |
| **Daily Journey Widget** | ✅ NEW | 3-step habit loop |
| **Trending Prayers Carousel** | ✅ NEW | Abstract gradient cards (no images) |
| **Statistics Band** | ✅ | Live counters with realistic numbers |
| **Sacred Moments** | ✅ NEW | Full-width premium cards |
| **Testimonials** | ✅ NEW | Masonry grid with verified badges |
| **Dark Mode** | ✅ | System-aware with toggle |
| **Mobile Responsive** | ✅ | All pages tested |

### ⚠️ Known Issues & Recommendations

| Issue | Severity | Recommendation |
|-------|----------|----------------|
| Database sync | Medium | Run `npx prisma db push --schema=../../packages/database/prisma/schema.prisma` before deploy |
| Admin setup | Info | Temporary `/api/setup-admin` route should be deleted after initial setup |
| Sitemap growth | Low | Consider adding dynamic routes for saints, prayers, churches |

### 🚀 Deployment Checklist

- [x] All pages load without errors
- [x] Navigation links functional
- [x] SEO metadata complete
- [x] Sitemap covers 45+ routes
- [x] Payment webhooks configured
- [x] Social sharing images working
- [x] PWA manifest ready
- [x] Google Search Console verified (HTML file + HTML tag)
- [x] AdSense configured (ca-pub-1009360672921924)
- [x] Google Analytics configured (G-1X6N63VWZH)

---

## 📃 License

Copyright © 2026 MyPrayerTower. All rights reserved.