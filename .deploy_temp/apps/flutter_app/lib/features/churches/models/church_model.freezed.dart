// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'church_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Church _$ChurchFromJson(Map<String, dynamic> json) {
  return _Church.fromJson(json);
}

/// @nodoc
mixin _$Church {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  String get city => throw _privateConstructorUsedError;
  String? get state => throw _privateConstructorUsedError;
  String? get country => throw _privateConstructorUsedError;
  String? get countryCode => throw _privateConstructorUsedError;
  String? get postalCode => throw _privateConstructorUsedError;
  String? get primaryImageUrl => throw _privateConstructorUsedError;
  String? get website => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  String? get email => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  String? get denomination => throw _privateConstructorUsedError;
  String? get dioceseId => throw _privateConstructorUsedError;
  bool get isVerified => throw _privateConstructorUsedError;
  DateTime? get verifiedAt => throw _privateConstructorUsedError;
  String? get claimedBy => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get shortDescription => throw _privateConstructorUsedError;
  String? get history => throw _privateConstructorUsedError;
  String? get virtualTourUrl => throw _privateConstructorUsedError;
  String? get calendarUrl => throw _privateConstructorUsedError;
  String? get externalId => throw _privateConstructorUsedError;
  double? get latitude => throw _privateConstructorUsedError;
  double? get longitude => throw _privateConstructorUsedError;
  Map<String, dynamic>? get massSchedule => throw _privateConstructorUsedError;
  Map<String, dynamic>? get confessionSchedule =>
      throw _privateConstructorUsedError;
  Map<String, dynamic>? get adorationSchedule =>
      throw _privateConstructorUsedError;
  DateTime? get lastSyncedAt => throw _privateConstructorUsedError;
  int get viewCount => throw _privateConstructorUsedError;
  int get followerCount => throw _privateConstructorUsedError;
  @JsonKey(name: 'stripeAccountId')
  String? get stripeAccountId => throw _privateConstructorUsedError;
  @JsonKey(name: 'totalDonations')
  int get totalDonations => throw _privateConstructorUsedError;
  @JsonKey(name: 'donationCount')
  int get donationCount => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this Church to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ChurchCopyWith<Church> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChurchCopyWith<$Res> {
  factory $ChurchCopyWith(Church value, $Res Function(Church) then) =
      _$ChurchCopyWithImpl<$Res, Church>;
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? address,
    String city,
    String? state,
    String? country,
    String? countryCode,
    String? postalCode,
    String? primaryImageUrl,
    String? website,
    String? phone,
    String? email,
    String type,
    String? denomination,
    String? dioceseId,
    bool isVerified,
    DateTime? verifiedAt,
    String? claimedBy,
    String? description,
    String? shortDescription,
    String? history,
    String? virtualTourUrl,
    String? calendarUrl,
    String? externalId,
    double? latitude,
    double? longitude,
    Map<String, dynamic>? massSchedule,
    Map<String, dynamic>? confessionSchedule,
    Map<String, dynamic>? adorationSchedule,
    DateTime? lastSyncedAt,
    int viewCount,
    int followerCount,
    @JsonKey(name: 'stripeAccountId') String? stripeAccountId,
    @JsonKey(name: 'totalDonations') int totalDonations,
    @JsonKey(name: 'donationCount') int donationCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  });
}

