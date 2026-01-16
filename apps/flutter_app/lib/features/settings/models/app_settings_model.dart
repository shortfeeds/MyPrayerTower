import 'package:freezed_annotation/freezed_annotation.dart';

part 'app_settings_model.freezed.dart';
part 'app_settings_model.g.dart';

@freezed
class AppSettings with _$AppSettings {
  const factory AppSettings({
    required String id,
    @Default("MyPrayerTower") String siteName,
    @Default("All-in-One Catholic Services") String siteTagline,

    // System
    @Default(false) bool maintenanceMode,
    @Default(true) bool registrationEnabled,
    @Default(true) bool prayerWallEnabled,
    @Default(true) bool syncEnabled,

    // Subscription Pricing (cents)
    @Default(499) int plusMonthlyPrice,
    @Default(3999) int plusYearlyPrice,
    @Default(999) int premiumMonthlyPrice,
    @Default(7999) int premiumYearlyPrice,
    @Default(14999) int lifetimePrice,

    // Candle Pricing
    @Default(0) int candleOneDayPrice,
    @Default(299) int candleThreeDayPrice,
    @Default(599) int candleSevenDayPrice,
    @Default(1499) int candleThirtyDayPrice,

    // Mass Offering Pricing
    @Default(1000) int massRegularPrice,
    @Default(2500) int massExpeditedPrice,
    @Default(7500) int massNovenaPrice,
    @Default(20000) int massGregorianPrice,
    @Default(10000) int massPerpetualPrice,

    // Bouquet
    @Default(1000) int bouquetBasePrice,
    @Default(500) int bouquetMassAddOn,
  }) = _AppSettings;

  factory AppSettings.fromJson(Map<String, dynamic> json) =>
      _$AppSettingsFromJson(json);
}
