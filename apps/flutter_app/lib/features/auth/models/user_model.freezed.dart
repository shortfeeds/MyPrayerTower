// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'user_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

User _$UserFromJson(Map<String, dynamic> json) {
  return _User.fromJson(json);
}

/// @nodoc
mixin _$User {
  String get id => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  bool get emailVerified => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  bool get phoneVerified => throw _privateConstructorUsedError;
  String? get firstName => throw _privateConstructorUsedError;
  String? get lastName => throw _privateConstructorUsedError;
  String? get displayName => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  String? get bio => throw _privateConstructorUsedError;
  String get language => throw _privateConstructorUsedError;
  String get timezone => throw _privateConstructorUsedError;
  bool get notificationsEnabled => throw _privateConstructorUsedError;
  String get subscriptionTier =>
      throw _privateConstructorUsedError; // FREE, PLUS, PREMIUM, LIFETIME
  DateTime? get subscriptionEnds => throw _privateConstructorUsedError;
  String? get subscriptionSource => throw _privateConstructorUsedError;
  String? get stripeCustomerId => throw _privateConstructorUsedError;
  String? get homeChurchId => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;
  DateTime? get lastLoginAt => throw _privateConstructorUsedError;
  DateTime? get lastConfessionAt => throw _privateConstructorUsedError;
  DateTime? get lastStreakUpdate => throw _privateConstructorUsedError;
  int get longestStreak => throw _privateConstructorUsedError;
  int get streakCount => throw _privateConstructorUsedError;
  int get currentStreak => throw _privateConstructorUsedError;
  int get totalPrayers => throw _privateConstructorUsedError;
  int get totalPrayedFor => throw _privateConstructorUsedError;
  int get level => throw _privateConstructorUsedError;
  int get xp => throw _privateConstructorUsedError;
  DateTime? get lastPrayerDate => throw _privateConstructorUsedError;

  /// Serializes this User to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserCopyWith<User> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserCopyWith<$Res> {
  factory $UserCopyWith(User value, $Res Function(User) then) =
      _$UserCopyWithImpl<$Res, User>;
  @useResult
  $Res call({
    String id,
    String email,
    bool emailVerified,
    String? phone,
    bool phoneVerified,
    String? firstName,
    String? lastName,
    String? displayName,
    String? avatarUrl,
    String? bio,
    String language,
    String timezone,
    bool notificationsEnabled,
    String subscriptionTier,
    DateTime? subscriptionEnds,
    String? subscriptionSource,
    String? stripeCustomerId,
    String? homeChurchId,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? lastLoginAt,
    DateTime? lastConfessionAt,
    DateTime? lastStreakUpdate,
    int longestStreak,
    int streakCount,
    int currentStreak,
    int totalPrayers,
    int totalPrayedFor,
    int level,
    int xp,
    DateTime? lastPrayerDate,
  });
}

