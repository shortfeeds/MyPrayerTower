// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'app_settings_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

AppSettings _$AppSettingsFromJson(Map<String, dynamic> json) {
  return _AppSettings.fromJson(json);
}

/// @nodoc
mixin _$AppSettings {
  String get id => throw _privateConstructorUsedError;
  String get siteName => throw _privateConstructorUsedError;
  String get siteTagline => throw _privateConstructorUsedError; // System
  bool get maintenanceMode => throw _privateConstructorUsedError;
  bool get registrationEnabled => throw _privateConstructorUsedError;
  bool get prayerWallEnabled => throw _privateConstructorUsedError;
  bool get syncEnabled =>
      throw _privateConstructorUsedError; // Subscription Pricing (cents)
  int get plusMonthlyPrice => throw _privateConstructorUsedError;
  int get plusYearlyPrice => throw _privateConstructorUsedError;
  int get premiumMonthlyPrice => throw _privateConstructorUsedError;
  int get premiumYearlyPrice => throw _privateConstructorUsedError;
  int get lifetimePrice => throw _privateConstructorUsedError; // Candle Pricing
  int get candleOneDayPrice => throw _privateConstructorUsedError;
  int get candleThreeDayPrice => throw _privateConstructorUsedError;
  int get candleSevenDayPrice => throw _privateConstructorUsedError;
  int get candleThirtyDayPrice =>
      throw _privateConstructorUsedError; // Mass Offering Pricing
  int get massRegularPrice => throw _privateConstructorUsedError;
  int get massExpeditedPrice => throw _privateConstructorUsedError;
  int get massNovenaPrice => throw _privateConstructorUsedError;
  int get massGregorianPrice => throw _privateConstructorUsedError;
  int get massPerpetualPrice => throw _privateConstructorUsedError; // Bouquet
  int get bouquetBasePrice => throw _privateConstructorUsedError;
  int get bouquetMassAddOn => throw _privateConstructorUsedError;

  /// Serializes this AppSettings to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AppSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AppSettingsCopyWith<AppSettings> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AppSettingsCopyWith<$Res> {
  factory $AppSettingsCopyWith(
    AppSettings value,
    $Res Function(AppSettings) then,
  ) = _$AppSettingsCopyWithImpl<$Res, AppSettings>;
  @useResult
  $Res call({
    String id,
    String siteName,
    String siteTagline,
    bool maintenanceMode,
    bool registrationEnabled,
    bool prayerWallEnabled,
    bool syncEnabled,
    int plusMonthlyPrice,
    int plusYearlyPrice,
    int premiumMonthlyPrice,
    int premiumYearlyPrice,
    int lifetimePrice,
    int candleOneDayPrice,
    int candleThreeDayPrice,
    int candleSevenDayPrice,
    int candleThirtyDayPrice,
    int massRegularPrice,
    int massExpeditedPrice,
    int massNovenaPrice,
    int massGregorianPrice,
    int massPerpetualPrice,
    int bouquetBasePrice,
    int bouquetMassAddOn,
  });
}

