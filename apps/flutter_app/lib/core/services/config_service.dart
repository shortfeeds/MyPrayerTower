import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Remote configuration service for app settings
class ConfigService {
  final SupabaseClient _supabase;

  ConfigService(this._supabase);

  /// Fetch app configuration from database
  Future<AppConfig> getAppConfig() async {
    try {
      // Fetch from unified AppSettings table
      final response = await _supabase
          .from('AppSettings')
          .select('*')
          .eq('id', 'app_settings')
          .single();

      return AppConfig.fromJson(response);
    } catch (e) {
      // Return defaults on error
      return AppConfig.defaults();
    }
  }

  /// Subscribe to real-time config changes
  Stream<AppConfig> streamAppConfig() {
    return _supabase
        .from('AppSettings')
        .stream(primaryKey: ['id'])
        .eq('id', 'app_settings')
        .map((data) {
          if (data.isEmpty) return AppConfig.defaults();
          return AppConfig.fromJson(data.first);
        });
  }

  /// Fetch subscription plans from database (Legacy or keep separate if complex)
  /// For now we map prices from AppSettings to simplistic plans
  Future<List<SubscriptionPlan>> getSubscriptionPlans() async {
    try {
      final config = await getAppConfig();
      return [
        SubscriptionPlan(
          id: 'plus_monthly',
          name: 'Plus Subscription - Monthly',
          price: config.plusMonthlyPrice / 100,
          interval: 'month',
          features: ['Ad-free', 'Daily readings', 'Prayer tracking'],
        ),
        SubscriptionPlan(
          id: 'premium_monthly',
          name: 'Premium Subscription - Monthly',
          price: config.premiumMonthlyPrice / 100,
          interval: 'month',
          features: [
            'All Plus features',
            'Virtual candles',
            'Exclusive content',
          ],
        ),
        SubscriptionPlan(
          id: 'premium_yearly',
          name: 'Premium Subscription - Yearly',
          price: config.premiumYearlyPrice / 100,
          interval: 'year',
          features: ['All Premium features', '2 months free'],
        ),
      ];
    } catch (e) {
      return SubscriptionPlan.defaults();
    }
  }

  /// Get feature flags from AppSettings
  Future<Map<String, bool>> getFeatureFlags() async {
    final config = await getAppConfig();
    return {
      'maintenance_mode': config.maintenanceMode,
      'registration_enabled': config.registrationEnabled,
      'prayer_wall_enabled': config.prayerWallEnabled,
      'candles_enabled': config.candlesEnabled,
      'mass_offerings_enabled': config.massOfferingsEnabled,
      'donations_enabled': config.donationsEnabled,
      'spiritual_bouquets_enabled': config.spiritualBouquetsEnabled,
      'challenges_enabled': config.challengesEnabled,
      'leaderboard_enabled': config.leaderboardEnabled,
      'native_ads_enabled': config.nativeAdsEnabled,
      'rewarded_ads_enabled': config.rewardedAdsEnabled,

      // New Features
      'rosary_enabled': config.rosaryEnabled,
      'bible_enabled': config.bibleEnabled,
      'daily_readings_enabled': config.dailyReadingsEnabled,
      'confession_guide_enabled': config.confessionGuideEnabled,
      'examen_enabled': config.examenEnabled,
      'stations_of_cross_enabled': config.stationsOfCrossEnabled,
      'novenas_enabled': config.novenasEnabled,
      'catechism_enabled': config.catechismEnabled,
      'library_enabled': config.libraryEnabled,
      'liturgical_calendar_enabled': config.liturgicalCalendarEnabled,
      'quiz_enabled': config.quizEnabled,
      'saint_of_the_day_enabled': config.saintOfTheDayEnabled,
    };
  }
}

