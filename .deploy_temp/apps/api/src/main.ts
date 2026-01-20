import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
        origin: [
            process.env.WEB_URL || 'http://localhost:3000',
            process.env.ADMIN_URL || 'http://localhost:3001',
        ],
        credentials: true,
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // API prefix
    app.setGlobalPrefix('api/v1');

    const port = process.env.PORT || 4000;
    await app.listen(port);

    console.log(`🚀 MyPrayerTower API running on port ${port}`);
}

bootstrap();
