<p align="center">
  <img src="apps/web/public/icon.png" alt="MyPrayerTower Logo" width="100" height="100" style="border-radius: 20px;" />
</p>

<h1 align="center">MyPrayerTower</h1>

<p align="center">
  <strong>The #1 All-in-One Catholic Services Platform</strong><br/>
  A global digital sanctuary connecting the faithful through prayer, devotion, and community.
</p>

<p align="center">
  <a href="https://myprayertower.com"><img src="https://img.shields.io/badge/Website-myprayertower.com-blue?style=for-the-badge" /></a>
  <a href="https://play.google.com/store/apps/details?id=com.myprayertower.myprayertower_app"><img src="https://img.shields.io/badge/Android-Play%20Store-green?style=for-the-badge&logo=google-play" /></a>
  <a href="https://t.me/MyPrayerTowerBot"><img src="https://img.shields.io/badge/Bot-Telegram-blue?style=for-the-badge&logo=telegram" /></a>
  <a href="#"><img src="https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge" /></a>
</p>

<p align="center">
  <a href="https://www.facebook.com/myprayertower">Facebook</a> •
  <a href="https://www.youtube.com/@myprayertower">YouTube</a> •
  <a href="https://twitter.com/MyPrayerTower">X (Twitter)</a> •
  <a href="https://www.instagram.com/myprayertower/">Instagram</a> •
  <a href="https://www.threads.net/@myprayertower">Threads</a> •
  <a href="https://www.pinterest.com/myprayertower/">Pinterest</a>
</p>

---

## ✨ What's New (April 2026)

- 🕯️ **Bulk Candle Lighting** — Light up to 10 candles per offering with shared or unique prayer intentions.
- 🏮 **Multi-Intention Support** — Toggle between a single shared intention or distinct prayers for each candle.
- 📺 **Watch & Pray Hub** — Full YouTube integration with categorized sections (Shorts, Rosary, Novenas, Hymns, Podcasts, Bible Study).
- 💐 **Spiritual Bouquets** — Send curated bundles of prayers and masses to loved ones.
- ⛪ **Eternal Memorials** — Create beautiful, lasting digital tributes with candles, flowers, and guestbooks.
- 🤖 **Telegram Bot Integration** — Daily prayers and community engagement via `@MyPrayerTowerBot`.
- 🌍 **Global Localization** — Google Translate integration + country identification for prayers and candles.
- 📱 **Android TWA App** — Production app available on Google Play Store.
- 💰 **Ad Monetization** — Smart AdSense integration with per-page placement controls.

---

## 📋 Table of Contents