/// App configuration model matching unified AppSettings
class AppConfig {
  final String siteName;
  final bool maintenanceMode;
  final bool registrationEnabled;
  final bool prayerWallEnabled;
  final bool candlesEnabled;
  final bool massOfferingsEnabled;
  final bool donationsEnabled;
  final bool spiritualBouquetsEnabled;
  final bool challengesEnabled;
  final bool leaderboardEnabled;
  final bool nativeAdsEnabled;
  final bool rewardedAdsEnabled;

  // New Features
  final bool rosaryEnabled;
  final bool bibleEnabled;
  final bool dailyReadingsEnabled;
  final bool confessionGuideEnabled;
  final bool examenEnabled;
  final bool stationsOfCrossEnabled;
  final bool novenasEnabled;
  final bool catechismEnabled;
  final bool libraryEnabled;
  final bool liturgicalCalendarEnabled;
  final bool quizEnabled;
  final bool saintOfTheDayEnabled;

  // Pricing (in cents)
  final int plusMonthlyPrice;
  final int plusYearlyPrice;
  final int premiumMonthlyPrice;
  final int premiumYearlyPrice;
  final int lifetimePrice;

  final int candleOneDayPrice;
  final int candleThreeDayPrice;
  final int candleSevenDayPrice;
  final int candleThirtyDayPrice;

  final int massRegularPrice;
  final int massExpeditedPrice;
  final int massNovenaPrice;
  final int massGregorianPrice;
  final int massPerpetualPrice;

  final int bouquetBasePrice;
  final int bouquetMassAddOn;
  final int bouquetCandleAddOn;

  AppConfig({
    required this.siteName,
    required this.maintenanceMode,
    required this.registrationEnabled,
    required this.prayerWallEnabled,
    required this.candlesEnabled,
    required this.massOfferingsEnabled,
    required this.donationsEnabled,
    required this.spiritualBouquetsEnabled,
    required this.challengesEnabled,
    required this.leaderboardEnabled,
    required this.nativeAdsEnabled,
    required this.rewardedAdsEnabled,

    // New Features
    required this.rosaryEnabled,
    required this.bibleEnabled,
    required this.dailyReadingsEnabled,
    required this.confessionGuideEnabled,
    required this.examenEnabled,
    required this.stationsOfCrossEnabled,
    required this.novenasEnabled,
    required this.catechismEnabled,
    required this.libraryEnabled,
    required this.liturgicalCalendarEnabled,
    required this.quizEnabled,
    required this.saintOfTheDayEnabled,

    required this.plusMonthlyPrice,
    required this.plusYearlyPrice,
    required this.premiumMonthlyPrice,
    required this.premiumYearlyPrice,
    required this.lifetimePrice,

    required this.candleOneDayPrice,
    required this.candleThreeDayPrice,
    required this.candleSevenDayPrice,
    required this.candleThirtyDayPrice,

    required this.massRegularPrice,
    required this.massExpeditedPrice,
    required this.massNovenaPrice,
    required this.massGregorianPrice,
    required this.massPerpetualPrice,

    required this.bouquetBasePrice,
    required this.bouquetMassAddOn,
    required this.bouquetCandleAddOn,
  });

