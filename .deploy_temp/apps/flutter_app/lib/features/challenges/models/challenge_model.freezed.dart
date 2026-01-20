// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'challenge_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

PrayerChallenge _$PrayerChallengeFromJson(Map<String, dynamic> json) {
  return _PrayerChallenge.fromJson(json);
}

/// @nodoc
mixin _$PrayerChallenge {
  String get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  ChallengeType get type => throw _privateConstructorUsedError;
  int get targetCount => throw _privateConstructorUsedError;
  int get durationDays => throw _privateConstructorUsedError;
  DateTime? get startDate => throw _privateConstructorUsedError;
  DateTime? get endDate => throw _privateConstructorUsedError;
  int get rewardXp => throw _privateConstructorUsedError;
  String? get rewardBadge => throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;

  /// Serializes this PrayerChallenge to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrayerChallenge
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerChallengeCopyWith<PrayerChallenge> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerChallengeCopyWith<$Res> {
  factory $PrayerChallengeCopyWith(
    PrayerChallenge value,
    $Res Function(PrayerChallenge) then,
  ) = _$PrayerChallengeCopyWithImpl<$Res, PrayerChallenge>;
  @useResult
  $Res call({
    String id,
    String title,
    String description,
    ChallengeType type,
    int targetCount,
    int durationDays,
    DateTime? startDate,
    DateTime? endDate,
    int rewardXp,
    String? rewardBadge,
    bool isActive,
  });
}

/// @nodoc
class _$PrayerChallengeCopyWithImpl<$Res, $Val extends PrayerChallenge>
    implements $PrayerChallengeCopyWith<$Res> {
  _$PrayerChallengeCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrayerChallenge
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? type = null,
    Object? targetCount = null,
    Object? durationDays = null,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? rewardXp = null,
    Object? rewardBadge = freezed,
    Object? isActive = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            description: null == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as ChallengeType,
            targetCount: null == targetCount
                ? _value.targetCount
                : targetCount // ignore: cast_nullable_to_non_nullable
                      as int,
            durationDays: null == durationDays
                ? _value.durationDays
                : durationDays // ignore: cast_nullable_to_non_nullable
                      as int,
            startDate: freezed == startDate
                ? _value.startDate
                : startDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            endDate: freezed == endDate
                ? _value.endDate
                : endDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            rewardXp: null == rewardXp
                ? _value.rewardXp
                : rewardXp // ignore: cast_nullable_to_non_nullable
                      as int,
            rewardBadge: freezed == rewardBadge
                ? _value.rewardBadge
                : rewardBadge // ignore: cast_nullable_to_non_nullable
                      as String?,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PrayerChallengeImplCopyWith<$Res>
    implements $PrayerChallengeCopyWith<$Res> {
  factory _$$PrayerChallengeImplCopyWith(
    _$PrayerChallengeImpl value,
    $Res Function(_$PrayerChallengeImpl) then,
  ) = __$$PrayerChallengeImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String title,
    String description,
    ChallengeType type,
    int targetCount,
    int durationDays,
    DateTime? startDate,
    DateTime? endDate,
    int rewardXp,
    String? rewardBadge,
    bool isActive,
  });
}

