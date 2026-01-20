// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_settings_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AppSettingsImpl _$$AppSettingsImplFromJson(
  Map<String, dynamic> json,
) => _$AppSettingsImpl(
  id: json['id'] as String,
  siteName: json['siteName'] as String? ?? "MyPrayerTower",
  siteTagline: json['siteTagline'] as String? ?? "All-in-One Catholic Services",
  maintenanceMode: json['maintenanceMode'] as bool? ?? false,
  registrationEnabled: json['registrationEnabled'] as bool? ?? true,
  prayerWallEnabled: json['prayerWallEnabled'] as bool? ?? true,
  syncEnabled: json['syncEnabled'] as bool? ?? true,
  plusMonthlyPrice: (json['plusMonthlyPrice'] as num?)?.toInt() ?? 499,
  plusYearlyPrice: (json['plusYearlyPrice'] as num?)?.toInt() ?? 3999,
  premiumMonthlyPrice: (json['premiumMonthlyPrice'] as num?)?.toInt() ?? 999,
  premiumYearlyPrice: (json['premiumYearlyPrice'] as num?)?.toInt() ?? 7999,
  lifetimePrice: (json['lifetimePrice'] as num?)?.toInt() ?? 14999,
  candleOneDayPrice: (json['candleOneDayPrice'] as num?)?.toInt() ?? 0,
  candleThreeDayPrice: (json['candleThreeDayPrice'] as num?)?.toInt() ?? 299,
  candleSevenDayPrice: (json['candleSevenDayPrice'] as num?)?.toInt() ?? 599,
  candleThirtyDayPrice: (json['candleThirtyDayPrice'] as num?)?.toInt() ?? 1499,
  massRegularPrice: (json['massRegularPrice'] as num?)?.toInt() ?? 1000,
  massExpeditedPrice: (json['massExpeditedPrice'] as num?)?.toInt() ?? 2500,
  massNovenaPrice: (json['massNovenaPrice'] as num?)?.toInt() ?? 7500,
  massGregorianPrice: (json['massGregorianPrice'] as num?)?.toInt() ?? 20000,
  massPerpetualPrice: (json['massPerpetualPrice'] as num?)?.toInt() ?? 10000,
  bouquetBasePrice: (json['bouquetBasePrice'] as num?)?.toInt() ?? 1000,
  bouquetMassAddOn: (json['bouquetMassAddOn'] as num?)?.toInt() ?? 500,
);

Map<String, dynamic> _$$AppSettingsImplToJson(_$AppSettingsImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'siteName': instance.siteName,
      'siteTagline': instance.siteTagline,
      'maintenanceMode': instance.maintenanceMode,
      'registrationEnabled': instance.registrationEnabled,
      'prayerWallEnabled': instance.prayerWallEnabled,
      'syncEnabled': instance.syncEnabled,
      'plusMonthlyPrice': instance.plusMonthlyPrice,
      'plusYearlyPrice': instance.plusYearlyPrice,
      'premiumMonthlyPrice': instance.premiumMonthlyPrice,
      'premiumYearlyPrice': instance.premiumYearlyPrice,
      'lifetimePrice': instance.lifetimePrice,
      'candleOneDayPrice': instance.candleOneDayPrice,
      'candleThreeDayPrice': instance.candleThreeDayPrice,
      'candleSevenDayPrice': instance.candleSevenDayPrice,
      'candleThirtyDayPrice': instance.candleThirtyDayPrice,
      'massRegularPrice': instance.massRegularPrice,
      'massExpeditedPrice': instance.massExpeditedPrice,
      'massNovenaPrice': instance.massNovenaPrice,
      'massGregorianPrice': instance.massGregorianPrice,
      'massPerpetualPrice': instance.massPerpetualPrice,
      'bouquetBasePrice': instance.bouquetBasePrice,
      'bouquetMassAddOn': instance.bouquetMassAddOn,
    };
