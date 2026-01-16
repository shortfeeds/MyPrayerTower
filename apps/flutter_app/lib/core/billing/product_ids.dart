class ProductIds {
  // Mass Offerings
  static const String massSingle = 'mass_single';
  static const String massNovena = 'mass_novena';
  static const String massPerpetual = 'mass_perpetual';
  static const String massGregorian = 'mass_gregorian';

  // Candles (5 tiers matching web app)
  static const String candle30Day = 'candle_30d';
  static const String candle14Day = 'candle_14d'; // NEW
  static const String candle7Day = 'candle_7d';
  static const String candle3Day = 'candle_3d';

  static const Set<String> subscriptions = {};

  static const Set<String> allProducts = {
    massSingle,
    massNovena,
    massPerpetual,
    massGregorian,
    candle30Day,
    candle14Day, // Added to set
    candle7Day,
    candle3Day,
  };
}