/// @nodoc
class __$$PrayerChallengeImplCopyWithImpl<$Res>
    extends _$PrayerChallengeCopyWithImpl<$Res, _$PrayerChallengeImpl>
    implements _$$PrayerChallengeImplCopyWith<$Res> {
  __$$PrayerChallengeImplCopyWithImpl(
    _$PrayerChallengeImpl _value,
    $Res Function(_$PrayerChallengeImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrayerChallenge
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? description = null,
    Object? type = null,
    Object? targetCount = null,
    Object? durationDays = null,
    Object? startDate = freezed,
    Object? endDate = freezed,
    Object? rewardXp = null,
    Object? rewardBadge = freezed,
    Object? isActive = null,
  }) {
    return _then(
      _$PrayerChallengeImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        description: null == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as ChallengeType,
        targetCount: null == targetCount
            ? _value.targetCount
            : targetCount // ignore: cast_nullable_to_non_nullable
                  as int,
        durationDays: null == durationDays
            ? _value.durationDays
            : durationDays // ignore: cast_nullable_to_non_nullable
                  as int,
        startDate: freezed == startDate
            ? _value.startDate
            : startDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        endDate: freezed == endDate
            ? _value.endDate
            : endDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        rewardXp: null == rewardXp
            ? _value.rewardXp
            : rewardXp // ignore: cast_nullable_to_non_nullable
                  as int,
        rewardBadge: freezed == rewardBadge
            ? _value.rewardBadge
            : rewardBadge // ignore: cast_nullable_to_non_nullable
                  as String?,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrayerChallengeImpl implements _PrayerChallenge {
  const _$PrayerChallengeImpl({
    required this.id,
    required this.title,
    required this.description,
    this.type = ChallengeType.totalCount,
    required this.targetCount,
    required this.durationDays,
    this.startDate,
    this.endDate,
    required this.rewardXp,
    this.rewardBadge,
    this.isActive = true,
  });

  factory _$PrayerChallengeImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerChallengeImplFromJson(json);

  @override
  final String id;
  @override
  final String title;
  @override
  final String description;
  @override
  @JsonKey()
  final ChallengeType type;
  @override
  final int targetCount;
  @override
  final int durationDays;
  @override
  final DateTime? startDate;
  @override
  final DateTime? endDate;
  @override
  final int rewardXp;
  @override
  final String? rewardBadge;
  @override
  @JsonKey()
  final bool isActive;

  @override
  String toString() {
    return 'PrayerChallenge(id: $id, title: $title, description: $description, type: $type, targetCount: $targetCount, durationDays: $durationDays, startDate: $startDate, endDate: $endDate, rewardXp: $rewardXp, rewardBadge: $rewardBadge, isActive: $isActive)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerChallengeImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.targetCount, targetCount) ||
                other.targetCount == targetCount) &&
            (identical(other.durationDays, durationDays) ||
                other.durationDays == durationDays) &&
            (identical(other.startDate, startDate) ||
                other.startDate == startDate) &&
            (identical(other.endDate, endDate) || other.endDate == endDate) &&
            (identical(other.rewardXp, rewardXp) ||
                other.rewardXp == rewardXp) &&
            (identical(other.rewardBadge, rewardBadge) ||
                other.rewardBadge == rewardBadge) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    title,
    description,
    type,
    targetCount,
    durationDays,
    startDate,
    endDate,
    rewardXp,
    rewardBadge,
    isActive,
  );

  /// Create a copy of PrayerChallenge
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerChallengeImplCopyWith<_$PrayerChallengeImpl> get copyWith =>
      __$$PrayerChallengeImplCopyWithImpl<_$PrayerChallengeImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerChallengeImplToJson(this);
  }
}

abstract class _PrayerChallenge implements PrayerChallenge {
  const factory _PrayerChallenge({
    required final String id,
    required final String title,
    required final String description,
    final ChallengeType type,
    required final int targetCount,
    required final int durationDays,
    final DateTime? startDate,
    final DateTime? endDate,
    required final int rewardXp,
    final String? rewardBadge,
    final bool isActive,
  }) = _$PrayerChallengeImpl;

  factory _PrayerChallenge.fromJson(Map<String, dynamic> json) =
      _$PrayerChallengeImpl.fromJson;

  @override
  String get id;
  @override
  String get title;
  @override
  String get description;
  @override
  ChallengeType get type;
  @override
  int get targetCount;
  @override
  int get durationDays;
  @override
  DateTime? get startDate;
  @override
  DateTime? get endDate;
  @override
  int get rewardXp;
  @override
  String? get rewardBadge;
  @override
  bool get isActive;

  /// Create a copy of PrayerChallenge
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerChallengeImplCopyWith<_$PrayerChallengeImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

UserChallenge _$UserChallengeFromJson(Map<String, dynamic> json) {
  return _UserChallenge.fromJson(json);
}

/// @nodoc
mixin _$UserChallenge {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String get challengeId => throw _privateConstructorUsedError;
  UserChallengeStatus get status => throw _privateConstructorUsedError;
  int get progress => throw _privateConstructorUsedError;
  DateTime get joinedAt => throw _privateConstructorUsedError;
  DateTime? get completedAt => throw _privateConstructorUsedError; // Relations
  PrayerChallenge? get challenge => throw _privateConstructorUsedError;

  /// Serializes this UserChallenge to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UserChallenge
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserChallengeCopyWith<UserChallenge> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserChallengeCopyWith<$Res> {
  factory $UserChallengeCopyWith(
    UserChallenge value,
    $Res Function(UserChallenge) then,
  ) = _$UserChallengeCopyWithImpl<$Res, UserChallenge>;
  @useResult
  $Res call({
    String id,
    String userId,
    String challengeId,
    UserChallengeStatus status,
    int progress,
    DateTime joinedAt,
    DateTime? completedAt,
    PrayerChallenge? challenge,
  });

  $PrayerChallengeCopyWith<$Res>? get challenge;
}

/// @nodoc
class _$UserChallengeCopyWithImpl<$Res, $Val extends UserChallenge>
    implements $UserChallengeCopyWith<$Res> {
  _$UserChallengeCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UserChallenge
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? challengeId = null,
    Object? status = null,
    Object? progress = null,
    Object? joinedAt = null,
    Object? completedAt = freezed,
    Object? challenge = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            userId: null == userId
                ? _value.userId
                : userId // ignore: cast_nullable_to_non_nullable
                      as String,
            challengeId: null == challengeId
                ? _value.challengeId
                : challengeId // ignore: cast_nullable_to_non_nullable
                      as String,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as UserChallengeStatus,
            progress: null == progress
                ? _value.progress
                : progress // ignore: cast_nullable_to_non_nullable
                      as int,
            joinedAt: null == joinedAt
                ? _value.joinedAt
                : joinedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            completedAt: freezed == completedAt
                ? _value.completedAt
                : completedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            challenge: freezed == challenge
                ? _value.challenge
                : challenge // ignore: cast_nullable_to_non_nullable
                      as PrayerChallenge?,
          )
          as $Val,
    );
  }

  /// Create a copy of UserChallenge
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PrayerChallengeCopyWith<$Res>? get challenge {
    if (_value.challenge == null) {
      return null;
    }

    return $PrayerChallengeCopyWith<$Res>(_value.challenge!, (value) {
      return _then(_value.copyWith(challenge: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$UserChallengeImplCopyWith<$Res>
    implements $UserChallengeCopyWith<$Res> {
  factory _$$UserChallengeImplCopyWith(
    _$UserChallengeImpl value,
    $Res Function(_$UserChallengeImpl) then,
  ) = __$$UserChallengeImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String userId,
    String challengeId,
    UserChallengeStatus status,
    int progress,
    DateTime joinedAt,
    DateTime? completedAt,
    PrayerChallenge? challenge,
  });

  @override
  $PrayerChallengeCopyWith<$Res>? get challenge;
}

/// @nodoc
class __$$UserChallengeImplCopyWithImpl<$Res>
    extends _$UserChallengeCopyWithImpl<$Res, _$UserChallengeImpl>
    implements _$$UserChallengeImplCopyWith<$Res> {
  __$$UserChallengeImplCopyWithImpl(
    _$UserChallengeImpl _value,
    $Res Function(_$UserChallengeImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UserChallenge
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? challengeId = null,
    Object? status = null,
    Object? progress = null,
    Object? joinedAt = null,
    Object? completedAt = freezed,
    Object? challenge = freezed,
  }) {
    return _then(
      _$UserChallengeImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: null == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String,
        challengeId: null == challengeId
            ? _value.challengeId
            : challengeId // ignore: cast_nullable_to_non_nullable
                  as String,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as UserChallengeStatus,
        progress: null == progress
            ? _value.progress
            : progress // ignore: cast_nullable_to_non_nullable
                  as int,
        joinedAt: null == joinedAt
            ? _value.joinedAt
            : joinedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        completedAt: freezed == completedAt
            ? _value.completedAt
            : completedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        challenge: freezed == challenge
            ? _value.challenge
            : challenge // ignore: cast_nullable_to_non_nullable
                  as PrayerChallenge?,
      ),
    );
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$UserChallengeImpl implements _UserChallenge {
  const _$UserChallengeImpl({
    required this.id,
    required this.userId,
    required this.challengeId,
    this.status = UserChallengeStatus.active,
    this.progress = 0,
    required this.joinedAt,
    this.completedAt,
    this.challenge,
  });

  factory _$UserChallengeImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserChallengeImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final String challengeId;
  @override
  @JsonKey()
  final UserChallengeStatus status;
  @override
  @JsonKey()
  final int progress;
  @override
  final DateTime joinedAt;
  @override
  final DateTime? completedAt;
  // Relations
  @override
  final PrayerChallenge? challenge;

  @override
  String toString() {
    return 'UserChallenge(id: $id, userId: $userId, challengeId: $challengeId, status: $status, progress: $progress, joinedAt: $joinedAt, completedAt: $completedAt, challenge: $challenge)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserChallengeImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.challengeId, challengeId) ||
                other.challengeId == challengeId) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.progress, progress) ||
                other.progress == progress) &&
            (identical(other.joinedAt, joinedAt) ||
                other.joinedAt == joinedAt) &&
            (identical(other.completedAt, completedAt) ||
                other.completedAt == completedAt) &&
            (identical(other.challenge, challenge) ||
                other.challenge == challenge));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    userId,
    challengeId,
    status,
    progress,
    joinedAt,
    completedAt,
    challenge,
  );

  /// Create a copy of UserChallenge
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserChallengeImplCopyWith<_$UserChallengeImpl> get copyWith =>
      __$$UserChallengeImplCopyWithImpl<_$UserChallengeImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UserChallengeImplToJson(this);
  }
}

