import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
    ],
    controllers: [],
})
export class WebhooksModule { }