  factory AppConfig.fromJson(Map<String, dynamic> json) {
    return AppConfig(
      siteName: json['siteName'] ?? 'MyPrayerTower',
      maintenanceMode: json['maintenanceMode'] ?? false,
      registrationEnabled: json['registrationEnabled'] ?? true,
      prayerWallEnabled: json['prayerWallEnabled'] ?? true,
      candlesEnabled: json['candlesEnabled'] ?? true,
      massOfferingsEnabled: json['massOfferingsEnabled'] ?? true,
      donationsEnabled: json['donationsEnabled'] ?? true,
      spiritualBouquetsEnabled: json['spiritualBouquetsEnabled'] ?? true,
      challengesEnabled: json['challengesEnabled'] ?? true,
      leaderboardEnabled: json['leaderboardEnabled'] ?? true,
      nativeAdsEnabled: json['nativeAdsEnabled'] ?? true,
      rewardedAdsEnabled: json['rewardedAdsEnabled'] ?? true,

      // New Features
      rosaryEnabled: json['rosaryEnabled'] ?? true,
      bibleEnabled: json['bibleEnabled'] ?? true,
      dailyReadingsEnabled: json['dailyReadingsEnabled'] ?? true,
      confessionGuideEnabled: json['confessionGuideEnabled'] ?? true,
      examenEnabled: json['examenEnabled'] ?? true,
      stationsOfCrossEnabled: json['stationsOfCrossEnabled'] ?? true,
      novenasEnabled: json['novenasEnabled'] ?? true,
      catechismEnabled: json['catechismEnabled'] ?? true,
      libraryEnabled: json['libraryEnabled'] ?? true,
      liturgicalCalendarEnabled: json['liturgicalCalendarEnabled'] ?? true,
      quizEnabled: json['quizEnabled'] ?? true,
      saintOfTheDayEnabled: json['saintOfTheDayEnabled'] ?? true,

      plusMonthlyPrice: json['plusMonthlyPrice'] ?? 499,
      plusYearlyPrice: json['plusYearlyPrice'] ?? 3999,
      premiumMonthlyPrice: json['premiumMonthlyPrice'] ?? 999,
      premiumYearlyPrice: json['premiumYearlyPrice'] ?? 7999,
      lifetimePrice: json['lifetimePrice'] ?? 14999,

      candleOneDayPrice: json['candleOneDayPrice'] ?? 100,
      candleThreeDayPrice: json['candleThreeDayPrice'] ?? 300,
      candleSevenDayPrice: json['candleSevenDayPrice'] ?? 500,
      candleThirtyDayPrice: json['candleThirtyDayPrice'] ?? 1500,

      massRegularPrice: json['massRegularPrice'] ?? 1500,
      massExpeditedPrice: json['massExpeditedPrice'] ?? 2500,
      massNovenaPrice: json['massNovenaPrice'] ?? 7500,
      massGregorianPrice: json['massGregorianPrice'] ?? 25000,
      massPerpetualPrice: json['massPerpetualPrice'] ?? 10000,

      bouquetBasePrice: json['bouquetBasePrice'] ?? 1000,
      bouquetMassAddOn: json['bouquetMassAddOn'] ?? 500,
      bouquetCandleAddOn: json['bouquetCandleAddOn'] ?? 200,
    );
  }

  factory AppConfig.defaults() {
    return AppConfig(
      siteName: 'MyPrayerTower',
      maintenanceMode: false,
      registrationEnabled: true,
      prayerWallEnabled: true,
      candlesEnabled: true,
      massOfferingsEnabled: true,
      donationsEnabled: true,
      spiritualBouquetsEnabled: true,
      challengesEnabled: true,
      leaderboardEnabled: true,
      nativeAdsEnabled: true,
      rewardedAdsEnabled: true,

      // New Features
      rosaryEnabled: true,
      bibleEnabled: true,
      dailyReadingsEnabled: true,
      confessionGuideEnabled: true,
      examenEnabled: true,
      stationsOfCrossEnabled: true,
      novenasEnabled: true,
      catechismEnabled: true,
      libraryEnabled: true,
      liturgicalCalendarEnabled: true,
      quizEnabled: true,
      saintOfTheDayEnabled: true,

      plusMonthlyPrice: 499,
      plusYearlyPrice: 3999,
      premiumMonthlyPrice: 999,
      premiumYearlyPrice: 7999,
      lifetimePrice: 14999,

      candleOneDayPrice: 0,
      candleThreeDayPrice: 300,
      candleSevenDayPrice: 500,
      candleThirtyDayPrice: 1500,

      massRegularPrice: 1500,
      massExpeditedPrice: 2000,
      massNovenaPrice: 5000,
      massGregorianPrice: 15000,
      massPerpetualPrice: 10000,

      bouquetBasePrice: 1000,
      bouquetMassAddOn: 500,
      bouquetCandleAddOn: 200,
    );
  }
}

