
# MyPrayerTower Web App

Built with Next.js, Tailwind CSS, and Supabase.

## Vercel Deployment

This project is deployed on Vercel. 
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm --filter @mpt/database exec prisma generate --schema=./prisma/schema.prisma && pnpm --filter @mpt/database build && pnpm --filter @mpt/web build`

## Latest Updates
- Re-enabled Google AdSense
- Migrated Notifications to Firebase
- Disabled Google Ads (Historical)
