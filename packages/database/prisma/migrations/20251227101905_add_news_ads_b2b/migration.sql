-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PLUS', 'PREMIUM', 'LIFETIME');

-- CreateEnum
CREATE TYPE "DioceseType" AS ENUM ('ARCHDIOCESE', 'DIOCESE', 'EPARCHY', 'VICARIATE', 'PREFECTURE', 'ORDINARIATE', 'OTHER');

-- CreateEnum
CREATE TYPE "ChurchType" AS ENUM ('PARISH', 'CATHEDRAL', 'BASILICA', 'CHAPEL', 'SHRINE', 'MONASTERY', 'ABBEY', 'MISSION', 'OTHER');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('MASS', 'CONFESSION', 'ADORATION', 'RETREAT', 'BIBLE_STUDY', 'YOUTH_EVENT', 'FUNDRAISER', 'SOCIAL', 'VOLUNTEER', 'OTHER');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'EMAIL_VERIFIED', 'SMS_VERIFIED', 'DOCUMENTS_SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PrayerCategory" AS ENUM ('HEALTH', 'FAMILY', 'WORK', 'FINANCES', 'RELATIONSHIPS', 'GRIEF', 'THANKSGIVING', 'SPIRITUAL', 'WORLD', 'OTHER');

-- CreateEnum
CREATE TYPE "PrayerVisibility" AS ENUM ('PUBLIC', 'ANONYMOUS', 'CHURCH_ONLY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('PRAYER_RECEIVED', 'PRAYER_APPROVED', 'PRAYER_REJECTED', 'SOMEONE_PRAYED', 'PRAYER_ANSWERED', 'CHURCH_EVENT', 'CLAIM_STATUS', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'CONTENT_EDITOR');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MinistryType" AS ENUM ('NONPROFIT', 'CHARITY', 'EDUCATION', 'MEDIA', 'RETREAT_CENTER', 'RELIGIOUS_ORDER', 'YOUTH_GROUP', 'SUPPORT_GROUP', 'OTHER');

-- CreateEnum
CREATE TYPE "ChurchTier" AS ENUM ('UNCLAIMED', 'BASIC', 'PRO', 'CATHEDRAL', 'DIOCESE');

-- CreateEnum
CREATE TYPE "ChurchAdminRole" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "AdType" AS ENUM ('BANNER', 'NATIVE', 'NEWSLETTER', 'FEATURED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionTier" "SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "subscriptionEnds" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "homeChurchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diocese" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DioceseType" NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "bishopName" TEXT,
    "bishopTitle" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "catholicCount" INTEGER,
    "parishCount" INTEGER,
    "priestCount" INTEGER,
    "externalId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diocese_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Church" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "ChurchType" NOT NULL,
    "denomination" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "dioceseId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "claimedBy" TEXT,
    "description" TEXT,
    "shortDescription" TEXT,
    "history" TEXT,
    "primaryImageUrl" TEXT,
    "virtualTourUrl" TEXT,
    "massSchedule" JSONB,
    "confessionSchedule" JSONB,
    "adorationSchedule" JSONB,
    "externalId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Church_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchImage" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChurchImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchStaff" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "imageUrl" TEXT,
    "bio" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchStaff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchEvent" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" JSONB,
    "location" TEXT,
    "imageUrl" TEXT,
    "registrationUrl" TEXT,
    "maxAttendees" INTEGER,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchClaim" (
    "id" TEXT NOT NULL,
    "claimCode" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "claimantName" TEXT NOT NULL,
    "claimantTitle" TEXT NOT NULL,
    "claimantEmail" TEXT NOT NULL,
    "claimantPhone" TEXT NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "smsVerified" BOOLEAN NOT NULL DEFAULT false,
    "smsVerifiedAt" TIMESTAMP(3),
    "emailOtp" TEXT,
    "emailOtpExpires" TIMESTAMP(3),
    "smsOtp" TEXT,
    "smsOtpExpires" TIMESTAMP(3),
    "documentsSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "documentsNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "category" "PrayerCategory" NOT NULL,
    "visibility" "PrayerVisibility" NOT NULL DEFAULT 'PUBLIC',
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "churchId" TEXT,
    "status" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
    "moderatedBy" TEXT,
    "moderatedAt" TIMESTAMP(3),
    "moderationNotes" TEXT,
    "rejectionReason" TEXT,
    "prayerCount" INTEGER NOT NULL DEFAULT 0,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "answeredAt" TIMESTAMP(3),
    "testimony" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerAction" (
    "id" TEXT NOT NULL,
    "prayerRequestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrayerAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerUpdate" (
    "id" TEXT NOT NULL,
    "prayerRequestId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrayerUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prayer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "audioUrl" TEXT,
    "audioDuration" INTEGER,
    "imageUrl" TEXT,
    "author" TEXT,
    "source" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerLibraryCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "iconName" TEXT,
    "color" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerLibraryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "feastDay" TEXT,
    "feastMonth" INTEGER,
    "feastDayOfMonth" INTEGER,
    "biography" TEXT,
    "shortBio" TEXT,
    "imageUrl" TEXT,
    "patronOf" TEXT[],
    "bornDate" TEXT,
    "diedDate" TEXT,
    "canonizedDate" TEXT,
    "externalId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Saint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReading" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "liturgicalSeason" TEXT,
    "liturgicalColor" TEXT,
    "feastName" TEXT,
    "firstReading" TEXT,
    "firstReadingRef" TEXT,
    "psalm" TEXT,
    "psalmRef" TEXT,
    "secondReading" TEXT,
    "secondReadingRef" TEXT,
    "gospel" TEXT,
    "gospelRef" TEXT,
    "reflection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncLog" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "recordsProcessed" INTEGER NOT NULL DEFAULT 0,
    "recordsCreated" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "recordsFailed" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "errorDetails" JSONB,
    "triggeredBy" TEXT,

    CONSTRAINT "SyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'app_settings',
    "siteName" TEXT NOT NULL DEFAULT 'MyPrayerTower',
    "siteTagline" TEXT NOT NULL DEFAULT 'All-in-One Catholic Services',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "registrationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "prayerWallEnabled" BOOLEAN NOT NULL DEFAULT true,
    "syncEnabled" BOOLEAN NOT NULL DEFAULT true,
    "syncSchedule" TEXT NOT NULL DEFAULT '0 2 * * 0',
    "plusMonthlyPrice" INTEGER NOT NULL DEFAULT 499,
    "plusYearlyPrice" INTEGER NOT NULL DEFAULT 3999,
    "premiumMonthlyPrice" INTEGER NOT NULL DEFAULT 999,
    "premiumYearlyPrice" INTEGER NOT NULL DEFAULT 7999,
    "lifetimePrice" INTEGER NOT NULL DEFAULT 14999,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ministry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "MinistryType" NOT NULL DEFAULT 'OTHER',
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "postalCode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "description" TEXT,
    "missionStatement" TEXT,
    "imageUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "externalId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "dataSource" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ministry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchSubscription" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "tier" "ChurchTier" NOT NULL DEFAULT 'UNCLAIMED',
    "paidAmount" DOUBLE PRECISION,
    "paidAt" TIMESTAMP(3),
    "stripePaymentId" TEXT,
    "announcementsLimit" INTEGER,
    "eventsLimit" INTEGER,
    "adminsLimit" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchAnnouncement" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "linkUrl" TEXT,
    "linkText" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "pushSent" BOOLEAN NOT NULL DEFAULT false,
    "pushSentAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchFollower" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
    "isParishioner" BOOLEAN NOT NULL DEFAULT false,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChurchFollower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChurchAdmin" (
    "id" TEXT NOT NULL,
    "churchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ChurchAdminRole" NOT NULL DEFAULT 'EDITOR',
    "canEditInfo" BOOLEAN NOT NULL DEFAULT true,
    "canPostAnnouncements" BOOLEAN NOT NULL DEFAULT true,
    "canManageEvents" BOOLEAN NOT NULL DEFAULT true,
    "canManageAdmins" BOOLEAN NOT NULL DEFAULT false,
    "canViewAnalytics" BOOLEAN NOT NULL DEFAULT true,
    "invitedBy" TEXT,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChurchAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "linkUrl" TEXT NOT NULL,
    "author" TEXT,
    "category" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SponsoredContent" (
    "id" TEXT NOT NULL,
    "type" "AdType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "advertiser" TEXT NOT NULL,
    "advertiserEmail" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "paidAmount" DOUBLE PRECISION,
    "stripePaymentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SponsoredContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_homeChurchId_idx" ON "User"("homeChurchId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Diocese_externalId_key" ON "Diocese"("externalId");

-- CreateIndex
CREATE INDEX "Diocese_country_idx" ON "Diocese"("country");

-- CreateIndex
CREATE INDEX "Diocese_region_idx" ON "Diocese"("region");

-- CreateIndex
CREATE UNIQUE INDEX "Church_slug_key" ON "Church"("slug");

-- CreateIndex
CREATE INDEX "Church_city_country_idx" ON "Church"("city", "country");

-- CreateIndex
CREATE INDEX "Church_latitude_longitude_idx" ON "Church"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "Church_denomination_idx" ON "Church"("denomination");

-- CreateIndex
CREATE INDEX "Church_isVerified_idx" ON "Church"("isVerified");

-- CreateIndex
CREATE INDEX "ChurchImage_churchId_idx" ON "ChurchImage"("churchId");

-- CreateIndex
CREATE INDEX "ChurchStaff_churchId_idx" ON "ChurchStaff"("churchId");

-- CreateIndex
CREATE INDEX "ChurchEvent_churchId_idx" ON "ChurchEvent"("churchId");

-- CreateIndex
CREATE INDEX "ChurchEvent_startDate_idx" ON "ChurchEvent"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "ChurchClaim_claimCode_key" ON "ChurchClaim"("claimCode");

-- CreateIndex
CREATE INDEX "ChurchClaim_churchId_idx" ON "ChurchClaim"("churchId");

-- CreateIndex
CREATE INDEX "ChurchClaim_userId_idx" ON "ChurchClaim"("userId");

-- CreateIndex
CREATE INDEX "ChurchClaim_status_idx" ON "ChurchClaim"("status");

-- CreateIndex
CREATE INDEX "PrayerRequest_userId_idx" ON "PrayerRequest"("userId");

-- CreateIndex
CREATE INDEX "PrayerRequest_status_idx" ON "PrayerRequest"("status");

-- CreateIndex
CREATE INDEX "PrayerRequest_visibility_idx" ON "PrayerRequest"("visibility");

-- CreateIndex
CREATE INDEX "PrayerRequest_category_idx" ON "PrayerRequest"("category");

-- CreateIndex
CREATE INDEX "PrayerRequest_isAnswered_idx" ON "PrayerRequest"("isAnswered");

-- CreateIndex
CREATE INDEX "PrayerAction_prayerRequestId_idx" ON "PrayerAction"("prayerRequestId");

-- CreateIndex
CREATE INDEX "PrayerAction_userId_idx" ON "PrayerAction"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerAction_prayerRequestId_userId_key" ON "PrayerAction"("prayerRequestId", "userId");

-- CreateIndex
CREATE INDEX "PrayerUpdate_prayerRequestId_idx" ON "PrayerUpdate"("prayerRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Prayer_slug_key" ON "Prayer"("slug");

-- CreateIndex
CREATE INDEX "Prayer_categoryId_idx" ON "Prayer"("categoryId");

-- CreateIndex
CREATE INDEX "Prayer_language_idx" ON "Prayer"("language");

-- CreateIndex
CREATE INDEX "Prayer_isPublished_idx" ON "Prayer"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerLibraryCategory_slug_key" ON "PrayerLibraryCategory"("slug");

-- CreateIndex
CREATE INDEX "PrayerLibraryCategory_parentId_idx" ON "PrayerLibraryCategory"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Saint_slug_key" ON "Saint"("slug");

-- CreateIndex
CREATE INDEX "Saint_feastMonth_feastDayOfMonth_idx" ON "Saint"("feastMonth", "feastDayOfMonth");

-- CreateIndex
CREATE UNIQUE INDEX "DailyReading_date_key" ON "DailyReading"("date");

-- CreateIndex
CREATE INDEX "DailyReading_date_idx" ON "DailyReading"("date");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_email_idx" ON "AdminUser"("email");

-- CreateIndex
CREATE INDEX "SyncLog_source_idx" ON "SyncLog"("source");

-- CreateIndex
CREATE INDEX "SyncLog_status_idx" ON "SyncLog"("status");

-- CreateIndex
CREATE INDEX "SyncLog_startedAt_idx" ON "SyncLog"("startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Ministry_slug_key" ON "Ministry"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Ministry_externalId_key" ON "Ministry"("externalId");

-- CreateIndex
CREATE INDEX "Ministry_state_city_idx" ON "Ministry"("state", "city");

-- CreateIndex
CREATE INDEX "Ministry_type_idx" ON "Ministry"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ChurchSubscription_churchId_key" ON "ChurchSubscription"("churchId");

-- CreateIndex
CREATE INDEX "ChurchSubscription_tier_idx" ON "ChurchSubscription"("tier");

-- CreateIndex
CREATE INDEX "ChurchSubscription_isActive_idx" ON "ChurchSubscription"("isActive");

-- CreateIndex
CREATE INDEX "ChurchAnnouncement_churchId_idx" ON "ChurchAnnouncement"("churchId");

-- CreateIndex
CREATE INDEX "ChurchAnnouncement_isPublished_publishedAt_idx" ON "ChurchAnnouncement"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "ChurchFollower_churchId_idx" ON "ChurchFollower"("churchId");

-- CreateIndex
CREATE INDEX "ChurchFollower_userId_idx" ON "ChurchFollower"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChurchFollower_churchId_userId_key" ON "ChurchFollower"("churchId", "userId");

-- CreateIndex
CREATE INDEX "ChurchAdmin_churchId_idx" ON "ChurchAdmin"("churchId");

-- CreateIndex
CREATE INDEX "ChurchAdmin_userId_idx" ON "ChurchAdmin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChurchAdmin_churchId_userId_key" ON "ChurchAdmin"("churchId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_externalId_key" ON "NewsArticle"("externalId");

-- CreateIndex
CREATE INDEX "NewsArticle_source_idx" ON "NewsArticle"("source");

-- CreateIndex
CREATE INDEX "NewsArticle_publishedAt_idx" ON "NewsArticle"("publishedAt");

-- CreateIndex
CREATE INDEX "NewsArticle_category_idx" ON "NewsArticle"("category");

-- CreateIndex
CREATE INDEX "SponsoredContent_placement_isActive_idx" ON "SponsoredContent"("placement", "isActive");

-- CreateIndex
CREATE INDEX "SponsoredContent_startDate_endDate_idx" ON "SponsoredContent"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_homeChurchId_fkey" FOREIGN KEY ("homeChurchId") REFERENCES "Church"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Church" ADD CONSTRAINT "Church_dioceseId_fkey" FOREIGN KEY ("dioceseId") REFERENCES "Diocese"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchImage" ADD CONSTRAINT "ChurchImage_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchStaff" ADD CONSTRAINT "ChurchStaff_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchEvent" ADD CONSTRAINT "ChurchEvent_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchClaim" ADD CONSTRAINT "ChurchClaim_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchClaim" ADD CONSTRAINT "ChurchClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerRequest" ADD CONSTRAINT "PrayerRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerRequest" ADD CONSTRAINT "PrayerRequest_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerAction" ADD CONSTRAINT "PrayerAction_prayerRequestId_fkey" FOREIGN KEY ("prayerRequestId") REFERENCES "PrayerRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerAction" ADD CONSTRAINT "PrayerAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerUpdate" ADD CONSTRAINT "PrayerUpdate_prayerRequestId_fkey" FOREIGN KEY ("prayerRequestId") REFERENCES "PrayerRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prayer" ADD CONSTRAINT "Prayer_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PrayerLibraryCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerLibraryCategory" ADD CONSTRAINT "PrayerLibraryCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PrayerLibraryCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchSubscription" ADD CONSTRAINT "ChurchSubscription_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchAnnouncement" ADD CONSTRAINT "ChurchAnnouncement_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchFollower" ADD CONSTRAINT "ChurchFollower_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchFollower" ADD CONSTRAINT "ChurchFollower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchAdmin" ADD CONSTRAINT "ChurchAdmin_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "Church"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChurchAdmin" ADD CONSTRAINT "ChurchAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
