-- Run these queries one by one in your SQL editor (Supabase, pgAdmin, etc.)

ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "preferredTime" TEXT DEFAULT '06:00';
ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "timezone" TEXT DEFAULT 'UTC';
ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "isGospelSubscribed" BOOLEAN DEFAULT true;
ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "isMercySubscribed" BOOLEAN DEFAULT false;
ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "quizScore" INTEGER DEFAULT 0;
ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "streakCount" INTEGER DEFAULT 0;
ALTER TABLE "TelegramUser" ADD COLUMN IF NOT EXISTS "lastActiveDate" TIMESTAMP(3);

-- Verify the changes
SELECT * FROM "TelegramUser" LIMIT 1;
