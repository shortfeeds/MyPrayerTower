# Search Engine Multi-Platform Indexing & SEO Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish canonical URL integrity, eliminate 307 redirect hops, dynamically submit all 664+ site URLs to multi-search engine indexers (Google, Bing, Yandex, Naver, Seznam, AI search engines), and install verification meta tags for major search engines.

**Architecture:** Standardize the primary domain to `https://www.myprayertower.com` across all layouts, metadata generators, and redirects (301 permanent). Upgrade the IndexNow & search engine submission pipeline to dynamically query all database/content slugs (prayers, saints, novenas, blog posts) and push them via API to IndexNow, Google Sitemap Ping, Bing Webmaster, and provide site verification tags for Google, Bing/Yahoo, Yandex, and Baidu.

**Tech Stack:** Next.js 14 App Router, TypeScript, Prisma ORM, IndexNow REST API, Schema.org JSON-LD, Node.js HTTPS script.

---

### Task 1: Fix Canonical URL Consistency & 301 Permanent Redirects

**Files:**
- Modify: `apps/web/next.config.js:205-231`
- Modify: `apps/web/src/app/layout.tsx:42-56`
- Modify: `apps/web/src/app/robots.ts:28-31`
- Modify: `apps/web/src/app/blog/[slug]/page.tsx:24-60`
- Modify: `apps/web/src/app/prayers/[slug]/page.tsx:32-47`
- Modify: `apps/web/src/app/saints/[slug]/page.tsx:45-60`

**Step 1: Update non-www redirect to 301 Permanent in next.config.js**
Change `permanent: false` to `permanent: true` in the `myprayertower.com` to `www.myprayertower.com` redirect rule.

**Step 2: Update root layout metadataBase and alternates**
Set `metadataBase` to `new URL('https://www.myprayertower.com')`.
Ensure canonical URL is `https://www.myprayertower.com`.

**Step 3: Update robots.ts sitemap URL**
Update `sitemap: 'https://www.myprayertower.com/sitemap.xml'`.

**Step 4: Standardize BASE_URL and canonicals in dynamic route templates**
Ensure `blog/[slug]`, `prayers/[slug]`, and `saints/[slug]` use `https://www.myprayertower.com` and explicitly set `alternates: { canonical: ... }`.

**Step 5: Verify build passes**
Run `pnpm --filter @mpt/web build` to verify metadata compilation with zero type errors.

**Step 6: Commit**
`git add apps/web/next.config.js apps/web/src/app/layout.tsx apps/web/src/app/robots.ts apps/web/src/app/blog/[slug]/page.tsx apps/web/src/app/prayers/[slug]/page.tsx apps/web/src/app/saints/[slug]/page.tsx`
`git commit -m "fix(seo): standardize canonical URLs to https://www.myprayertower.com and make non-www redirect 301 permanent"`

---

### Task 2: Multi-Search Engine Verification Tags (Google, Bing, Yandex, Baidu)

**Files:**
- Modify: `apps/web/src/app/layout.tsx:109-120`

**Step 1: Add verification slots to layout metadata**
Add verification entries for:
- Google (`verification.google`)
- Bing/Yahoo (`verification.other['msvalidate.01']`)
- Yandex (`verification.other['yandex-verification']`)
- Baidu (`verification.other['baidu-site-verification']`)
Read from environment variables with safe fallback placeholders:
```typescript
verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google-site-verification-code',
    other: {
        'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
        'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || '',
        'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION || '',
    },
},
```

**Step 2: Commit**
`git add apps/web/src/app/layout.tsx`
`git commit -m "feat(seo): add multi-engine verification tags for Google, Bing, Yandex, and Baidu"`

---

### Task 3: Comprehensive Multi-Search Engine & Dynamic Indexing Script

**Files:**
- Modify: `apps/web/scripts/submit-indexnow.js`
- Create: `apps/web/scripts/submit-all-search-engines.js`
- Modify: `apps/web/package.json:12-14`

**Step 1: Write dynamic URL harvester that includes all 664+ URLs**
Update the script to:
1. Harvest all static routes (75+ core pages).
2. Query Prisma database for all published Prayers (`slug`), Saints (`slug`), and Blog posts (`slug`).
3. Query all Novenas (`/novenas/[id]`).
4. Generate the full list of 600+ URLs.

**Step 2: Dispatch batch submissions to IndexNow API (Bing, Yandex, Seznam, Naver)**
Send batches of 250 URLs per request to `https://api.indexnow.org/indexnow`, `https://www.bing.com/indexnow`, and `https://yandex.com/indexnow`.

**Step 3: Dispatch Sitemap Pings**
Ping:
- Google: `https://www.google.com/ping?sitemap=https%3A%2F%2Fwww.myprayertower.com%2Fsitemap.xml`
- Bing: `https://www.bing.com/ping?sitemap=https%3A%2F%2Fwww.myprayertower.com%2Fsitemap.xml`

**Step 4: Test run script**
Run: `node apps/web/scripts/submit-all-search-engines.js`
Verify: HTTP 200/202 responses from endpoints.

**Step 5: Commit**
`git add apps/web/scripts/ apps/web/package.json`
`git commit -m "feat(indexing): add comprehensive multi-engine indexing script with dynamic database URL harvesting"`

---

### Task 4: High-Impact Social Share Blessing Cards (Viral Reach)

**Files:**
- Modify: `apps/web/src/components/social/ShareButtons.tsx`
- Modify: `apps/web/src/app/candles/page.tsx`
- Modify: `apps/web/src/app/prayer-wall/page.tsx`

**Step 1: Enhance ShareButtons with WhatsApp, Telegram, Facebook, and Native Web Share**
Provide one-tap spiritual share buttons with emotional and faith-focused copy:
*"I just lit a prayer candle for your intentions on MyPrayerTower. Join me in prayer here: [URL]"*

**Step 2: Add Post-Action Share Prompts**
When a user lights a candle or clicks "I prayed for this", trigger a gentle, respectful prompt:
*"Share this blessing with a friend or family member who needs hope today."*

**Step 3: Commit**
`git add apps/web/src/components/social/ apps/web/src/app/candles/ apps/web/src/app/prayer-wall/`
`git commit -m "feat(growth): add 1-click spiritual share buttons and viral blessing hooks"`

---

### Task 5: Build Verification, Git Push & Execution

**Files:**
- All touched files

**Step 1: Run production monorepo build**
Run: `pnpm --filter @mpt/web build`
Expected: 664+ static pages generated cleanly with 0 errors.

**Step 2: Run search engine indexing submission**
Run: `npm run indexnow`

**Step 3: Push to GitHub**
Run: `git push origin main`
Vercel automatically deploys the updated code.
