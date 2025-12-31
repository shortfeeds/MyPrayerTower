---
description: Steps to complete before launching ad monetization
---

# Ad Monetization Launch Checklist

## Pre-Launch Requirements

### 1. Run Database Migration
```bash
cd packages/database
npx prisma migrate dev --name ad_monetization
npx prisma generate
```

### 2. Set Up Google AdMob Account
1. Go to [admob.google.com](https://admob.google.com)
2. Register Android app: `com.myprayertower.app`
3. Create ad units:
   - Home Banner
   - Inline List Ad
   - Content Page Ad
4. Copy Ad Unit IDs

### 3. Set Up Google AdSense (Web)
1. Go to [adsense.google.com](https://www.google.com/adsense)
2. Register website domain
3. Get Publisher ID (format: ca-pub-XXXXXXXX)
4. Create ad units for each placement

### 4. Add Environment Variables
Add to `.env`:
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-YOUR_ID
EXPO_PUBLIC_ADMOB_ANDROID_APP_ID=ca-app-pub-XXX~YYY
EXPO_PUBLIC_ADMOB_HOME_BANNER=ca-app-pub-XXX/YYY
EXPO_PUBLIC_ADMOB_INLINE=ca-app-pub-XXX/ZZZ
EXPO_PUBLIC_ADMOB_CONTENT=ca-app-pub-XXX/AAA
```

### 5. Install Mobile AdMob Package
```bash
cd apps/mobile
npm install react-native-google-mobile-ads
```

### 6. Update app.json
```json
{
  "plugins": [
    ["react-native-google-mobile-ads", {
      "androidAppId": "ca-app-pub-XXX~YYY"
    }]
  ]
}
```

---

## How Ad Priority Works

Each ad slot operates BOTH offline sponsors AND Google ads simultaneously:

1. **First Priority**: Active offline sponsor ads (direct revenue)
2. **Fallback**: Google AdMob/AdSense (fills unsold inventory)

This is handled automatically by `SmartAdSlot` component on web and can be replicated on mobile.

---

## Testing Ads

1. Create test offline sponsor ad in `/admin/ads`
2. Verify it displays on target page
3. Deactivate offline ad
4. Verify Google ad now shows as fallback