/// @nodoc
class _$ChurchCopyWithImpl<$Res, $Val extends Church>
    implements $ChurchCopyWith<$Res> {
  _$ChurchCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? address = freezed,
    Object? city = null,
    Object? state = freezed,
    Object? country = freezed,
    Object? countryCode = freezed,
    Object? postalCode = freezed,
    Object? primaryImageUrl = freezed,
    Object? website = freezed,
    Object? phone = freezed,
    Object? email = freezed,
    Object? type = null,
    Object? denomination = freezed,
    Object? dioceseId = freezed,
    Object? isVerified = null,
    Object? verifiedAt = freezed,
    Object? claimedBy = freezed,
    Object? description = freezed,
    Object? shortDescription = freezed,
    Object? history = freezed,
    Object? virtualTourUrl = freezed,
    Object? calendarUrl = freezed,
    Object? externalId = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? massSchedule = freezed,
    Object? confessionSchedule = freezed,
    Object? adorationSchedule = freezed,
    Object? lastSyncedAt = freezed,
    Object? viewCount = null,
    Object? followerCount = null,
    Object? stripeAccountId = freezed,
    Object? totalDonations = null,
    Object? donationCount = null,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            slug: null == slug
                ? _value.slug
                : slug // ignore: cast_nullable_to_non_nullable
                      as String,
            address: freezed == address
                ? _value.address
                : address // ignore: cast_nullable_to_non_nullable
                      as String?,
            city: null == city
                ? _value.city
                : city // ignore: cast_nullable_to_non_nullable
                      as String,
            state: freezed == state
                ? _value.state
                : state // ignore: cast_nullable_to_non_nullable
                      as String?,
            country: freezed == country
                ? _value.country
                : country // ignore: cast_nullable_to_non_nullable
                      as String?,
            countryCode: freezed == countryCode
                ? _value.countryCode
                : countryCode // ignore: cast_nullable_to_non_nullable
                      as String?,
            postalCode: freezed == postalCode
                ? _value.postalCode
                : postalCode // ignore: cast_nullable_to_non_nullable
                      as String?,
            primaryImageUrl: freezed == primaryImageUrl
                ? _value.primaryImageUrl
                : primaryImageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            website: freezed == website
                ? _value.website
                : website // ignore: cast_nullable_to_non_nullable
                      as String?,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            email: freezed == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String?,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as String,
            denomination: freezed == denomination
                ? _value.denomination
                : denomination // ignore: cast_nullable_to_non_nullable
                      as String?,
            dioceseId: freezed == dioceseId
                ? _value.dioceseId
                : dioceseId // ignore: cast_nullable_to_non_nullable
                      as String?,
            isVerified: null == isVerified
                ? _value.isVerified
                : isVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
            verifiedAt: freezed == verifiedAt
                ? _value.verifiedAt
                : verifiedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            claimedBy: freezed == claimedBy
                ? _value.claimedBy
                : claimedBy // ignore: cast_nullable_to_non_nullable
                      as String?,
            description: freezed == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String?,
            shortDescription: freezed == shortDescription
                ? _value.shortDescription
                : shortDescription // ignore: cast_nullable_to_non_nullable
                      as String?,
            history: freezed == history
                ? _value.history
                : history // ignore: cast_nullable_to_non_nullable
                      as String?,
            virtualTourUrl: freezed == virtualTourUrl
                ? _value.virtualTourUrl
                : virtualTourUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            calendarUrl: freezed == calendarUrl
                ? _value.calendarUrl
                : calendarUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            externalId: freezed == externalId
                ? _value.externalId
                : externalId // ignore: cast_nullable_to_non_nullable
                      as String?,
            latitude: freezed == latitude
                ? _value.latitude
                : latitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitude: freezed == longitude
                ? _value.longitude
                : longitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            massSchedule: freezed == massSchedule
                ? _value.massSchedule
                : massSchedule // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            confessionSchedule: freezed == confessionSchedule
                ? _value.confessionSchedule
                : confessionSchedule // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            adorationSchedule: freezed == adorationSchedule
                ? _value.adorationSchedule
                : adorationSchedule // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            lastSyncedAt: freezed == lastSyncedAt
                ? _value.lastSyncedAt
                : lastSyncedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            viewCount: null == viewCount
                ? _value.viewCount
                : viewCount // ignore: cast_nullable_to_non_nullable
                      as int,
            followerCount: null == followerCount
                ? _value.followerCount
                : followerCount // ignore: cast_nullable_to_non_nullable
                      as int,
            stripeAccountId: freezed == stripeAccountId
                ? _value.stripeAccountId
                : stripeAccountId // ignore: cast_nullable_to_non_nullable
                      as String?,
            totalDonations: null == totalDonations
                ? _value.totalDonations
                : totalDonations // ignore: cast_nullable_to_non_nullable
                      as int,
            donationCount: null == donationCount
                ? _value.donationCount
                : donationCount // ignore: cast_nullable_to_non_nullable
                      as int,
            createdAt: freezed == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            updatedAt: freezed == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ChurchImplCopyWith<$Res> implements $ChurchCopyWith<$Res> {
  factory _$$ChurchImplCopyWith(
    _$ChurchImpl value,
    $Res Function(_$ChurchImpl) then,
  ) = __$$ChurchImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? address,
    String city,
    String? state,
    String? country,
    String? countryCode,
    String? postalCode,
    String? primaryImageUrl,
    String? website,
    String? phone,
    String? email,
    String type,
    String? denomination,
    String? dioceseId,
    bool isVerified,
    DateTime? verifiedAt,
    String? claimedBy,
    String? description,
    String? shortDescription,
    String? history,
    String? virtualTourUrl,
    String? calendarUrl,
    String? externalId,
    double? latitude,
    double? longitude,
    Map<String, dynamic>? massSchedule,
    Map<String, dynamic>? confessionSchedule,
    Map<String, dynamic>? adorationSchedule,
    DateTime? lastSyncedAt,
    int viewCount,
    int followerCount,
    @JsonKey(name: 'stripeAccountId') String? stripeAccountId,
    @JsonKey(name: 'totalDonations') int totalDonations,
    @JsonKey(name: 'donationCount') int donationCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  });
}