- [Services & Features](#-services--features)
  - [Prayer & Devotion](#-prayer--devotion)
  - [Spiritual Gifts & Offerings](#-spiritual-gifts--offerings)
  - [Remembrance & Memorials](#-remembrance--memorials)
  - [Faith Knowledge Base](#-faith-knowledge-base)
  - [Church Finder & B2B](#-church-finder--b2b)
  - [Community & Engagement](#-community--engagement)
  - [Media & Content](#-media--content)
  - [User Dashboard](#-user-dashboard)
  - [Admin Panel](#-admin-panel)
  - [Platform & Technical](#-platform--technical)
- [Architecture](#-architecture)
- [Pricing](#-pricing)
- [API Endpoints](#-api-endpoints)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [Legal](#-legal)

---

## 🙏 Services & Features

### ✝️ Prayer & Devotion

| Service | Route | Description |
|---------|-------|-------------|
| **Prayer Wall** | `/prayer-wall` | A global community board where users share prayer intentions and pray for each other. Real-time prayer counts with country flags. |
| **Prayer Library** | `/prayers` | Treasury of **4,000+ prayers** organized by category — Morning, Evening, Marian, Saints, Sacraments, and more. Each prayer has its own SEO-optimized page. |
| **Holy Rosary** | `/prayers/rosary` | An interactive, guided Rosary experience with all four sets of mysteries (Joyful, Sorrowful, Glorious, Luminous). |
| **Divine Mercy Chaplet** | `/prayers/divine-mercy` | A digital devotion guide for the Chaplet of Divine Mercy. |
| **Novenas** | `/novenas` | A curated collection of popular 9-day prayer novenas (e.g., St. Jude, Sacred Heart, Our Lady of Perpetual Help). |
| **Novena Tracker** | `/novena-tracker` | Personal tracker to follow along with ongoing novena commitments day by day. |
| **Chaplets** | `/chaplets` | Guides for various Catholic chaplets beyond Divine Mercy. |
| **Stations of the Cross** | `/stations` | A full 14-Station devotional guide for the Way of the Cross. |
| **Daily Readings** | `/readings` | USCCB daily Mass readings (First Reading, Psalm, Gospel) served fresh each day. |
| **Daily Examen** | `/examen` | An interactive Ignatian Examination of Conscience tool with 4 reflection prompts (Gratitude, Review, Sorrow, Tomorrow). Entries are saved to the user's history and contribute to prayer streaks. |
| **Confession Guide** | `/confession` | An examination of conscience tool to help prepare for the Sacrament of Reconciliation. Users can log confession dates and linked churches. |
| **Liturgy of the Hours** | `/divine-office` | Access to the Divine Office / Liturgy of the Hours. |
| **Focus Mode** | `/focus-mode` | A distraction-free prayer environment for deep devotion. |
| **Liturgical Calendar** | `/calendar` | A full calendar of feasts, solemnities, memorials, and liturgical seasons with proper liturgical colors. |
| **Fasting Guide** | `/fasting` | Guidelines for Catholic fasting and abstinence rules by season. |

---

### 🕯️ Spiritual Gifts & Offerings

| Service | Route | Description |
|---------|-------|-------------|
| **Virtual Candles** | `/candles` | Light digital prayer candles across 5 tiers (1–30 days). Features include bulk lighting (1–10 candles), shared or unique intentions, animated flame effects, country flags, and real-time prayer counts from the community. |
| **Mass Offerings** | `/mass-offerings` | Request Holy Mass to be offered for a specific intention. Supports Single Mass, Novena (9 Masses), Perpetual Enrollment, and Gregorian (30 consecutive Masses). |
| **Spiritual Bouquets** | `/bouquets` | Send a curated gift bundle of prayers, Masses, and devotions to loved ones for special occasions. |
| **Contributions** | `/contributions` | Support the platform's mission through one-time or recurring donations with named tiers (Light a Candle $10 → Patron $500). |
| **Campaigns** | `/campaigns` | Participate in urgent Catholic charitable causes and fundraising efforts. |

---

### 🕊️ Remembrance & Memorials

| Service | Route | Description |
|---------|-------|-------------|
| **Eternal Memorials** | `/memorials` | Create permanent digital memorial pages for departed loved ones. Features biography, photo gallery, guestbook, candle lighting, and flower placement. Free Basic tier and Premium ($49.99) with video tributes and featured placement. |
| **Create Memorial** | `/memorials/create` | Guided wizard to set up a new memorial page with personal details, photos, and biography. |
| **Anniversaries** | `/anniversaries` | Track and commemorate sacred dates (death anniversaries, baptisms, etc.) with automated email reminders via cron job. |
| **Memorial Candles** | `/candles` | Light specific candles linked to memorial pages as acts of remembrance. |

---

### 📖 Faith Knowledge Base

| Service | Route | Description |
|---------|-------|-------------|
| **Holy Bible** | `/bible` | Full Bible reader with chapter-by-chapter navigation. |
| **Catechism** | `/catechism` | Complete Catechism of the Catholic Church, searchable and browsable. |
| **Saints Database** | `/saints` | Comprehensive database of Catholic saints with feast days, biographies, and patronages. Dynamically generated individual saint pages (`/saints/[slug]`). |
| **Summa Theologica** | `/summa` | Reference for St. Thomas Aquinas' masterwork. |
| **Papal Encyclicals** | `/encyclicals` | Collection of papal encyclical letters. |
| **Vatican II Documents** | `/vatican-ii` | Full texts of the Second Vatican Council documents. |
| **Canon Law** | `/canon-law` | Reference for the Code of Canon Law. |
| **Catholic Glossary** | `/glossary` | Comprehensive glossary of Catholic terminology and definitions. |
| **Church History** | `/history` | 2,000 years of Catholic Church history. |
| **Church Hierarchy** | `/hierarchy` | Visual guide to the organizational structure of the Catholic Church. |
| **Sacraments** | `/sacraments` | Educational guide to the seven Catholic Sacraments. |
| **Sacred Art** | `/art` | A visual meditation gallery of Catholic sacred art. |
| **Gregorian Chant** | `/chant` | Library of traditional Gregorian chant audio and resources. |
| **Hymns** | `/hymns` | Catholic hymn library for worship. |
| **Blog** | `/blog` | Faith-based articles, reflections, and liturgical content. Dynamically generated from MDX files. |
| **Guides** | `/guides` | Master guides for Catholic living (how-to articles, deep dives). SEO-optimized hub. |
| **Catholic Life** | `/catholic-life` | Lifestyle content hub for practical Catholic living. |
| **How-To** | `/how-to` | Step-by-step guides for Catholic practices (e.g., how to pray the Rosary). |

---

### ⛪ Church Finder & B2B

| Service | Route | Description |
|---------|-------|-------------|
| **Church Finder** | `/churches` | Search and discover **20,000+ Catholic churches** worldwide with Mass times, directions, contact info, and parish details. Each church has a dedicated page (`/churches/[slug]`). |
| **Mass Times** | `/mass-times` | Find nearby Mass schedules. |
| **Dioceses** | `/dioceses` | Directory of Catholic dioceses with geographic jurisdiction info. |
| **Church Claiming** | `/claim` | 3-step verification process for parish administrators to claim and manage their church listing. |
| **Church Dashboard** | `/church-dashboard` | Management panel for claimed churches — update schedules, post announcements, manage events. |
| **For Churches (B2B)** | `/for-churches` | Pricing page for church management plans with 3 tiers (Basic $99, Pro $249, Cathedral $499) plus Diocese License ($2,499). One-time payment, no subscription. |
| **Live Mass** | `/live-mass` | Directory of live-streamed Mass services. |
| **Pilgrimages** | `/pilgrimages` | Information about Catholic pilgrimage sites and holy destinations. |

---

### 👥 Community & Engagement

| Service | Route | Description |
|---------|-------|-------------|
| **Prayer Groups** | `/groups` | Create and join themed prayer communities for shared devotion. |
| **Prayer Partners** | `/prayer-partners` | Connect with other faithful for paired prayer commitments. |
| **Challenges** | `/challenges` | Participate in spiritual challenges (e.g., Rosary Marathon, Lenten Fast, Novena Challenge). |
| **Leaderboard** | `/leaderboard` | Gamified rankings based on prayer streaks, badges, and community contributions. |
| **Achievements** | `/achievements` | Unlock 12+ badges for prayer milestones (First Rosary, 7-Day Streak, 100 Prayers, etc.). |
| **Testimonies** | `/testimonies` | Share and read faith testimonies from the community. |
| **Newsletter** | Footer form | Email newsletter subscription for daily spiritual nourishment. Powered by `/api/newsletter`. |
| **Quiz** | `/quiz` | Interactive faith knowledge quizzes to test and grow your understanding. |
| **Year in Review** | `/year-in-review` | Personal spiritual year-in-review summary. |
| **Telegram Bot** | `@MyPrayerTowerBot` | Daily prayers, readings, and spiritual content delivered via Telegram. Mini-app dashboard at `/bot`. |

---

### 📺 Media & Content

| Service | Route | Description |
|---------|-------|-------------|
| **Watch & Pray** | `/watch` | Full YouTube integration hub with organized sections: |
| | | — **Viral Shorts**: Quick vertical prayers and bitesize motivation |
| | | — **Holy Rosary**: Guided Rosary mystery meditations |
| | | — **Novenas & Prayers**: 9-day devotion video series |
| | | — **Catholic Hymns**: Sacred worship music |
| | | — **The Podcast (EN)**: In-depth spiritual conversations |
| | | — **El Podcast (ES)**: Spanish-language faith episodes |
| | | — **Lenten Prayers**: Seasonal meditation content |
| | | — **Bible Study: Genesis**: Book-by-book teaching series |
| **Catholic News** | `/news` | Aggregated Catholic news feed. |
| **Podcasts** | `/podcasts` | Podcast directory and listening hub. |
| **Reading Plans** | `/reading-plans` | Structured Bible or devotional reading plans. |

---

### 🏠 User Dashboard

| Feature | Route | Description |
|---------|-------|-------------|
| **My Prayer Corner** | `/journey` | Personalized spiritual dashboard with daily focus, streak tracking, and recent activity. |
| **Personalized Home** | `/` (logged in) | When authenticated, the homepage transforms into a personalized spiritual feed. |
| **Profile** | `/profile` | User profile with prayer stats, badges, country flag, and sacrament history. |
| **Prayer Streaks** | Dashboard | Consecutive-day prayer tracking with visual streak counters. |
| **Sacrament Records** | Dashboard | Track personal sacrament history (Baptism, Confirmation, Marriage, etc.). |
| **Confession Logs** | Dashboard | Private log of confession dates with optional church and notes. |
| **Examen History** | Dashboard | Browse your last 30 Daily Examen entries. |
| **Journal** | `/journal` | Private spiritual journaling space. |
| **Order History** | Dashboard | Track Mass offerings, candle purchases, and donation receipts. |
| **Settings** | `/settings` | Account settings, notification preferences, and privacy controls. |

---

### 🔧 Admin Panel

The admin panel at `/admin` provides comprehensive platform management:

| Module | Route | Description |
|--------|-------|-------------|
| **Dashboard** | `/admin` | Overview with key metrics: total users, prayers, revenue, recent activity. |
| **Analytics** | `/admin/analytics` | Engagement stats, traffic patterns, and growth metrics. |
| **User Management** | `/admin/users` | View, search, and manage user accounts. |
| **Prayer Management** | `/admin/prayers` | Moderate prayer requests from the Prayer Wall. |
| **Candle Management** | `/admin/candles` | View all candles, approve/reject flagged intentions, revenue by tier. |
| **Mass Offerings** | `/admin/mass-offerings` | Process and manage Mass offering requests. |
| **Memorial Management** | `/admin/memorials` | Review and manage memorial pages. |
| **Donation Tracking** | `/admin/donations` | View all donations and financial contributions. |
| **Revenue Dashboard** | `/admin/revenue` | Financial overview with breakdowns by product (candles, masses, memorials). |
| **Finance** | `/admin/finance` | Detailed financial reporting and export tools. |
| **Church Management** | `/admin/churches` | Manage church listings, verification requests, and data quality. |
| **Saints Database** | `/admin/saints` | Add, edit, and manage the saints encyclopedia. |
| **Readings** | `/admin/readings` | Manage daily readings content. |
| **Content (CMS)** | `/admin/cms` | Content management for blog posts, guides, and static pages. |
| **Articles** | `/admin/articles` | Manage blog and editorial content. |
| **Ad Management** | `/admin/ads` | Configure AdSense placements, toggle ads per page/position. |
| **Moderation** | `/admin/moderation` | Content moderation queue for user-generated content. |
| **Newsletter** | `/admin/newsletter` | Manage email subscribers and campaign sends. |
| **Partners** | `/admin/partners` | Manage advertising partners and affiliates. |
| **Abandoned Carts** | `/admin/abandoned-carts` | Track and recover incomplete purchases (candles, masses, memorials). |
| **Reports** | `/admin/reports` | Generate custom reports on usage and revenue. |
| **Feature Flags** | `/admin/features` | Toggle platform features on/off. |
| **Settings** | `/admin/settings` | Global platform configuration (pricing, copy, notifications). |
| **Audit Log** | `/admin/audit` | Activity log for admin actions and security monitoring. |

---

### ⚙️ Platform & Technical

| Feature | Description |
|---------|-------------|
| **Progressive Web App (PWA)** | Installable on any device with offline support, service worker caching, and custom runtime caching strategies. |
| **Android App (TWA)** | Trusted Web Activity app published on Google Play Store. Built with Android Studio + signed AAB. |
| **Telegram Bot** | `@MyPrayerTowerBot` — Daily devotions, prayer requests, and community interaction via Telegram mini-app. |
| **Multi-Language Support** | Google Translate integration with language switcher component in header and mobile menu. |
| **Global Search** | Cmd+K (⌘K) powered search modal searching across prayers, saints, churches, and content. |
| **Smart Ad System** | Context-aware Google AdSense integration with admin-controlled placement toggles per page and position. |
| **SEO Optimization** | — Dynamic `sitemap.ts` generating URLs for 20,000+ churches, 4,000+ prayers, saints, memorials, novenas, blog posts, and guides. |
| | — JSON-LD structured data (WebSite schema, SearchAction). |
| | — OpenGraph images and Twitter Cards for social sharing. |
| | — Auto-generated OG images via `/api/og`. |
| | — IndexNow notifications to search engines on new content. |
| **Payment Processing** | PayPal integration (live environment) for candles, Mass offerings, memorials, and donations. Abandoned cart tracking for recovery. |
| **Content Moderation** | Automated keyword-based content moderation for prayer intentions and user-generated content. |
| **Authentication** | Cookie-based session auth with JWT tokens, login/register flows, and role-based access control (Admin, User, Church). |
| **Push Notifications** | Firebase Cloud Messaging for prayer reminders and parish announcements. |
| **Analytics** | Vercel Analytics + Speed Insights for performance monitoring and Core Web Vitals tracking. |
| **Cookie Consent** | GDPR-compliant cookie consent banner. |
| **Cron Jobs** | Automated anniversary reminder emails via `/api/cron/anniversary-reminders` (daily at 8 AM). |

---

## 🏗️ Architecture

### Monorepo Structure (Turborepo + pnpm)

```
myprayertower/
├── apps/
│   ├── web/              # Next.js 14 — Main Website & PWA
│   ├── admin/            # React Admin Panel (Vite)
│   ├── api/              # NestJS Backend API
│   ├── telegram-bot/     # Telegram Bot Service
│   └── flutter_app/      # Android TWA (Flutter/Android Studio)
├── packages/
│   └── database/         # Prisma Schema, Migrations & Client
├── android-twa/          # Android TWA Build Config & Keystore
├── vercel.json           # Vercel deployment config
├── turbo.json            # Turborepo pipeline config
└── pnpm-workspace.yaml   # pnpm workspace definition
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Vanilla CSS + custom design system (`globals.css`), Framer Motion for animations |
| **Database** | PostgreSQL (via Supabase), Prisma ORM |
| **Payments** | PayPal REST API (Live) |
| **Auth** | Custom JWT + Cookie Sessions |
| **Hosting** | Vercel (Web), Google Play Store (Android) |
| **CDN/Media** | Vercel Edge Network, Unsplash (sample images) |
| **Email** | Newsletter API, Anniversary cron reminders |
| **Search** | IndexNow API for instant indexing |
| **Analytics** | Google Analytics (G-1X6N63VWZH), Vercel Analytics, Google AdSense |
| **Notifications** | Firebase Cloud Messaging, Telegram Bot API |
| **Build System** | Turborepo, pnpm 8, Node.js 20+ |

---

## 💎 Pricing

### 🕯️ Virtual Candles

| Duration | Tier Name | Price | Features |
|:---------|:----------|:------|:---------|
| **1 Day** | Humble Prayer | **Free** | Basic candle, visible for 24 hours |
| **3 Days** | Devotion Votive | **$2.99** | Cross effect, 3-day visibility |
| **7 Days** | Sacred Altar | **$5.99** | Amber altar glow, 1-week visibility |
| **14 Days** | Blessed Marian | **$9.99** | Blue Marian aura, premium animation |
| **30 Days** | Divine Cathedral | **$14.99** | Gold divine radiance, sparkle effects, top placement |

> **Bulk Lighting**: Light 1–10 candles per offering. Choose same intention for all or unique prayers for each.

### ⛪ Mass Offerings

| Type | Price | Description |
|:-----|:------|:------------|
| **Single Mass** | $10.00 | One Mass offered for your intention |
| **Novena** | $75.00 | 9 consecutive Masses |
| **Perpetual** | $100.00 | Enrollment in daily Masses forever |
| **Gregorian** | $200.00 | 30 consecutive Masses for the deceased |

### 🕊️ Memorial Tributes

| Plan | Price | Features |
|:-----|:------|:---------|
| **Basic** | **Free** | Permanent page, 1 photo, biography, guestbook, QR Code |
| **Premium** | **$49.99** | All Basic + 10 photos, 2 video tributes, featured placement |

### 💳 Monthly Subscriptions

| Plan | Price | Benefits |
|:-----|:------|:---------|
| **Prayer Partner** | $9.99/mo | 1 Mass/month, name on Daily Prayer List |
| **Family Plan** | $19.99/mo | 4 Masses/month, entire family on Prayer List |
| **Patron Circle** | $49.99/mo | Unlimited requests, Perpetual Enrollment, VIP Support |

### 💝 One-Time Donations

| Tier | Amount |
|:-----|:-------|
| Light a Candle | $10 |
| Rosary Partner | $20 |
| Parish Supporter | $50 |
| Guardian Angel | $100 |
| Benefactor | $250 |
| Patron | $500 |

### ⛪ Church Plans (B2B — One-Time)

| Plan | Price | Key Features |
|:-----|:------|:-------------|
| **Basic Parish** | $99 | Verified badge, profile page, Mass schedules, 3 announcements/month |
| **Pro Parish** | $249 | Everything in Basic + unlimited announcements, push notifications, event RSVP, 5 ministry pages, staff directory |
| **Cathedral** | $499 | Everything in Pro + unlimited ministry pages, 10 admin users, custom branding, API access, volunteer management |
| **Diocese License** | $2,499 | Centralized multi-parish management, cross-parish events, diocesan analytics |

---

## 🔌 API Endpoints

The platform exposes **42+ API route directories** under `/api/`:

| Category | Endpoints | Purpose |
|----------|-----------|---------|
| **Auth** | `/api/auth/*` | Login, register, session management |
| **Payments** | `/api/payments/*`, `/api/paypal/*` | Payment creation, verification, webhooks |
| **Candles** | `/api/candles/*` | Virtual candle CRUD, prayer counts |
| **Memorials** | `/api/memorials/*` | Memorial page CRUD, search |
| **Donations** | `/api/donations/*` | Donation processing |
| **Mass Offerings** | `/api/mass-offerings/*` | Mass request management |
| **Bouquets** | `/api/bouquets/*` | Spiritual bouquet creation |
| **Churches** | `/api/churches/*` | Church search, claim, detail |
| **Saints** | `/api/saints/*` | Saint data retrieval |
| **Readings** | `/api/readings/*` | Daily readings API |
| **Prayers** | `/api/prayers/*` | Prayer library content |
| **Blog** | `/api/blog/*` | Blog content API |
| **Calendar** | `/api/calendar/*` | Liturgical calendar data |
| **Catechism** | `/api/catechism/*` | Catechism content |
| **Users** | `/api/users/*` | User profile management |
| **Groups** | `/api/groups/*` | Prayer group management |
| **Settings** | `/api/settings/*` | User and global settings |
| **Newsletter** | `/api/newsletter` | Email subscription |
| **Notifications** | `/api/notifications/*` | Push notification management |
| **Ads** | `/api/ads/*` | Ad placement configuration |
| **Sponsored** | `/api/sponsored/*` | Sponsored content management |
| **Reports** | `/api/reports/*` | Analytics and reporting |
| **Stats** | `/api/stats/*` | Public statistics |
| **Admin** | `/api/admin/*` | Admin-only operations |
| **Upload** | `/api/upload/*` | File/image upload |
| **Contact** | `/api/contact/*` | Contact form processing |
| **Telegram** | `/api/telegram/*` | Telegram bot webhooks |
| **OG Image** | `/api/og/*` | Dynamic OpenGraph image generation |
| **Cron** | `/api/cron/*` | Scheduled tasks (anniversary reminders) |
| **IndexNow** | `/api/indexnow/*` | Search engine indexing notifications |
| **Hierarchy** | `/api/hierarchy/*` | Church hierarchy data |
| **Documents** | `/api/documents/*` | Church document retrieval |
| **Devotionals** | `/api/devotionals/*` | Daily devotional content |
| **Quotes** | `/api/quotes/*` | Inspirational quote API |
| **Seed** | `/api/seed/*` | Database seeding (development) |
| **Abandoned Cart** | `/api/abandoned-cart/*` | Cart recovery tracking |
| **Daily Content** | `/api/daily-content/*` | Dynamic daily content delivery |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **pnpm** 8+
- **PostgreSQL** 16+ (or Supabase hosted)

### Installation

```bash
# Clone repository
git clone https://github.com/shortfeeds/MyPrayerTower.git
cd MyPrayerTower

# Install dependencies
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local

# Generate Prisma client
pnpm db:generate

# Push database schema
pnpm db:push

# Start development
pnpm --filter @mpt/web dev
```

### Key Environment Variables

```bash
# Database (Required)
DATABASE_URL="postgresql://user:pass@localhost:5432/myprayertower"

# PayPal (Required for payments)
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your-paypal-client-id"
PAYPAL_CLIENT_SECRET="your-paypal-secret"
PAYPAL_ENVIRONMENT="sandbox" # or "live"

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXX"

# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# YouTube Data API
YOUTUBE_API_KEY="your-youtube-api-key"
```

### Development Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps for production
pnpm db:studio        # Open Prisma Studio (database GUI)
pnpm db:migrate       # Run database migrations
pnpm lint             # Lint all packages
```

---

## 🌐 Deployment

### Vercel (Production)

The `vercel.json` is pre-configured for the monorepo:

```json
{
    "installCommand": "pnpm install",
    "buildCommand": "pnpm --filter @mpt/database exec prisma generate --schema=./prisma/schema.prisma && pnpm --filter @mpt/web build",
    "outputDirectory": ".next",
    "framework": "nextjs",
    "crons": [
        { "path": "/api/cron/anniversary-reminders", "schedule": "0 8 * * *" }
    ]
}
```

**Manual Deploy:**
```bash
vercel --prod --yes
```

### Android (Google Play)

The Android TWA app is built using Android Studio:

```bash
cd android-twa
# Build signed AAB for Play Store
./gradlew bundleRelease
```

---

## 📄 Legal Pages

| Page | Route |
|------|-------|
| Privacy Policy | `/privacy` |
| Terms of Service | `/terms` |
| Cookie Policy | `/cookies` |
| Community Guidelines | `/guidelines` |
| DMCA Policy | `/dmca` |
| Refund Policy | `/refunds` |
| Advertise with Us | `/advertise` |
| Careers | `/careers` |
| Press | `/press` |

---

## 🔒 Security

- ✅ JWT authentication with cookie-based sessions
- ✅ PayPal webhook signature verification
- ✅ Automated content moderation (keyword filtering)
- ✅ Church 3-step identity verification
- ✅ GDPR/CCPA compliant cookie consent
- ✅ SSL/TLS encryption (Vercel Edge)
- ✅ Server-side validation for all critical actions
- ✅ Role-based access control (User, Admin, Church)
- ✅ Abandoned cart tracking with privacy-first design
- ✅ Audit logging for admin operations

---

## 📞 Support

- **Email**: support@myprayertower.com
- **Website**: [myprayertower.com/contact](https://myprayertower.com/contact)
- **Telegram**: [@MyPrayerTowerBot](https://t.me/MyPrayerTowerBot)

---

<p align="center">
  <em>"Where two or three are gathered in my name, there am I among them." — Matthew 18:20</em>
</p>

<p align="center">
  © 2026 MyPrayerTower. All rights reserved.
</p>