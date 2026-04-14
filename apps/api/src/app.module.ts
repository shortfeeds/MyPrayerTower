import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Core modules
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ChurchesModule } from './modules/churches/churches.module';
import { PrayersModule } from './modules/prayers/prayers.module';
import { PrayerWallModule } from './modules/prayer-wall/prayer-wall.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { SaintsModule } from './modules/saints/saints.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { SyncModule } from './modules/sync/sync.module';
import { ChurchPortalModule } from './modules/church-portal/church-portal.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NewsModule } from './modules/news/news.module';
import { LiturgicalModule } from './modules/liturgical/liturgical.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { PrayerPartnersModule } from './modules/prayer-partners/prayer-partners.module';
import { PilgrimagesModule } from './modules/pilgrimages/pilgrimages.module';
import { CartsModule } from './modules/carts/carts.module';
import { MemorialsModule } from './modules/memorials/memorials.module';
import { FailedPaymentsModule } from './modules/failed-payments/failed-payments.module';


// Mass Offerings & Donations
import { MassOfferingsModule } from './modules/mass-offerings/mass-offerings.module';
import { PlatformDonationsModule } from './modules/platform-donations/platform-donations.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';

import { PurchasesModule } from './modules/purchases/purchases.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AdsModule } from './modules/ads/ads.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '../../.env',
        }),

        // Rate limiting
        ThrottlerModule.forRoot([{
            ttl: 60000, // 1 minute
            limit: 100, // 100 requests per minute
        }]),

        // Scheduled tasks
        ScheduleModule.forRoot(),

        // GraphQL
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: process.env.NODE_ENV !== 'production',
            context: ({ req, res }) => ({ req, res }),
        }),

        // Database
        PrismaModule,

        // Feature modules
        AuthModule,
        UsersModule,
        ChurchesModule,
        PrayersModule,
        PrayerWallModule,
        ClaimsModule,
        SaintsModule,
        NotificationsModule,
        AdminModule,
        SyncModule,
        ChurchPortalModule,
        PaymentsModule,
        NewsModule,
        LiturgicalModule,
        ModerationModule,
        PrayerPartnersModule,
        PilgrimagesModule,
        CartsModule,
        MemorialsModule,
        FailedPaymentsModule,

        // Mass Offerings & Donations (Centralized)
        MassOfferingsModule,
        PlatformDonationsModule,
        WebhooksModule,

        // In-App Purchases
        PurchasesModule,

        // Analytics
        AnalyticsModule,

        // Ads
        AdsModule,
    ],
})
export class AppModule { }