/// @nodoc
class _$AppSettingsCopyWithImpl<$Res, $Val extends AppSettings>
    implements $AppSettingsCopyWith<$Res> {
  _$AppSettingsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AppSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? siteName = null,
    Object? siteTagline = null,
    Object? maintenanceMode = null,
    Object? registrationEnabled = null,
    Object? prayerWallEnabled = null,
    Object? syncEnabled = null,
    Object? plusMonthlyPrice = null,
    Object? plusYearlyPrice = null,
    Object? premiumMonthlyPrice = null,
    Object? premiumYearlyPrice = null,
    Object? lifetimePrice = null,
    Object? candleOneDayPrice = null,
    Object? candleThreeDayPrice = null,
    Object? candleSevenDayPrice = null,
    Object? candleThirtyDayPrice = null,
    Object? massRegularPrice = null,
    Object? massExpeditedPrice = null,
    Object? massNovenaPrice = null,
    Object? massGregorianPrice = null,
    Object? massPerpetualPrice = null,
    Object? bouquetBasePrice = null,
    Object? bouquetMassAddOn = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            siteName: null == siteName
                ? _value.siteName
                : siteName // ignore: cast_nullable_to_non_nullable
                      as String,
            siteTagline: null == siteTagline
                ? _value.siteTagline
                : siteTagline // ignore: cast_nullable_to_non_nullable
                      as String,
            maintenanceMode: null == maintenanceMode
                ? _value.maintenanceMode
                : maintenanceMode // ignore: cast_nullable_to_non_nullable
                      as bool,
            registrationEnabled: null == registrationEnabled
                ? _value.registrationEnabled
                : registrationEnabled // ignore: cast_nullable_to_non_nullable
                      as bool,
            prayerWallEnabled: null == prayerWallEnabled
                ? _value.prayerWallEnabled
                : prayerWallEnabled // ignore: cast_nullable_to_non_nullable
                      as bool,
            syncEnabled: null == syncEnabled
                ? _value.syncEnabled
                : syncEnabled // ignore: cast_nullable_to_non_nullable
                      as bool,
            plusMonthlyPrice: null == plusMonthlyPrice
                ? _value.plusMonthlyPrice
                : plusMonthlyPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            plusYearlyPrice: null == plusYearlyPrice
                ? _value.plusYearlyPrice
                : plusYearlyPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            premiumMonthlyPrice: null == premiumMonthlyPrice
                ? _value.premiumMonthlyPrice
                : premiumMonthlyPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            premiumYearlyPrice: null == premiumYearlyPrice
                ? _value.premiumYearlyPrice
                : premiumYearlyPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            lifetimePrice: null == lifetimePrice
                ? _value.lifetimePrice
                : lifetimePrice // ignore: cast_nullable_to_non_nullable
                      as int,
            candleOneDayPrice: null == candleOneDayPrice
                ? _value.candleOneDayPrice
                : candleOneDayPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            candleThreeDayPrice: null == candleThreeDayPrice
                ? _value.candleThreeDayPrice
                : candleThreeDayPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            candleSevenDayPrice: null == candleSevenDayPrice
                ? _value.candleSevenDayPrice
                : candleSevenDayPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            candleThirtyDayPrice: null == candleThirtyDayPrice
                ? _value.candleThirtyDayPrice
                : candleThirtyDayPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            massRegularPrice: null == massRegularPrice
                ? _value.massRegularPrice
                : massRegularPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            massExpeditedPrice: null == massExpeditedPrice
                ? _value.massExpeditedPrice
                : massExpeditedPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            massNovenaPrice: null == massNovenaPrice
                ? _value.massNovenaPrice
                : massNovenaPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            massGregorianPrice: null == massGregorianPrice
                ? _value.massGregorianPrice
                : massGregorianPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            massPerpetualPrice: null == massPerpetualPrice
                ? _value.massPerpetualPrice
                : massPerpetualPrice // ignore: cast_nullable_to_non_nullable
                      as int,
            bouquetBasePrice: null == bouquetBasePrice
                ? _value.bouquetBasePrice
                : bouquetBasePrice // ignore: cast_nullable_to_non_nullable
                      as int,
            bouquetMassAddOn: null == bouquetMassAddOn
                ? _value.bouquetMassAddOn
                : bouquetMassAddOn // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AppSettingsImplCopyWith<$Res>
    implements $AppSettingsCopyWith<$Res> {
  factory _$$AppSettingsImplCopyWith(
    _$AppSettingsImpl value,
    $Res Function(_$AppSettingsImpl) then,
  ) = __$$AppSettingsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String siteName,
    String siteTagline,
    bool maintenanceMode,
    bool registrationEnabled,
    bool prayerWallEnabled,
    bool syncEnabled,
    int plusMonthlyPrice,
    int plusYearlyPrice,
    int premiumMonthlyPrice,
    int premiumYearlyPrice,
    int lifetimePrice,
    int candleOneDayPrice,
    int candleThreeDayPrice,
    int candleSevenDayPrice,
    int candleThirtyDayPrice,
    int massRegularPrice,
    int massExpeditedPrice,
    int massNovenaPrice,
    int massGregorianPrice,
    int massPerpetualPrice,
    int bouquetBasePrice,
    int bouquetMassAddOn,
  });
}