// Retaining simplified models for compatibility
class DonationTier {
  final String id;
  final String name;
  final String icon;
  final double amount;
  final String? description;
  final bool isPopular;

  DonationTier({
    required this.id,
    required this.name,
    required this.icon,
    required this.amount,
    this.description,
    this.isPopular = false,
  });

  // Keep static defaults as we aren't managing donation tiers in admin anymore per request
  static List<DonationTier> defaults() {
    return [
      DonationTier(id: '1', name: 'Candle', icon: '🕯️', amount: 10),
      DonationTier(id: '2', name: 'Rosary', icon: '📿', amount: 20),
      DonationTier(
        id: '3',
        name: 'Supporter',
        icon: '🙏',
        amount: 50,
        isPopular: true,
      ),
      DonationTier(id: '4', name: 'Guardian', icon: '⛪', amount: 100),
      DonationTier(id: '5', name: 'Benefactor', icon: '✨', amount: 250),
      DonationTier(id: '6', name: 'Patron', icon: '👑', amount: 500),
    ];
  }
}

class SubscriptionPlan {
  final String id;
  final String name;
  final double price;
  final String interval;
  final List<String> features;

  SubscriptionPlan({
    required this.id,
    required this.name,
    required this.price,
    required this.interval,
    required this.features,
  });

  static List<SubscriptionPlan> defaults() {
    return []; // Handled by config mapping now
  }
}

/// Provider for ConfigService
final configServiceProvider = Provider<ConfigService>((ref) {
  return ConfigService(Supabase.instance.client);
});

/// Provider for app config (streamed)
final appConfigProvider = StreamProvider<AppConfig>((ref) {
  return ref.watch(configServiceProvider).streamAppConfig();
});

/// Provider for feature flags (derived)
final featureFlagsProvider = Provider<Map<String, bool>>((ref) {
  final configAsync = ref.watch(appConfigProvider);
  return configAsync.when(
    data: (config) => {
      'maintenance_mode': config.maintenanceMode,
      'registration_enabled': config.registrationEnabled,
      'prayer_wall_enabled': config.prayerWallEnabled,
      'candles_enabled': config.candlesEnabled,
      'mass_offerings_enabled': config.massOfferingsEnabled,
      'donations_enabled': config.donationsEnabled,
      'spiritual_bouquets_enabled': config.spiritualBouquetsEnabled,
      'challenges_enabled': config.challengesEnabled,
      'leaderboard_enabled': config.leaderboardEnabled,
      'native_ads_enabled': config.nativeAdsEnabled,
      'rewarded_ads_enabled': config.rewardedAdsEnabled,

      // New Features
      'rosary_enabled': config.rosaryEnabled,
      'bible_enabled': config.bibleEnabled,
      'daily_readings_enabled': config.dailyReadingsEnabled,
      'confession_guide_enabled': config.confessionGuideEnabled,
      'examen_enabled': config.examenEnabled,
      'stations_of_cross_enabled': config.stationsOfCrossEnabled,
      'novenas_enabled': config.novenasEnabled,
      'catechism_enabled': config.catechismEnabled,
      'library_enabled': config.libraryEnabled,
      'liturgical_calendar_enabled': config.liturgicalCalendarEnabled,
      'quiz_enabled': config.quizEnabled,
      'saint_of_the_day_enabled': config.saintOfTheDayEnabled,
    },
    loading: () => {
      /* return safe defaults while loading */
      'prayer_wall_enabled': true,
      'candles_enabled': true,
      'mass_offerings_enabled': true,
    },
    error: (_, __) => Map<String, bool>.from({}),
  );
});

/// Helper to check if a feature is enabled
bool isFeatureEnabled(
  Map<String, bool>? flags,
  String key, {
  bool defaultValue = true,
}) {
  if (flags == null) return defaultValue;
  return flags[key] ?? defaultValue;
}