/// @nodoc
class __$$ChurchImplCopyWithImpl<$Res>
    extends _$ChurchCopyWithImpl<$Res, _$ChurchImpl>
    implements _$$ChurchImplCopyWith<$Res> {
  __$$ChurchImplCopyWithImpl(
    _$ChurchImpl _value,
    $Res Function(_$ChurchImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? address = freezed,
    Object? city = null,
    Object? state = freezed,
    Object? country = freezed,
    Object? countryCode = freezed,
    Object? postalCode = freezed,
    Object? primaryImageUrl = freezed,
    Object? website = freezed,
    Object? phone = freezed,
    Object? email = freezed,
    Object? type = null,
    Object? denomination = freezed,
    Object? dioceseId = freezed,
    Object? isVerified = null,
    Object? verifiedAt = freezed,
    Object? claimedBy = freezed,
    Object? description = freezed,
    Object? shortDescription = freezed,
    Object? history = freezed,
    Object? virtualTourUrl = freezed,
    Object? calendarUrl = freezed,
    Object? externalId = freezed,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? massSchedule = freezed,
    Object? confessionSchedule = freezed,
    Object? adorationSchedule = freezed,
    Object? lastSyncedAt = freezed,
    Object? viewCount = null,
    Object? followerCount = null,
    Object? stripeAccountId = freezed,
    Object? totalDonations = null,
    Object? donationCount = null,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(
      _$ChurchImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        slug: null == slug
            ? _value.slug
            : slug // ignore: cast_nullable_to_non_nullable
                  as String,
        address: freezed == address
            ? _value.address
            : address // ignore: cast_nullable_to_non_nullable
                  as String?,
        city: null == city
            ? _value.city
            : city // ignore: cast_nullable_to_non_nullable
                  as String,
        state: freezed == state
            ? _value.state
            : state // ignore: cast_nullable_to_non_nullable
                  as String?,
        country: freezed == country
            ? _value.country
            : country // ignore: cast_nullable_to_non_nullable
                  as String?,
        countryCode: freezed == countryCode
            ? _value.countryCode
            : countryCode // ignore: cast_nullable_to_non_nullable
                  as String?,
        postalCode: freezed == postalCode
            ? _value.postalCode
            : postalCode // ignore: cast_nullable_to_non_nullable
                  as String?,
        primaryImageUrl: freezed == primaryImageUrl
            ? _value.primaryImageUrl
            : primaryImageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        website: freezed == website
            ? _value.website
            : website // ignore: cast_nullable_to_non_nullable
                  as String?,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        email: freezed == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String?,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as String,
        denomination: freezed == denomination
            ? _value.denomination
            : denomination // ignore: cast_nullable_to_non_nullable
                  as String?,
        dioceseId: freezed == dioceseId
            ? _value.dioceseId
            : dioceseId // ignore: cast_nullable_to_non_nullable
                  as String?,
        isVerified: null == isVerified
            ? _value.isVerified
            : isVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
        verifiedAt: freezed == verifiedAt
            ? _value.verifiedAt
            : verifiedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        claimedBy: freezed == claimedBy
            ? _value.claimedBy
            : claimedBy // ignore: cast_nullable_to_non_nullable
                  as String?,
        description: freezed == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String?,
        shortDescription: freezed == shortDescription
            ? _value.shortDescription
            : shortDescription // ignore: cast_nullable_to_non_nullable
                  as String?,
        history: freezed == history
            ? _value.history
            : history // ignore: cast_nullable_to_non_nullable
                  as String?,
        virtualTourUrl: freezed == virtualTourUrl
            ? _value.virtualTourUrl
            : virtualTourUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        calendarUrl: freezed == calendarUrl
            ? _value.calendarUrl
            : calendarUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        externalId: freezed == externalId
            ? _value.externalId
            : externalId // ignore: cast_nullable_to_non_nullable
                  as String?,
        latitude: freezed == latitude
            ? _value.latitude
            : latitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitude: freezed == longitude
            ? _value.longitude
            : longitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        massSchedule: freezed == massSchedule
            ? _value._massSchedule
            : massSchedule // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        confessionSchedule: freezed == confessionSchedule
            ? _value._confessionSchedule
            : confessionSchedule // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        adorationSchedule: freezed == adorationSchedule
            ? _value._adorationSchedule
            : adorationSchedule // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        lastSyncedAt: freezed == lastSyncedAt
            ? _value.lastSyncedAt
            : lastSyncedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        viewCount: null == viewCount
            ? _value.viewCount
            : viewCount // ignore: cast_nullable_to_non_nullable
                  as int,
        followerCount: null == followerCount
            ? _value.followerCount
            : followerCount // ignore: cast_nullable_to_non_nullable
                  as int,
        stripeAccountId: freezed == stripeAccountId
            ? _value.stripeAccountId
            : stripeAccountId // ignore: cast_nullable_to_non_nullable
                  as String?,
        totalDonations: null == totalDonations
            ? _value.totalDonations
            : totalDonations // ignore: cast_nullable_to_non_nullable
                  as int,
        donationCount: null == donationCount
            ? _value.donationCount
            : donationCount // ignore: cast_nullable_to_non_nullable
                  as int,
        createdAt: freezed == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        updatedAt: freezed == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ChurchImpl implements _Church {
  const _$ChurchImpl({
    required this.id,
    required this.name,
    required this.slug,
    this.address,
    required this.city,
    this.state,
    this.country,
    this.countryCode,
    this.postalCode,
    this.primaryImageUrl,
    this.website,
    this.phone,
    this.email,
    this.type = 'PARISH',
    this.denomination,
    this.dioceseId,
    this.isVerified = false,
    this.verifiedAt,
    this.claimedBy,
    this.description,
    this.shortDescription,
    this.history,
    this.virtualTourUrl,
    this.calendarUrl,
    this.externalId,
    this.latitude,
    this.longitude,
    final Map<String, dynamic>? massSchedule,
    final Map<String, dynamic>? confessionSchedule,
    final Map<String, dynamic>? adorationSchedule,
    this.lastSyncedAt,
    this.viewCount = 0,
    this.followerCount = 0,
    @JsonKey(name: 'stripeAccountId') this.stripeAccountId,
    @JsonKey(name: 'totalDonations') this.totalDonations = 0,
    @JsonKey(name: 'donationCount') this.donationCount = 0,
    this.createdAt,
    this.updatedAt,
  }) : _massSchedule = massSchedule,
       _confessionSchedule = confessionSchedule,
       _adorationSchedule = adorationSchedule;

  factory _$ChurchImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChurchImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? address;
  @override
  final String city;
  @override
  final String? state;
  @override
  final String? country;
  @override
  final String? countryCode;
  @override
  final String? postalCode;
  @override
  final String? primaryImageUrl;
  @override
  final String? website;
  @override
  final String? phone;
  @override
  final String? email;
  @override
  @JsonKey()
  final String type;
  @override
  final String? denomination;
  @override
  final String? dioceseId;
  @override
  @JsonKey()
  final bool isVerified;
  @override
  final DateTime? verifiedAt;
  @override
  final String? claimedBy;
  @override
  final String? description;
  @override
  final String? shortDescription;
  @override
  final String? history;
  @override
  final String? virtualTourUrl;
  @override
  final String? calendarUrl;
  @override
  final String? externalId;
  @override
  final double? latitude;
  @override
  final double? longitude;
  final Map<String, dynamic>? _massSchedule;
  @override
  Map<String, dynamic>? get massSchedule {
    final value = _massSchedule;
    if (value == null) return null;
    if (_massSchedule is EqualUnmodifiableMapView) return _massSchedule;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  final Map<String, dynamic>? _confessionSchedule;
  @override
  Map<String, dynamic>? get confessionSchedule {
    final value = _confessionSchedule;
    if (value == null) return null;
    if (_confessionSchedule is EqualUnmodifiableMapView)
      return _confessionSchedule;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  final Map<String, dynamic>? _adorationSchedule;
  @override
  Map<String, dynamic>? get adorationSchedule {
    final value = _adorationSchedule;
    if (value == null) return null;
    if (_adorationSchedule is EqualUnmodifiableMapView)
      return _adorationSchedule;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  final DateTime? lastSyncedAt;
  @override
  @JsonKey()
  final int viewCount;
  @override
  @JsonKey()
  final int followerCount;
  @override
  @JsonKey(name: 'stripeAccountId')
  final String? stripeAccountId;
  @override
  @JsonKey(name: 'totalDonations')
  final int totalDonations;
  @override
  @JsonKey(name: 'donationCount')
  final int donationCount;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  @override
  String toString() {
    return 'Church(id: $id, name: $name, slug: $slug, address: $address, city: $city, state: $state, country: $country, countryCode: $countryCode, postalCode: $postalCode, primaryImageUrl: $primaryImageUrl, website: $website, phone: $phone, email: $email, type: $type, denomination: $denomination, dioceseId: $dioceseId, isVerified: $isVerified, verifiedAt: $verifiedAt, claimedBy: $claimedBy, description: $description, shortDescription: $shortDescription, history: $history, virtualTourUrl: $virtualTourUrl, calendarUrl: $calendarUrl, externalId: $externalId, latitude: $latitude, longitude: $longitude, massSchedule: $massSchedule, confessionSchedule: $confessionSchedule, adorationSchedule: $adorationSchedule, lastSyncedAt: $lastSyncedAt, viewCount: $viewCount, followerCount: $followerCount, stripeAccountId: $stripeAccountId, totalDonations: $totalDonations, donationCount: $donationCount, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChurchImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.state, state) || other.state == state) &&
            (identical(other.country, country) || other.country == country) &&
            (identical(other.countryCode, countryCode) ||
                other.countryCode == countryCode) &&
            (identical(other.postalCode, postalCode) ||
                other.postalCode == postalCode) &&
            (identical(other.primaryImageUrl, primaryImageUrl) ||
                other.primaryImageUrl == primaryImageUrl) &&
            (identical(other.website, website) || other.website == website) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.denomination, denomination) ||
                other.denomination == denomination) &&
            (identical(other.dioceseId, dioceseId) ||
                other.dioceseId == dioceseId) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified) &&
            (identical(other.verifiedAt, verifiedAt) ||
                other.verifiedAt == verifiedAt) &&
            (identical(other.claimedBy, claimedBy) ||
                other.claimedBy == claimedBy) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.shortDescription, shortDescription) ||
                other.shortDescription == shortDescription) &&
            (identical(other.history, history) || other.history == history) &&
            (identical(other.virtualTourUrl, virtualTourUrl) ||
                other.virtualTourUrl == virtualTourUrl) &&
            (identical(other.calendarUrl, calendarUrl) ||
                other.calendarUrl == calendarUrl) &&
            (identical(other.externalId, externalId) ||
                other.externalId == externalId) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            const DeepCollectionEquality().equals(
              other._massSchedule,
              _massSchedule,
            ) &&
            const DeepCollectionEquality().equals(
              other._confessionSchedule,
              _confessionSchedule,
            ) &&
            const DeepCollectionEquality().equals(
              other._adorationSchedule,
              _adorationSchedule,
            ) &&
            (identical(other.lastSyncedAt, lastSyncedAt) ||
                other.lastSyncedAt == lastSyncedAt) &&
            (identical(other.viewCount, viewCount) ||
                other.viewCount == viewCount) &&
            (identical(other.followerCount, followerCount) ||
                other.followerCount == followerCount) &&
            (identical(other.stripeAccountId, stripeAccountId) ||
                other.stripeAccountId == stripeAccountId) &&
            (identical(other.totalDonations, totalDonations) ||
                other.totalDonations == totalDonations) &&
            (identical(other.donationCount, donationCount) ||
                other.donationCount == donationCount) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    name,
    slug,
    address,
    city,
    state,
    country,
    countryCode,
    postalCode,
    primaryImageUrl,
    website,
    phone,
    email,
    type,
    denomination,
    dioceseId,
    isVerified,
    verifiedAt,
    claimedBy,
    description,
    shortDescription,
    history,
    virtualTourUrl,
    calendarUrl,
    externalId,
    latitude,
    longitude,
    const DeepCollectionEquality().hash(_massSchedule),
    const DeepCollectionEquality().hash(_confessionSchedule),
    const DeepCollectionEquality().hash(_adorationSchedule),
    lastSyncedAt,
    viewCount,
    followerCount,
    stripeAccountId,
    totalDonations,
    donationCount,
    createdAt,
    updatedAt,
  ]);

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ChurchImplCopyWith<_$ChurchImpl> get copyWith =>
      __$$ChurchImplCopyWithImpl<_$ChurchImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChurchImplToJson(this);
  }
}