/// @nodoc
class __$$AppSettingsImplCopyWithImpl<$Res>
    extends _$AppSettingsCopyWithImpl<$Res, _$AppSettingsImpl>
    implements _$$AppSettingsImplCopyWith<$Res> {
  __$$AppSettingsImplCopyWithImpl(
    _$AppSettingsImpl _value,
    $Res Function(_$AppSettingsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AppSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? siteName = null,
    Object? siteTagline = null,
    Object? maintenanceMode = null,
    Object? registrationEnabled = null,
    Object? prayerWallEnabled = null,
    Object? syncEnabled = null,
    Object? plusMonthlyPrice = null,
    Object? plusYearlyPrice = null,
    Object? premiumMonthlyPrice = null,
    Object? premiumYearlyPrice = null,
    Object? lifetimePrice = null,
    Object? candleOneDayPrice = null,
    Object? candleThreeDayPrice = null,
    Object? candleSevenDayPrice = null,
    Object? candleThirtyDayPrice = null,
    Object? massRegularPrice = null,
    Object? massExpeditedPrice = null,
    Object? massNovenaPrice = null,
    Object? massGregorianPrice = null,
    Object? massPerpetualPrice = null,
    Object? bouquetBasePrice = null,
    Object? bouquetMassAddOn = null,
  }) {
    return _then(
      _$AppSettingsImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        siteName: null == siteName
            ? _value.siteName
            : siteName // ignore: cast_nullable_to_non_nullable
                  as String,
        siteTagline: null == siteTagline
            ? _value.siteTagline
            : siteTagline // ignore: cast_nullable_to_non_nullable
                  as String,
        maintenanceMode: null == maintenanceMode
            ? _value.maintenanceMode
            : maintenanceMode // ignore: cast_nullable_to_non_nullable
                  as bool,
        registrationEnabled: null == registrationEnabled
            ? _value.registrationEnabled
            : registrationEnabled // ignore: cast_nullable_to_non_nullable
                  as bool,
        prayerWallEnabled: null == prayerWallEnabled
            ? _value.prayerWallEnabled
            : prayerWallEnabled // ignore: cast_nullable_to_non_nullable
                  as bool,
        syncEnabled: null == syncEnabled
            ? _value.syncEnabled
            : syncEnabled // ignore: cast_nullable_to_non_nullable
                  as bool,
        plusMonthlyPrice: null == plusMonthlyPrice
            ? _value.plusMonthlyPrice
            : plusMonthlyPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        plusYearlyPrice: null == plusYearlyPrice
            ? _value.plusYearlyPrice
            : plusYearlyPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        premiumMonthlyPrice: null == premiumMonthlyPrice
            ? _value.premiumMonthlyPrice
            : premiumMonthlyPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        premiumYearlyPrice: null == premiumYearlyPrice
            ? _value.premiumYearlyPrice
            : premiumYearlyPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        lifetimePrice: null == lifetimePrice
            ? _value.lifetimePrice
            : lifetimePrice // ignore: cast_nullable_to_non_nullable
                  as int,
        candleOneDayPrice: null == candleOneDayPrice
            ? _value.candleOneDayPrice
            : candleOneDayPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        candleThreeDayPrice: null == candleThreeDayPrice
            ? _value.candleThreeDayPrice
            : candleThreeDayPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        candleSevenDayPrice: null == candleSevenDayPrice
            ? _value.candleSevenDayPrice
            : candleSevenDayPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        candleThirtyDayPrice: null == candleThirtyDayPrice
            ? _value.candleThirtyDayPrice
            : candleThirtyDayPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        massRegularPrice: null == massRegularPrice
            ? _value.massRegularPrice
            : massRegularPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        massExpeditedPrice: null == massExpeditedPrice
            ? _value.massExpeditedPrice
            : massExpeditedPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        massNovenaPrice: null == massNovenaPrice
            ? _value.massNovenaPrice
            : massNovenaPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        massGregorianPrice: null == massGregorianPrice
            ? _value.massGregorianPrice
            : massGregorianPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        massPerpetualPrice: null == massPerpetualPrice
            ? _value.massPerpetualPrice
            : massPerpetualPrice // ignore: cast_nullable_to_non_nullable
                  as int,
        bouquetBasePrice: null == bouquetBasePrice
            ? _value.bouquetBasePrice
            : bouquetBasePrice // ignore: cast_nullable_to_non_nullable
                  as int,
        bouquetMassAddOn: null == bouquetMassAddOn
            ? _value.bouquetMassAddOn
            : bouquetMassAddOn // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AppSettingsImpl implements _AppSettings {
  const _$AppSettingsImpl({
    required this.id,
    this.siteName = "MyPrayerTower",
    this.siteTagline = "All-in-One Catholic Services",
    this.maintenanceMode = false,
    this.registrationEnabled = true,
    this.prayerWallEnabled = true,
    this.syncEnabled = true,
    this.plusMonthlyPrice = 499,
    this.plusYearlyPrice = 3999,
    this.premiumMonthlyPrice = 999,
    this.premiumYearlyPrice = 7999,
    this.lifetimePrice = 14999,
    this.candleOneDayPrice = 0,
    this.candleThreeDayPrice = 299,
    this.candleSevenDayPrice = 599,
    this.candleThirtyDayPrice = 1499,
    this.massRegularPrice = 1000,
    this.massExpeditedPrice = 2500,
    this.massNovenaPrice = 7500,
    this.massGregorianPrice = 20000,
    this.massPerpetualPrice = 10000,
    this.bouquetBasePrice = 1000,
    this.bouquetMassAddOn = 500,
  });

  factory _$AppSettingsImpl.fromJson(Map<String, dynamic> json) =>
      _$$AppSettingsImplFromJson(json);

  @override
  final String id;
  @override
  @JsonKey()
  final String siteName;
  @override
  @JsonKey()
  final String siteTagline;
  // System
  @override
  @JsonKey()
  final bool maintenanceMode;
  @override
  @JsonKey()
  final bool registrationEnabled;
  @override
  @JsonKey()
  final bool prayerWallEnabled;
  @override
  @JsonKey()
  final bool syncEnabled;
  // Subscription Pricing (cents)
  @override
  @JsonKey()
  final int plusMonthlyPrice;
  @override
  @JsonKey()
  final int plusYearlyPrice;
  @override
  @JsonKey()
  final int premiumMonthlyPrice;
  @override
  @JsonKey()
  final int premiumYearlyPrice;
  @override
  @JsonKey()
  final int lifetimePrice;
  // Candle Pricing
  @override
  @JsonKey()
  final int candleOneDayPrice;
  @override
  @JsonKey()
  final int candleThreeDayPrice;
  @override
  @JsonKey()
  final int candleSevenDayPrice;
  @override
  @JsonKey()
  final int candleThirtyDayPrice;
  // Mass Offering Pricing
  @override
  @JsonKey()
  final int massRegularPrice;
  @override
  @JsonKey()
  final int massExpeditedPrice;
  @override
  @JsonKey()
  final int massNovenaPrice;
  @override
  @JsonKey()
  final int massGregorianPrice;
  @override
  @JsonKey()
  final int massPerpetualPrice;
  // Bouquet
  @override
  @JsonKey()
  final int bouquetBasePrice;
  @override
  @JsonKey()
  final int bouquetMassAddOn;

  @override
  String toString() {
    return 'AppSettings(id: $id, siteName: $siteName, siteTagline: $siteTagline, maintenanceMode: $maintenanceMode, registrationEnabled: $registrationEnabled, prayerWallEnabled: $prayerWallEnabled, syncEnabled: $syncEnabled, plusMonthlyPrice: $plusMonthlyPrice, plusYearlyPrice: $plusYearlyPrice, premiumMonthlyPrice: $premiumMonthlyPrice, premiumYearlyPrice: $premiumYearlyPrice, lifetimePrice: $lifetimePrice, candleOneDayPrice: $candleOneDayPrice, candleThreeDayPrice: $candleThreeDayPrice, candleSevenDayPrice: $candleSevenDayPrice, candleThirtyDayPrice: $candleThirtyDayPrice, massRegularPrice: $massRegularPrice, massExpeditedPrice: $massExpeditedPrice, massNovenaPrice: $massNovenaPrice, massGregorianPrice: $massGregorianPrice, massPerpetualPrice: $massPerpetualPrice, bouquetBasePrice: $bouquetBasePrice, bouquetMassAddOn: $bouquetMassAddOn)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AppSettingsImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.siteName, siteName) ||
                other.siteName == siteName) &&
            (identical(other.siteTagline, siteTagline) ||
                other.siteTagline == siteTagline) &&
            (identical(other.maintenanceMode, maintenanceMode) ||
                other.maintenanceMode == maintenanceMode) &&
            (identical(other.registrationEnabled, registrationEnabled) ||
                other.registrationEnabled == registrationEnabled) &&
            (identical(other.prayerWallEnabled, prayerWallEnabled) ||
                other.prayerWallEnabled == prayerWallEnabled) &&
            (identical(other.syncEnabled, syncEnabled) ||
                other.syncEnabled == syncEnabled) &&
            (identical(other.plusMonthlyPrice, plusMonthlyPrice) ||
                other.plusMonthlyPrice == plusMonthlyPrice) &&
            (identical(other.plusYearlyPrice, plusYearlyPrice) ||
                other.plusYearlyPrice == plusYearlyPrice) &&
            (identical(other.premiumMonthlyPrice, premiumMonthlyPrice) ||
                other.premiumMonthlyPrice == premiumMonthlyPrice) &&
            (identical(other.premiumYearlyPrice, premiumYearlyPrice) ||
                other.premiumYearlyPrice == premiumYearlyPrice) &&
            (identical(other.lifetimePrice, lifetimePrice) ||
                other.lifetimePrice == lifetimePrice) &&
            (identical(other.candleOneDayPrice, candleOneDayPrice) ||
                other.candleOneDayPrice == candleOneDayPrice) &&
            (identical(other.candleThreeDayPrice, candleThreeDayPrice) ||
                other.candleThreeDayPrice == candleThreeDayPrice) &&
            (identical(other.candleSevenDayPrice, candleSevenDayPrice) ||
                other.candleSevenDayPrice == candleSevenDayPrice) &&
            (identical(other.candleThirtyDayPrice, candleThirtyDayPrice) ||
                other.candleThirtyDayPrice == candleThirtyDayPrice) &&
            (identical(other.massRegularPrice, massRegularPrice) ||
                other.massRegularPrice == massRegularPrice) &&
            (identical(other.massExpeditedPrice, massExpeditedPrice) ||
                other.massExpeditedPrice == massExpeditedPrice) &&
            (identical(other.massNovenaPrice, massNovenaPrice) ||
                other.massNovenaPrice == massNovenaPrice) &&
            (identical(other.massGregorianPrice, massGregorianPrice) ||
                other.massGregorianPrice == massGregorianPrice) &&
            (identical(other.massPerpetualPrice, massPerpetualPrice) ||
                other.massPerpetualPrice == massPerpetualPrice) &&
            (identical(other.bouquetBasePrice, bouquetBasePrice) ||
                other.bouquetBasePrice == bouquetBasePrice) &&
            (identical(other.bouquetMassAddOn, bouquetMassAddOn) ||
                other.bouquetMassAddOn == bouquetMassAddOn));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    siteName,
    siteTagline,
    maintenanceMode,
    registrationEnabled,
    prayerWallEnabled,
    syncEnabled,
    plusMonthlyPrice,
    plusYearlyPrice,
    premiumMonthlyPrice,
    premiumYearlyPrice,
    lifetimePrice,
    candleOneDayPrice,
    candleThreeDayPrice,
    candleSevenDayPrice,
    candleThirtyDayPrice,
    massRegularPrice,
    massExpeditedPrice,
    massNovenaPrice,
    massGregorianPrice,
    massPerpetualPrice,
    bouquetBasePrice,
    bouquetMassAddOn,
  ]);

  /// Create a copy of AppSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AppSettingsImplCopyWith<_$AppSettingsImpl> get copyWith =>
      __$$AppSettingsImplCopyWithImpl<_$AppSettingsImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AppSettingsImplToJson(this);
  }
}