abstract class _UserChallenge implements UserChallenge {
  const factory _UserChallenge({
    required final String id,
    required final String userId,
    required final String challengeId,
    final UserChallengeStatus status,
    final int progress,
    required final DateTime joinedAt,
    final DateTime? completedAt,
    final PrayerChallenge? challenge,
  }) = _$UserChallengeImpl;

  factory _UserChallenge.fromJson(Map<String, dynamic> json) =
      _$UserChallengeImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  String get challengeId;
  @override
  UserChallengeStatus get status;
  @override
  int get progress;
  @override
  DateTime get joinedAt;
  @override
  DateTime? get completedAt; // Relations
  @override
  PrayerChallenge? get challenge;

  /// Create a copy of UserChallenge
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserChallengeImplCopyWith<_$UserChallengeImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ChallengeCheckIn _$ChallengeCheckInFromJson(Map<String, dynamic> json) {
  return _ChallengeCheckIn.fromJson(json);
}

/// @nodoc
mixin _$ChallengeCheckIn {
  String get id => throw _privateConstructorUsedError;
  String get userChallengeId => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  bool get verified => throw _privateConstructorUsedError;
  String? get notes => throw _privateConstructorUsedError;
  Map<String, dynamic>? get data => throw _privateConstructorUsedError;

  /// Serializes this ChallengeCheckIn to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ChallengeCheckIn
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ChallengeCheckInCopyWith<ChallengeCheckIn> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChallengeCheckInCopyWith<$Res> {
  factory $ChallengeCheckInCopyWith(
    ChallengeCheckIn value,
    $Res Function(ChallengeCheckIn) then,
  ) = _$ChallengeCheckInCopyWithImpl<$Res, ChallengeCheckIn>;
  @useResult
  $Res call({
    String id,
    String userChallengeId,
    DateTime date,
    bool verified,
    String? notes,
    Map<String, dynamic>? data,
  });
}

/// @nodoc
class _$ChallengeCheckInCopyWithImpl<$Res, $Val extends ChallengeCheckIn>
    implements $ChallengeCheckInCopyWith<$Res> {
  _$ChallengeCheckInCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ChallengeCheckIn
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userChallengeId = null,
    Object? date = null,
    Object? verified = null,
    Object? notes = freezed,
    Object? data = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            userChallengeId: null == userChallengeId
                ? _value.userChallengeId
                : userChallengeId // ignore: cast_nullable_to_non_nullable
                      as String,
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            verified: null == verified
                ? _value.verified
                : verified // ignore: cast_nullable_to_non_nullable
                      as bool,
            notes: freezed == notes
                ? _value.notes
                : notes // ignore: cast_nullable_to_non_nullable
                      as String?,
            data: freezed == data
                ? _value.data
                : data // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ChallengeCheckInImplCopyWith<$Res>
    implements $ChallengeCheckInCopyWith<$Res> {
  factory _$$ChallengeCheckInImplCopyWith(
    _$ChallengeCheckInImpl value,
    $Res Function(_$ChallengeCheckInImpl) then,
  ) = __$$ChallengeCheckInImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String userChallengeId,
    DateTime date,
    bool verified,
    String? notes,
    Map<String, dynamic>? data,
  });
}

/// @nodoc
class __$$ChallengeCheckInImplCopyWithImpl<$Res>
    extends _$ChallengeCheckInCopyWithImpl<$Res, _$ChallengeCheckInImpl>
    implements _$$ChallengeCheckInImplCopyWith<$Res> {
  __$$ChallengeCheckInImplCopyWithImpl(
    _$ChallengeCheckInImpl _value,
    $Res Function(_$ChallengeCheckInImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ChallengeCheckIn
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userChallengeId = null,
    Object? date = null,
    Object? verified = null,
    Object? notes = freezed,
    Object? data = freezed,
  }) {
    return _then(
      _$ChallengeCheckInImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        userChallengeId: null == userChallengeId
            ? _value.userChallengeId
            : userChallengeId // ignore: cast_nullable_to_non_nullable
                  as String,
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        verified: null == verified
            ? _value.verified
            : verified // ignore: cast_nullable_to_non_nullable
                  as bool,
        notes: freezed == notes
            ? _value.notes
            : notes // ignore: cast_nullable_to_non_nullable
                  as String?,
        data: freezed == data
            ? _value._data
            : data // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ChallengeCheckInImpl implements _ChallengeCheckIn {
  const _$ChallengeCheckInImpl({
    required this.id,
    required this.userChallengeId,
    required this.date,
    this.verified = false,
    this.notes,
    final Map<String, dynamic>? data,
  }) : _data = data;

  factory _$ChallengeCheckInImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChallengeCheckInImplFromJson(json);

  @override
  final String id;
  @override
  final String userChallengeId;
  @override
  final DateTime date;
  @override
  @JsonKey()
  final bool verified;
  @override
  final String? notes;
  final Map<String, dynamic>? _data;
  @override
  Map<String, dynamic>? get data {
    final value = _data;
    if (value == null) return null;
    if (_data is EqualUnmodifiableMapView) return _data;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  String toString() {
    return 'ChallengeCheckIn(id: $id, userChallengeId: $userChallengeId, date: $date, verified: $verified, notes: $notes, data: $data)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChallengeCheckInImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userChallengeId, userChallengeId) ||
                other.userChallengeId == userChallengeId) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.verified, verified) ||
                other.verified == verified) &&
            (identical(other.notes, notes) || other.notes == notes) &&
            const DeepCollectionEquality().equals(other._data, _data));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    userChallengeId,
    date,
    verified,
    notes,
    const DeepCollectionEquality().hash(_data),
  );

  /// Create a copy of ChallengeCheckIn
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ChallengeCheckInImplCopyWith<_$ChallengeCheckInImpl> get copyWith =>
      __$$ChallengeCheckInImplCopyWithImpl<_$ChallengeCheckInImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ChallengeCheckInImplToJson(this);
  }
}

abstract class _ChallengeCheckIn implements ChallengeCheckIn {
  const factory _ChallengeCheckIn({
    required final String id,
    required final String userChallengeId,
    required final DateTime date,
    final bool verified,
    final String? notes,
    final Map<String, dynamic>? data,
  }) = _$ChallengeCheckInImpl;

  factory _ChallengeCheckIn.fromJson(Map<String, dynamic> json) =
      _$ChallengeCheckInImpl.fromJson;

  @override
  String get id;
  @override
  String get userChallengeId;
  @override
  DateTime get date;
  @override
  bool get verified;
  @override
  String? get notes;
  @override
  Map<String, dynamic>? get data;

  /// Create a copy of ChallengeCheckIn
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ChallengeCheckInImplCopyWith<_$ChallengeCheckInImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
