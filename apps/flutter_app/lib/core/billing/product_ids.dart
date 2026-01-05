/// Google Play Store Product IDs
/// These IDs must match exactly what you configure in Google Play Console
class ProductIds {
  ProductIds._();

  // === SUBSCRIPTIONS ===
  static const String plusMonthly = 'plus_monthly';
  static const String plusYearly = 'plus_yearly';
  static const String premiumMonthly = 'premium_monthly';
  static const String premiumYearly = 'premium_yearly';
  static const String lifetime = 'lifetime_access';

  // === VIRTUAL CANDLES (Consumables) ===
  static const String candle1Day = 'candle_1day';
  static const String candle3Day = 'candle_3day';
  static const String candle7Day = 'candle_7day';
  static const String candle30Day = 'candle_30day';

  // === MASS OFFERINGS (Consumables) ===
  static const String massRegular = 'mass_regular';
  static const String massExpedited = 'mass_expedited';
  static const String massNovena = 'mass_novena';
  static const String massGregorian = 'mass_gregorian';
  static const String massPerpetual = 'mass_perpetual';

  // === DONATIONS (Consumables) ===
  static const String donation10 = 'donation_10';
  static const String donation20 = 'donation_20';
  static const String donation50 = 'donation_50';
  static const String donation100 = 'donation_100';
  static const String donation250 = 'donation_250';
  static const String donation500 = 'donation_500';

  // === SPIRITUAL BOUQUETS (Consumables) ===
  static const String bouquetBase = 'bouquet_base';
  static const String bouquetWithMass = 'bouquet_with_mass';
  static const String bouquetWithCandle = 'bouquet_with_candle';
  static const String bouquetPremium = 'bouquet_premium';

  // === Product Sets for Querying ===

  /// All subscription product IDs
  static Set<String> get subscriptions => {
    plusMonthly,
    plusYearly,
    premiumMonthly,
    premiumYearly,
    lifetime,
  };

  /// All candle product IDs
  static Set<String> get candles => {
    // candle1Day is free, handled internally
    candle3Day,
    candle7Day,
    candle30Day,
  };

  /// All mass offering product IDs
  static Set<String> get massOfferings => {
    massRegular,
    massExpedited,
    massNovena,
    massGregorian,
    massPerpetual,
  };

  /// All donation product IDs
  static Set<String> get donations => {
    donation10,
    donation20,
    donation50,
    donation100,
    donation250,
    donation500,
  };

  /// All spiritual bouquet product IDs
  static Set<String> get bouquets => {
    bouquetBase,
    bouquetWithMass,
    bouquetWithCandle,
    bouquetPremium,
  };

  /// All consumable product IDs
  static Set<String> get allConsumables => {
    ...candles,
    ...massOfferings,
    ...donations,
    ...bouquets,
  };

  /// All product IDs
  static Set<String> get all => {...subscriptions, ...allConsumables};

  /// Get display name for product ID
  static String getDisplayName(String productId) {
    switch (productId) {
      // Subscriptions
      case plusMonthly:
        return 'Plus Subscription - Monthly';
      case plusYearly:
        return 'Plus Subscription - Yearly';
      case premiumMonthly:
        return 'Premium Subscription - Monthly';
      case premiumYearly:
        return 'Premium Subscription - Yearly';
      case lifetime:
        return 'Lifetime Access';

      // Candles
      case candle1Day:
        return '1-Day Candle';
      case candle3Day:
        return '3-Day Candle';
      case candle7Day:
        return '7-Day Candle';
      case candle30Day:
        return '30-Day Featured Candle';

      // Mass Offerings
      case massRegular:
        return 'Regular Mass Offering';
      case massExpedited:
        return 'Expedited Mass Offering';
      case massNovena:
        return 'Novena Masses';
      case massGregorian:
        return 'Gregorian Masses';
      case massPerpetual:
        return 'Perpetual Enrollment';

      // Donations
      case donation10:
        return 'Candle Donation';
      case donation20:
        return 'Rosary Donation';
      case donation50:
        return 'Supporter Donation';
      case donation100:
        return 'Guardian Donation';
      case donation250:
        return 'Benefactor Donation';
      case donation500:
        return 'Patron Donation';

      // Bouquets
      case bouquetBase:
        return 'Spiritual Bouquet';
      case bouquetWithMass:
        return 'Bouquet with Mass';
      case bouquetWithCandle:
        return 'Bouquet with Candle';
      case bouquetPremium:
        return 'Premium Bouquet';

      default:
        return productId;
    }
  }
}