abstract class _AppSettings implements AppSettings {
  const factory _AppSettings({
    required final String id,
    final String siteName,
    final String siteTagline,
    final bool maintenanceMode,
    final bool registrationEnabled,
    final bool prayerWallEnabled,
    final bool syncEnabled,
    final int plusMonthlyPrice,
    final int plusYearlyPrice,
    final int premiumMonthlyPrice,
    final int premiumYearlyPrice,
    final int lifetimePrice,
    final int candleOneDayPrice,
    final int candleThreeDayPrice,
    final int candleSevenDayPrice,
    final int candleThirtyDayPrice,
    final int massRegularPrice,
    final int massExpeditedPrice,
    final int massNovenaPrice,
    final int massGregorianPrice,
    final int massPerpetualPrice,
    final int bouquetBasePrice,
    final int bouquetMassAddOn,
  }) = _$AppSettingsImpl;

  factory _AppSettings.fromJson(Map<String, dynamic> json) =
      _$AppSettingsImpl.fromJson;

  @override
  String get id;
  @override
  String get siteName;
  @override
  String get siteTagline; // System
  @override
  bool get maintenanceMode;
  @override
  bool get registrationEnabled;
  @override
  bool get prayerWallEnabled;
  @override
  bool get syncEnabled; // Subscription Pricing (cents)
  @override
  int get plusMonthlyPrice;
  @override
  int get plusYearlyPrice;
  @override
  int get premiumMonthlyPrice;
  @override
  int get premiumYearlyPrice;
  @override
  int get lifetimePrice; // Candle Pricing
  @override
  int get candleOneDayPrice;
  @override
  int get candleThreeDayPrice;
  @override
  int get candleSevenDayPrice;
  @override
  int get candleThirtyDayPrice; // Mass Offering Pricing
  @override
  int get massRegularPrice;
  @override
  int get massExpeditedPrice;
  @override
  int get massNovenaPrice;
  @override
  int get massGregorianPrice;
  @override
  int get massPerpetualPrice; // Bouquet
  @override
  int get bouquetBasePrice;
  @override
  int get bouquetMassAddOn;

  /// Create a copy of AppSettings
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AppSettingsImplCopyWith<_$AppSettingsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
