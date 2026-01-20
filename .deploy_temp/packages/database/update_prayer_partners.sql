-- Create Enum
CREATE TYPE "PrayerPartnerStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- CreateTable
CREATE TABLE "PrayerPartner" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "PrayerPartnerStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrayerPartner_requesterId_idx" ON "PrayerPartner"("requesterId");

-- CreateIndex
CREATE INDEX "PrayerPartner_receiverId_idx" ON "PrayerPartner"("receiverId");

-- CreateIndex
CREATE INDEX "PrayerPartner_status_idx" ON "PrayerPartner"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PrayerPartner_requesterId_receiverId_key" ON "PrayerPartner"("requesterId", "receiverId");

-- AddForeignKey
ALTER TABLE "PrayerPartner" ADD CONSTRAINT "PrayerPartner_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerPartner" ADD CONSTRAINT "PrayerPartner_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
