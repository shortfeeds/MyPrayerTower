/// API Configuration Constants
class ApiConstants {
  ApiConstants._();

  /// Base URL for the MyPrayerTower API
  static const String baseUrl = 'https://myprayertower.com/api';

  /// Connection timeout in milliseconds
  static const int connectionTimeout = 30000;

  /// Receive timeout in milliseconds
  static const int receiveTimeout = 30000;

  // Auth endpoints
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String logoutEndpoint = '/auth/logout';
  static const String userEndpoint = '/auth/me';

  // Church endpoints
  static const String churches = '/churches';
  static String churchById(String id) => '/churches/$id';

  // Prayer endpoints
  static const String prayers = '/prayers';
  static const String prayerWall = '/prayer-wall';

  // Readings & Saints
  static const String readings = '/readings';
  static const String saints = '/saints';
  static String saintById(String id) => '/saints/$id';
  static const String quotes = '/quotes';

  // Bible
  static const String bibleBooks = '/bible/books';
  static String bibleChapter(String book, int chapter) =>
      '/bible/$book/$chapter';
  static const String verseOfDay = '/bible/verse-of-day';

  // Catechism
  static const String catechism = '/catechism';

  // Devotionals
  static const String devotionals = '/devotionals';

  // Calendar
  static const String liturgicalCalendar = '/calendar/liturgical';

  // Candles
  static const String candlesCheckout = '/candles/checkout';

  // Mass Offerings
  static const String massOfferingsCheckout = '/mass-offerings/checkout';

  // News
  static const String news = '/news';

  // Contact
  static const String contact = '/contact';

  // Supabase Configuration
  static const String supabaseUrl = 'https://htgvilktnadnwlforyjt.supabase.co';
  static const String supabaseAnonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0Z3ZpbGt0bmFkbndsZm9yeWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NzA4MTUsImV4cCI6MjA4MjI0NjgxNX0.CzOjq_B--3u5oF3Q3eJ-pXHALL8zNRJx0hjBY3nBPGA';
}

/// App-wide constants
class AppConstants {
  AppConstants._();

  /// App name
  static const String appName = 'MyPrayerTower';

  /// App tagline
  static const String tagline = 'All-in-One Catholic Services';

  /// Version
  static const String version = '2.0.0';

  /// Package name
  static const String packageName = 'com.myprayertower.app';

  /// Church count (for display)
  static const int churchCount = 10000;

  /// Prayer count (for display)
  static const int prayerCount = 4000;

  // Storage keys
  static const String tokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'user_data';
  static const String onboardingKey = 'onboarding_complete';
  static const String themeKey = 'theme_mode';

  // Subscription tiers
  static const String tierFree = 'FREE';
  static const String tierPlus = 'PLUS';
  static const String tierPremium = 'PREMIUM';
  static const String tierLifetime = 'LIFETIME';
}

/// Google Play Billing Product IDs
class BillingProducts {
  BillingProducts._();

  // Subscriptions
  static const String plusMonthly = 'plus_monthly';
  static const String plusYearly = 'plus_yearly';
  static const String premiumMonthly = 'premium_monthly';
  static const String premiumYearly = 'premium_yearly';

  // One-time purchases
  static const String lifetime = 'lifetime';

  // Virtual Candles
  static const String candle1Day = 'candle_1day';
  static const String candle3Days = 'candle_3days';
  static const String candle7Days = 'candle_7days';
  static const String candle30Days = 'candle_30days';

  // All subscription product IDs
  static const List<String> subscriptionIds = [
    plusMonthly,
    plusYearly,
    premiumMonthly,
    premiumYearly,
  ];

  // All consumable product IDs
  static const List<String> consumableIds = [
    candle1Day,
    candle3Days,
    candle7Days,
    candle30Days,
  ];

  // Non-consumable products
  static const List<String> nonConsumableIds = [lifetime];
}

/// Candle duration constants
class CandleDurations {
  CandleDurations._();

  static const int oneDay = 24;
  static const int threeDays = 72;
  static const int sevenDays = 168;
  static const int thirtyDays = 720;
}

/// Prayer categories
class PrayerCategories {
  PrayerCategories._();

  static const String health = 'HEALTH';
  static const String family = 'FAMILY';
  static const String work = 'WORK';
  static const String finances = 'FINANCES';
  static const String relationships = 'RELATIONSHIPS';
  static const String grief = 'GRIEF';
  static const String thanksgiving = 'THANKSGIVING';
  static const String spiritual = 'SPIRITUAL';
  static const String world = 'WORLD';
  static const String other = 'OTHER';

  static const List<String> all = [
    health,
    family,
    work,
    finances,
    relationships,
    grief,
    thanksgiving,
    spiritual,
    world,
    other,
  ];

  static String getDisplayName(String category) {
    switch (category) {
      case health:
        return 'Health & Healing';
      case family:
        return 'Family';
      case work:
        return 'Work & Career';
      case finances:
        return 'Finances';
      case relationships:
        return 'Relationships';
      case grief:
        return 'Grief & Loss';
      case thanksgiving:
        return 'Thanksgiving';
      case spiritual:
        return 'Spiritual Growth';
      case world:
        return 'World & Peace';
      case other:
        return 'Other';
      default:
        return category;
    }
  }

  static String getIcon(String category) {
    switch (category) {
      case health:
        return '❤️';
      case family:
        return '👨‍👩‍👧‍👦';
      case work:
        return '💼';
      case finances:
        return '💰';
      case relationships:
        return '🤝';
      case grief:
        return '🕊️';
      case thanksgiving:
        return '🙏';
      case spiritual:
        return '✨';
      case world:
        return '🌍';
      case other:
        return '📿';
      default:
        return '🙏';
    }
  }
}
