# MyPrayerTower

**The #1 All-in-One Catholic Services App**

Find Catholic churches worldwide, join a global prayer community, and grow in faith together.

[![Website](https://img.shields.io/badge/Website-myprayertower.com-blue)](https://myprayertower.com)
[![Play Store](https://img.shields.io/badge/Android-Play%20Store-green)](https://play.google.com/store/apps/details?id=com.myprayertower.app)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## 📋 Features

### Core Features
- 🏛️ **Church Finder** - 10,000+ churches with Mass times, directions, and contact info
- 🙏 **Prayer Wall** - Share intentions and pray for others worldwide
- 📖 **Prayer Library** - 2,000+ traditional and contemporary prayers
- 👤 **User Profiles** - Track prayers, saved churches, streaks, and badges
- 📿 **Rosary Guide** - Interactive rosary with all mysteries
- 📅 **Daily Readings** - USCCB daily Mass readings
- ⛪ **Saint of the Day** - Learn about saints throughout the year

### New Features (December 2024)
- 🌙 **Dark Mode** - System-aware theme with manual toggle
- 🎵 **Audio Prayer Player** - Listen to prayers with full playback controls
- 🔥 **Prayer Streaks** - Gamification with streak tracking and badges
- 🏆 **Badges & Achievements** - 12+ badges for prayer milestones
- 📊 **Personal Analytics** - Dashboard with prayer stats and insights
- 👥 **Prayer Groups** - Create and join prayer communities
- ♿ **Accessibility** - Font size, high contrast, reduced motion options
- 🔔 **Push Notifications** - Prayer reminders and community updates
- 📱 **PWA Support** - Install on any device for offline access
- 🔗 **Shareable Prayer Images** - Generate OG images for social sharing

### SEO & Performance
- 🗺️ **Dynamic Sitemap** - Auto-generated for all content
- 🍞 **Breadcrumb Navigation** - With JSON-LD structured data
- ⚡ **Edge Caching** - Database query caching for fast loads
- 📦 **Image Optimization** - Sharp-powered image processing

---

## 🏗️ Project Structure

```
myprayertower/
├── apps/
│   ├── web/          # Next.js 14 Web App (Main Application)
│   ├── admin/        # React Admin Panel
│   ├── mobile/       # Expo React Native App (Optional)
│   ├── api/          # NestJS Backend (Optional - see note below)
│   └── scraper/      # GCatholic Data Scraper
├── packages/
│   └── database/     # Prisma Schema & Migrations
├── docker-compose.yml
└── turbo.json
```

> **Note on API Backend**: The web app uses direct Prisma database access. The NestJS API backend is optional and only needed if you want REST/GraphQL endpoints for third-party integrations. The admin panel works independently.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 16+ (or Supabase)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/myprayertower.git
cd myprayertower

# Install dependencies
pnpm install

# Set up environment
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your configuration

# Start development (web only)
pnpm --filter @mpt/web dev
```

### Environment Variables

Create `apps/web/.env.local`:

```bash
# Database (Required)
DATABASE_URL="postgresql://user:pass@localhost:5432/myprayertower"

# AdSense/AdMob (Required for ads)
NEXT_PUBLIC_ADSENSE_CLIENT_ID="ca-pub-XXXXXXXXXXXXXXXX"

# Push Notifications (Optional)
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
```

---

## 📱 Mobile App (Android)

The Android app is built using Expo React Native and shares data with the web app.

### Automatic Content Updates
✅ **Yes, website data updates automatically sync to the app!**

The mobile app fetches data from the same database via API calls or direct database access. When you update:
- Churches, Mass times, or contact info
- Prayer library content
- Saints information
- Daily readings

These changes are reflected in the app immediately or after the next app refresh. No APK update is required for content changes.

> ⚠️ **APK Updates Required For**: Code changes, new features, UI updates, or native module updates.

### Building for Production

```bash
cd apps/mobile

# Build Android APK
eas build --platform android --profile production

# Build Android AAB (for Play Store)
eas build --platform android --profile production-aab
```

---

## 📄 Legal Pages

All required legal pages are implemented:

| Page | URL | Purpose |
|------|-----|---------|
| Privacy Policy | `/privacy` | GDPR/CCPA compliant data practices |
| Terms of Service | `/terms` | User agreement and liability |
| Cookie Policy | `/cookies` | Cookie usage disclosure |
| Community Guidelines | `/guidelines` | Prayer wall and community rules |
| DMCA Policy | `/dmca` | Copyright takedown procedures |

---

## 🛡️ Google Play Store Compliance

### Required for Publishing

1. **Privacy Policy URL**: https://myprayertower.com/privacy
2. **Terms of Service URL**: https://myprayertower.com/terms
3. **Ad Disclosure**: App uses Google AdMob (disclosed in Privacy Policy)
4. **Data Safety Form**: Complete in Play Console
5. **Content Rating**: Complete IARC questionnaire
6. **App Signing**: Enroll in Google Play App Signing

### AdMob Setup

1. Add your AdMob App ID to `apps/mobile/app.json`:
   ```json
   {
     "expo": {
       "plugins": [
         ["expo-ads-admob", { "appId": "ca-app-pub-XXXXXX~YYYYYY" }]
       ]
     }
   }
   ```

2. For web, set in `.env.local`:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXX
   ```

---

## 🌐 Website Deployment

### Recommended: Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

### Environment Variables on Vercel
Add the same variables from `.env.local` in Vercel Dashboard → Settings → Environment Variables.

---

## 🔒 Security

- ✅ JWT authentication with refresh tokens
- ✅ Rate limiting (100 req/min)
- ✅ Prayer request moderation
- ✅ Church 3-step verification
- ✅ GDPR/CCPA compliant
- ✅ SSL/TLS encryption
- ✅ Secure password hashing (bcrypt)

---

## 📞 Support

- **Email**: support@myprayertower.com
- **Privacy**: privacy@myprayertower.com
- **DMCA**: dmca@myprayertower.com
- **Website**: https://myprayertower.com/contact

---

## 📃 License

Copyright © 2026 MyPrayerTower. All rights reserved.