/// @nodoc
class _$UserCopyWithImpl<$Res, $Val extends User>
    implements $UserCopyWith<$Res> {
  _$UserCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? emailVerified = null,
    Object? phone = freezed,
    Object? phoneVerified = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? displayName = freezed,
    Object? avatarUrl = freezed,
    Object? bio = freezed,
    Object? language = null,
    Object? timezone = null,
    Object? notificationsEnabled = null,
    Object? subscriptionTier = null,
    Object? subscriptionEnds = freezed,
    Object? subscriptionSource = freezed,
    Object? stripeCustomerId = freezed,
    Object? homeChurchId = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? lastLoginAt = freezed,
    Object? lastConfessionAt = freezed,
    Object? lastStreakUpdate = freezed,
    Object? longestStreak = null,
    Object? streakCount = null,
    Object? currentStreak = null,
    Object? totalPrayers = null,
    Object? totalPrayedFor = null,
    Object? level = null,
    Object? xp = null,
    Object? lastPrayerDate = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            emailVerified: null == emailVerified
                ? _value.emailVerified
                : emailVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            phoneVerified: null == phoneVerified
                ? _value.phoneVerified
                : phoneVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
            firstName: freezed == firstName
                ? _value.firstName
                : firstName // ignore: cast_nullable_to_non_nullable
                      as String?,
            lastName: freezed == lastName
                ? _value.lastName
                : lastName // ignore: cast_nullable_to_non_nullable
                      as String?,
            displayName: freezed == displayName
                ? _value.displayName
                : displayName // ignore: cast_nullable_to_non_nullable
                      as String?,
            avatarUrl: freezed == avatarUrl
                ? _value.avatarUrl
                : avatarUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            bio: freezed == bio
                ? _value.bio
                : bio // ignore: cast_nullable_to_non_nullable
                      as String?,
            language: null == language
                ? _value.language
                : language // ignore: cast_nullable_to_non_nullable
                      as String,
            timezone: null == timezone
                ? _value.timezone
                : timezone // ignore: cast_nullable_to_non_nullable
                      as String,
            notificationsEnabled: null == notificationsEnabled
                ? _value.notificationsEnabled
                : notificationsEnabled // ignore: cast_nullable_to_non_nullable
                      as bool,
            subscriptionTier: null == subscriptionTier
                ? _value.subscriptionTier
                : subscriptionTier // ignore: cast_nullable_to_non_nullable
                      as String,
            subscriptionEnds: freezed == subscriptionEnds
                ? _value.subscriptionEnds
                : subscriptionEnds // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            subscriptionSource: freezed == subscriptionSource
                ? _value.subscriptionSource
                : subscriptionSource // ignore: cast_nullable_to_non_nullable
                      as String?,
            stripeCustomerId: freezed == stripeCustomerId
                ? _value.stripeCustomerId
                : stripeCustomerId // ignore: cast_nullable_to_non_nullable
                      as String?,
            homeChurchId: freezed == homeChurchId
                ? _value.homeChurchId
                : homeChurchId // ignore: cast_nullable_to_non_nullable
                      as String?,
            createdAt: freezed == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            updatedAt: freezed == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            lastLoginAt: freezed == lastLoginAt
                ? _value.lastLoginAt
                : lastLoginAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            lastConfessionAt: freezed == lastConfessionAt
                ? _value.lastConfessionAt
                : lastConfessionAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            lastStreakUpdate: freezed == lastStreakUpdate
                ? _value.lastStreakUpdate
                : lastStreakUpdate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            longestStreak: null == longestStreak
                ? _value.longestStreak
                : longestStreak // ignore: cast_nullable_to_non_nullable
                      as int,
            streakCount: null == streakCount
                ? _value.streakCount
                : streakCount // ignore: cast_nullable_to_non_nullable
                      as int,
            currentStreak: null == currentStreak
                ? _value.currentStreak
                : currentStreak // ignore: cast_nullable_to_non_nullable
                      as int,
            totalPrayers: null == totalPrayers
                ? _value.totalPrayers
                : totalPrayers // ignore: cast_nullable_to_non_nullable
                      as int,
            totalPrayedFor: null == totalPrayedFor
                ? _value.totalPrayedFor
                : totalPrayedFor // ignore: cast_nullable_to_non_nullable
                      as int,
            level: null == level
                ? _value.level
                : level // ignore: cast_nullable_to_non_nullable
                      as int,
            xp: null == xp
                ? _value.xp
                : xp // ignore: cast_nullable_to_non_nullable
                      as int,
            lastPrayerDate: freezed == lastPrayerDate
                ? _value.lastPrayerDate
                : lastPrayerDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$UserImplCopyWith<$Res> implements $UserCopyWith<$Res> {
  factory _$$UserImplCopyWith(
    _$UserImpl value,
    $Res Function(_$UserImpl) then,
  ) = __$$UserImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String email,
    bool emailVerified,
    String? phone,
    bool phoneVerified,
    String? firstName,
    String? lastName,
    String? displayName,
    String? avatarUrl,
    String? bio,
    String language,
    String timezone,
    bool notificationsEnabled,
    String subscriptionTier,
    DateTime? subscriptionEnds,
    String? subscriptionSource,
    String? stripeCustomerId,
    String? homeChurchId,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? lastLoginAt,
    DateTime? lastConfessionAt,
    DateTime? lastStreakUpdate,
    int longestStreak,
    int streakCount,
    int currentStreak,
    int totalPrayers,
    int totalPrayedFor,
    int level,
    int xp,
    DateTime? lastPrayerDate,
  });
}

