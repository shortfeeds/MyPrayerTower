# MyPrayerTower

**The #1 All-in-One Catholic Services App**

Find Catholic churches worldwide, join a global prayer community, and grow in faith together.

## 📋 Features

- 🏛️ **Church Finder** - 50,000+ churches with Mass times, directions, and events
- 🙏 **Prayer Wall** - Share intentions and pray for others
- 📖 **Prayer Library** - 2,000+ traditional and contemporary prayers
- ⛪ **Church Claims** - 3-step verification for church administrators
- 👤 **User Profiles** - Track prayers, saved churches, and subscriptions
- 🌍 **Multi-Language** - English, Spanish, and more
- 📱 **Mobile Apps** - iOS and Android with offline support
- 🔔 **Push Notifications** - Prayer reminders and community updates

## 🏗️ Project Structure

```
myprayertower/
├── apps/
│   ├── api/          # NestJS Backend (REST + GraphQL)
│   ├── web/          # Next.js 14 Web App
│   ├── admin/        # React Admin Panel
│   ├── mobile/       # Expo React Native App
│   └── scraper/      # GCatholic Data Scraper
├── packages/
│   └── database/     # Prisma Schema & Migrations
├── docker-compose.yml
└── turbo.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 16+
- Redis 7+

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/myprayertower.git
cd myprayertower

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
pnpm prisma generate --schema=packages/database/prisma/schema.prisma

# Push database schema
pnpm prisma db push --schema=packages/database/prisma/schema.prisma

# Start development
pnpm dev
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run ESLint across all apps |
| `pnpm test` | Run tests |
| `pnpm prisma studio` | Open Prisma Studio |

## 🌐 Services

| Service | URL | Description |
|---------|-----|-------------|
| Web App | http://localhost:3000 | Main website |
| API | http://localhost:4000 | Backend API |
| Admin | http://localhost:3001 | Admin panel |
| GraphQL | http://localhost:4000/graphql | GraphQL playground |

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available options:

```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/myprayertower"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Services
SENDGRID_API_KEY="your-sendgrid-key"
STRIPE_SECRET_KEY="your-stripe-key"
FIREBASE_SERVICE_ACCOUNT='{...}'
```

## 📱 Mobile Development

```bash
# Start Expo development server
cd apps/mobile
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android
```

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests (Web)
cd apps/web
npx playwright test

# Watch mode
pnpm test:watch
```

## 🐳 Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

## 📄 API Documentation

- **REST API**: `/api/v1/` prefix
- **GraphQL**: `/graphql` endpoint
- **Swagger**: `/api/docs` (when enabled)

## 🔒 Security

- JWT authentication with refresh tokens
- Rate limiting (100 req/min)
- Prayer request moderation
- Church 3-step verification (Email OTP, SMS OTP, Documents)
- GDPR/CCPA compliant

## 📜 Legal

- [Terms of Service](/legal/terms-of-service.md)
- [Privacy Policy](/legal/privacy-policy.md)
- [Community Guidelines](/legal/community-guidelines.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📃 License

Copyright © 2024 MyPrayerTower. All rights reserved.

---

Made with ❤️ and 🙏
