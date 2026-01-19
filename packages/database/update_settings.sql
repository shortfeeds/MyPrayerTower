ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "bannerAdUnitIdAndroid" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "bannerAdUnitIdiOS" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "interstitialAdUnitIdAndroid" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "interstitialAdUnitIdiOS" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "nativeAdUnitIdAndroid" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "nativeAdUnitIdiOS" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "rewardedAdUnitIdAndroid" TEXT;
ALTER TABLE "AppSettings" ADD COLUMN IF NOT EXISTS "rewardedAdUnitIdiOS" TEXT;