/// @nodoc
class __$$UserImplCopyWithImpl<$Res>
    extends _$UserCopyWithImpl<$Res, _$UserImpl>
    implements _$$UserImplCopyWith<$Res> {
  __$$UserImplCopyWithImpl(_$UserImpl _value, $Res Function(_$UserImpl) _then)
    : super(_value, _then);

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? email = null,
    Object? emailVerified = null,
    Object? phone = freezed,
    Object? phoneVerified = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? displayName = freezed,
    Object? avatarUrl = freezed,
    Object? bio = freezed,
    Object? language = null,
    Object? timezone = null,
    Object? notificationsEnabled = null,
    Object? subscriptionTier = null,
    Object? subscriptionEnds = freezed,
    Object? subscriptionSource = freezed,
    Object? stripeCustomerId = freezed,
    Object? homeChurchId = freezed,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
    Object? lastLoginAt = freezed,
    Object? lastConfessionAt = freezed,
    Object? lastStreakUpdate = freezed,
    Object? longestStreak = null,
    Object? streakCount = null,
    Object? currentStreak = null,
    Object? totalPrayers = null,
    Object? totalPrayedFor = null,
    Object? level = null,
    Object? xp = null,
    Object? lastPrayerDate = freezed,
  }) {
    return _then(
      _$UserImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        emailVerified: null == emailVerified
            ? _value.emailVerified
            : emailVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        phoneVerified: null == phoneVerified
            ? _value.phoneVerified
            : phoneVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
        firstName: freezed == firstName
            ? _value.firstName
            : firstName // ignore: cast_nullable_to_non_nullable
                  as String?,
        lastName: freezed == lastName
            ? _value.lastName
            : lastName // ignore: cast_nullable_to_non_nullable
                  as String?,
        displayName: freezed == displayName
            ? _value.displayName
            : displayName // ignore: cast_nullable_to_non_nullable
                  as String?,
        avatarUrl: freezed == avatarUrl
            ? _value.avatarUrl
            : avatarUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        bio: freezed == bio
            ? _value.bio
            : bio // ignore: cast_nullable_to_non_nullable
                  as String?,
        language: null == language
            ? _value.language
            : language // ignore: cast_nullable_to_non_nullable
                  as String,
        timezone: null == timezone
            ? _value.timezone
            : timezone // ignore: cast_nullable_to_non_nullable
                  as String,
        notificationsEnabled: null == notificationsEnabled
            ? _value.notificationsEnabled
            : notificationsEnabled // ignore: cast_nullable_to_non_nullable
                  as bool,
        subscriptionTier: null == subscriptionTier
            ? _value.subscriptionTier
            : subscriptionTier // ignore: cast_nullable_to_non_nullable
                  as String,
        subscriptionEnds: freezed == subscriptionEnds
            ? _value.subscriptionEnds
            : subscriptionEnds // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        subscriptionSource: freezed == subscriptionSource
            ? _value.subscriptionSource
            : subscriptionSource // ignore: cast_nullable_to_non_nullable
                  as String?,
        stripeCustomerId: freezed == stripeCustomerId
            ? _value.stripeCustomerId
            : stripeCustomerId // ignore: cast_nullable_to_non_nullable
                  as String?,
        homeChurchId: freezed == homeChurchId
            ? _value.homeChurchId
            : homeChurchId // ignore: cast_nullable_to_non_nullable
                  as String?,
        createdAt: freezed == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        updatedAt: freezed == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        lastLoginAt: freezed == lastLoginAt
            ? _value.lastLoginAt
            : lastLoginAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        lastConfessionAt: freezed == lastConfessionAt
            ? _value.lastConfessionAt
            : lastConfessionAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        lastStreakUpdate: freezed == lastStreakUpdate
            ? _value.lastStreakUpdate
            : lastStreakUpdate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        longestStreak: null == longestStreak
            ? _value.longestStreak
            : longestStreak // ignore: cast_nullable_to_non_nullable
                  as int,
        streakCount: null == streakCount
            ? _value.streakCount
            : streakCount // ignore: cast_nullable_to_non_nullable
                  as int,
        currentStreak: null == currentStreak
            ? _value.currentStreak
            : currentStreak // ignore: cast_nullable_to_non_nullable
                  as int,
        totalPrayers: null == totalPrayers
            ? _value.totalPrayers
            : totalPrayers // ignore: cast_nullable_to_non_nullable
                  as int,
        totalPrayedFor: null == totalPrayedFor
            ? _value.totalPrayedFor
            : totalPrayedFor // ignore: cast_nullable_to_non_nullable
                  as int,
        level: null == level
            ? _value.level
            : level // ignore: cast_nullable_to_non_nullable
                  as int,
        xp: null == xp
            ? _value.xp
            : xp // ignore: cast_nullable_to_non_nullable
                  as int,
        lastPrayerDate: freezed == lastPrayerDate
            ? _value.lastPrayerDate
            : lastPrayerDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$UserImpl extends _User {
  const _$UserImpl({
    required this.id,
    required this.email,
    this.emailVerified = false,
    this.phone,
    this.phoneVerified = false,
    this.firstName,
    this.lastName,
    this.displayName,
    this.avatarUrl,
    this.bio,
    this.language = 'en',
    this.timezone = 'UTC',
    this.notificationsEnabled = true,
    this.subscriptionTier = 'FREE',
    this.subscriptionEnds,
    this.subscriptionSource,
    this.stripeCustomerId,
    this.homeChurchId,
    this.createdAt,
    this.updatedAt,
    this.lastLoginAt,
    this.lastConfessionAt,
    this.lastStreakUpdate,
    this.longestStreak = 0,
    this.streakCount = 0,
    this.currentStreak = 0,
    this.totalPrayers = 0,
    this.totalPrayedFor = 0,
    this.level = 1,
    this.xp = 0,
    this.lastPrayerDate,
  }) : super._();

  factory _$UserImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserImplFromJson(json);

  @override
  final String id;
  @override
  final String email;
  @override
  @JsonKey()
  final bool emailVerified;
  @override
  final String? phone;
  @override
  @JsonKey()
  final bool phoneVerified;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? displayName;
  @override
  final String? avatarUrl;
  @override
  final String? bio;
  @override
  @JsonKey()
  final String language;
  @override
  @JsonKey()
  final String timezone;
  @override
  @JsonKey()
  final bool notificationsEnabled;
  @override
  @JsonKey()
  final String subscriptionTier;
  // FREE, PLUS, PREMIUM, LIFETIME
  @override
  final DateTime? subscriptionEnds;
  @override
  final String? subscriptionSource;
  @override
  final String? stripeCustomerId;
  @override
  final String? homeChurchId;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;
  @override
  final DateTime? lastLoginAt;
  @override
  final DateTime? lastConfessionAt;
  @override
  final DateTime? lastStreakUpdate;
  @override
  @JsonKey()
  final int longestStreak;
  @override
  @JsonKey()
  final int streakCount;
  @override
  @JsonKey()
  final int currentStreak;
  @override
  @JsonKey()
  final int totalPrayers;
  @override
  @JsonKey()
  final int totalPrayedFor;
  @override
  @JsonKey()
  final int level;
  @override
  @JsonKey()
  final int xp;
  @override
  final DateTime? lastPrayerDate;

  @override
  String toString() {
    return 'User(id: $id, email: $email, emailVerified: $emailVerified, phone: $phone, phoneVerified: $phoneVerified, firstName: $firstName, lastName: $lastName, displayName: $displayName, avatarUrl: $avatarUrl, bio: $bio, language: $language, timezone: $timezone, notificationsEnabled: $notificationsEnabled, subscriptionTier: $subscriptionTier, subscriptionEnds: $subscriptionEnds, subscriptionSource: $subscriptionSource, stripeCustomerId: $stripeCustomerId, homeChurchId: $homeChurchId, createdAt: $createdAt, updatedAt: $updatedAt, lastLoginAt: $lastLoginAt, lastConfessionAt: $lastConfessionAt, lastStreakUpdate: $lastStreakUpdate, longestStreak: $longestStreak, streakCount: $streakCount, currentStreak: $currentStreak, totalPrayers: $totalPrayers, totalPrayedFor: $totalPrayedFor, level: $level, xp: $xp, lastPrayerDate: $lastPrayerDate)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.emailVerified, emailVerified) ||
                other.emailVerified == emailVerified) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.phoneVerified, phoneVerified) ||
                other.phoneVerified == phoneVerified) &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.displayName, displayName) ||
                other.displayName == displayName) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.bio, bio) || other.bio == bio) &&
            (identical(other.language, language) ||
                other.language == language) &&
            (identical(other.timezone, timezone) ||
                other.timezone == timezone) &&
            (identical(other.notificationsEnabled, notificationsEnabled) ||
                other.notificationsEnabled == notificationsEnabled) &&
            (identical(other.subscriptionTier, subscriptionTier) ||
                other.subscriptionTier == subscriptionTier) &&
            (identical(other.subscriptionEnds, subscriptionEnds) ||
                other.subscriptionEnds == subscriptionEnds) &&
            (identical(other.subscriptionSource, subscriptionSource) ||
                other.subscriptionSource == subscriptionSource) &&
            (identical(other.stripeCustomerId, stripeCustomerId) ||
                other.stripeCustomerId == stripeCustomerId) &&
            (identical(other.homeChurchId, homeChurchId) ||
                other.homeChurchId == homeChurchId) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            (identical(other.lastLoginAt, lastLoginAt) ||
                other.lastLoginAt == lastLoginAt) &&
            (identical(other.lastConfessionAt, lastConfessionAt) ||
                other.lastConfessionAt == lastConfessionAt) &&
            (identical(other.lastStreakUpdate, lastStreakUpdate) ||
                other.lastStreakUpdate == lastStreakUpdate) &&
            (identical(other.longestStreak, longestStreak) ||
                other.longestStreak == longestStreak) &&
            (identical(other.streakCount, streakCount) ||
                other.streakCount == streakCount) &&
            (identical(other.currentStreak, currentStreak) ||
                other.currentStreak == currentStreak) &&
            (identical(other.totalPrayers, totalPrayers) ||
                other.totalPrayers == totalPrayers) &&
            (identical(other.totalPrayedFor, totalPrayedFor) ||
                other.totalPrayedFor == totalPrayedFor) &&
            (identical(other.level, level) || other.level == level) &&
            (identical(other.xp, xp) || other.xp == xp) &&
            (identical(other.lastPrayerDate, lastPrayerDate) ||
                other.lastPrayerDate == lastPrayerDate));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    email,
    emailVerified,
    phone,
    phoneVerified,
    firstName,
    lastName,
    displayName,
    avatarUrl,
    bio,
    language,
    timezone,
    notificationsEnabled,
    subscriptionTier,
    subscriptionEnds,
    subscriptionSource,
    stripeCustomerId,
    homeChurchId,
    createdAt,
    updatedAt,
    lastLoginAt,
    lastConfessionAt,
    lastStreakUpdate,
    longestStreak,
    streakCount,
    currentStreak,
    totalPrayers,
    totalPrayedFor,
    level,
    xp,
    lastPrayerDate,
  ]);

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserImplCopyWith<_$UserImpl> get copyWith =>
      __$$UserImplCopyWithImpl<_$UserImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserImplToJson(this);
  }
}

