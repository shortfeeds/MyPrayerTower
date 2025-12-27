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
    ],
})
export class AppModule { }