abstract class _Church implements Church {
  const factory _Church({
    required final String id,
    required final String name,
    required final String slug,
    final String? address,
    required final String city,
    final String? state,
    final String? country,
    final String? countryCode,
    final String? postalCode,
    final String? primaryImageUrl,
    final String? website,
    final String? phone,
    final String? email,
    final String type,
    final String? denomination,
    final String? dioceseId,
    final bool isVerified,
    final DateTime? verifiedAt,
    final String? claimedBy,
    final String? description,
    final String? shortDescription,
    final String? history,
    final String? virtualTourUrl,
    final String? calendarUrl,
    final String? externalId,
    final double? latitude,
    final double? longitude,
    final Map<String, dynamic>? massSchedule,
    final Map<String, dynamic>? confessionSchedule,
    final Map<String, dynamic>? adorationSchedule,
    final DateTime? lastSyncedAt,
    final int viewCount,
    final int followerCount,
    @JsonKey(name: 'stripeAccountId') final String? stripeAccountId,
    @JsonKey(name: 'totalDonations') final int totalDonations,
    @JsonKey(name: 'donationCount') final int donationCount,
    final DateTime? createdAt,
    final DateTime? updatedAt,
  }) = _$ChurchImpl;

  factory _Church.fromJson(Map<String, dynamic> json) = _$ChurchImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get address;
  @override
  String get city;
  @override
  String? get state;
  @override
  String? get country;
  @override
  String? get countryCode;
  @override
  String? get postalCode;
  @override
  String? get primaryImageUrl;
  @override
  String? get website;
  @override
  String? get phone;
  @override
  String? get email;
  @override
  String get type;
  @override
  String? get denomination;
  @override
  String? get dioceseId;
  @override
  bool get isVerified;
  @override
  DateTime? get verifiedAt;
  @override
  String? get claimedBy;
  @override
  String? get description;
  @override
  String? get shortDescription;
  @override
  String? get history;
  @override
  String? get virtualTourUrl;
  @override
  String? get calendarUrl;
  @override
  String? get externalId;
  @override
  double? get latitude;
  @override
  double? get longitude;
  @override
  Map<String, dynamic>? get massSchedule;
  @override
  Map<String, dynamic>? get confessionSchedule;
  @override
  Map<String, dynamic>? get adorationSchedule;
  @override
  DateTime? get lastSyncedAt;
  @override
  int get viewCount;
  @override
  int get followerCount;
  @override
  @JsonKey(name: 'stripeAccountId')
  String? get stripeAccountId;
  @override
  @JsonKey(name: 'totalDonations')
  int get totalDonations;
  @override
  @JsonKey(name: 'donationCount')
  int get donationCount;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ChurchImplCopyWith<_$ChurchImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