abstract class _User extends User {
  const factory _User({
    required final String id,
    required final String email,
    final bool emailVerified,
    final String? phone,
    final bool phoneVerified,
    final String? firstName,
    final String? lastName,
    final String? displayName,
    final String? avatarUrl,
    final String? bio,
    final String language,
    final String timezone,
    final bool notificationsEnabled,
    final String subscriptionTier,
    final DateTime? subscriptionEnds,
    final String? subscriptionSource,
    final String? stripeCustomerId,
    final String? homeChurchId,
    final DateTime? createdAt,
    final DateTime? updatedAt,
    final DateTime? lastLoginAt,
    final DateTime? lastConfessionAt,
    final DateTime? lastStreakUpdate,
    final int longestStreak,
    final int streakCount,
    final int currentStreak,
    final int totalPrayers,
    final int totalPrayedFor,
    final int level,
    final int xp,
    final DateTime? lastPrayerDate,
  }) = _$UserImpl;
  const _User._() : super._();

  factory _User.fromJson(Map<String, dynamic> json) = _$UserImpl.fromJson;

  @override
  String get id;
  @override
  String get email;
  @override
  bool get emailVerified;
  @override
  String? get phone;
  @override
  bool get phoneVerified;
  @override
  String? get firstName;
  @override
  String? get lastName;
  @override
  String? get displayName;
  @override
  String? get avatarUrl;
  @override
  String? get bio;
  @override
  String get language;
  @override
  String get timezone;
  @override
  bool get notificationsEnabled;
  @override
  String get subscriptionTier; // FREE, PLUS, PREMIUM, LIFETIME
  @override
  DateTime? get subscriptionEnds;
  @override
  String? get subscriptionSource;
  @override
  String? get stripeCustomerId;
  @override
  String? get homeChurchId;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;
  @override
  DateTime? get lastLoginAt;
  @override
  DateTime? get lastConfessionAt;
  @override
  DateTime? get lastStreakUpdate;
  @override
  int get longestStreak;
  @override
  int get streakCount;
  @override
  int get currentStreak;
  @override
  int get totalPrayers;
  @override
  int get totalPrayedFor;
  @override
  int get level;
  @override
  int get xp;
  @override
  DateTime? get lastPrayerDate;

  /// Create a copy of User
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserImplCopyWith<_$UserImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
