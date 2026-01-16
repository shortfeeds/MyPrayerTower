// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'prayer_request_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

PrayerUser _$PrayerUserFromJson(Map<String, dynamic> json) {
  return _PrayerUser.fromJson(json);
}

/// @nodoc
mixin _$PrayerUser {
  String? get firstName => throw _privateConstructorUsedError;
  String? get lastName => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;

  /// Serializes this PrayerUser to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrayerUser
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerUserCopyWith<PrayerUser> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerUserCopyWith<$Res> {
  factory $PrayerUserCopyWith(
    PrayerUser value,
    $Res Function(PrayerUser) then,
  ) = _$PrayerUserCopyWithImpl<$Res, PrayerUser>;
  @useResult
  $Res call({String? firstName, String? lastName, String? avatarUrl});
}

/// @nodoc
class _$PrayerUserCopyWithImpl<$Res, $Val extends PrayerUser>
    implements $PrayerUserCopyWith<$Res> {
  _$PrayerUserCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrayerUser
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
  }) {
    return _then(
      _value.copyWith(
            firstName: freezed == firstName
                ? _value.firstName
                : firstName // ignore: cast_nullable_to_non_nullable
                      as String?,
            lastName: freezed == lastName
                ? _value.lastName
                : lastName // ignore: cast_nullable_to_non_nullable
                      as String?,
            avatarUrl: freezed == avatarUrl
                ? _value.avatarUrl
                : avatarUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PrayerUserImplCopyWith<$Res>
    implements $PrayerUserCopyWith<$Res> {
  factory _$$PrayerUserImplCopyWith(
    _$PrayerUserImpl value,
    $Res Function(_$PrayerUserImpl) then,
  ) = __$$PrayerUserImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String? firstName, String? lastName, String? avatarUrl});
}

/// @nodoc
class __$$PrayerUserImplCopyWithImpl<$Res>
    extends _$PrayerUserCopyWithImpl<$Res, _$PrayerUserImpl>
    implements _$$PrayerUserImplCopyWith<$Res> {
  __$$PrayerUserImplCopyWithImpl(
    _$PrayerUserImpl _value,
    $Res Function(_$PrayerUserImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrayerUser
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
  }) {
    return _then(
      _$PrayerUserImpl(
        firstName: freezed == firstName
            ? _value.firstName
            : firstName // ignore: cast_nullable_to_non_nullable
                  as String?,
        lastName: freezed == lastName
            ? _value.lastName
            : lastName // ignore: cast_nullable_to_non_nullable
                  as String?,
        avatarUrl: freezed == avatarUrl
            ? _value.avatarUrl
            : avatarUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrayerUserImpl implements _PrayerUser {
  const _$PrayerUserImpl({this.firstName, this.lastName, this.avatarUrl});

  factory _$PrayerUserImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerUserImplFromJson(json);

  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? avatarUrl;

  @override
  String toString() {
    return 'PrayerUser(firstName: $firstName, lastName: $lastName, avatarUrl: $avatarUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerUserImpl &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, firstName, lastName, avatarUrl);

  /// Create a copy of PrayerUser
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerUserImplCopyWith<_$PrayerUserImpl> get copyWith =>
      __$$PrayerUserImplCopyWithImpl<_$PrayerUserImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerUserImplToJson(this);
  }
}

abstract class _PrayerUser implements PrayerUser {
  const factory _PrayerUser({
    final String? firstName,
    final String? lastName,
    final String? avatarUrl,
  }) = _$PrayerUserImpl;

  factory _PrayerUser.fromJson(Map<String, dynamic> json) =
      _$PrayerUserImpl.fromJson;

  @override
  String? get firstName;
  @override
  String? get lastName;
  @override
  String? get avatarUrl;

  /// Create a copy of PrayerUser
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerUserImplCopyWith<_$PrayerUserImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PrayerRequest _$PrayerRequestFromJson(Map<String, dynamic> json) {
  return _PrayerRequest.fromJson(json);
}

/// @nodoc
mixin _$PrayerRequest {
  String get id => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String? get userId => throw _privateConstructorUsedError;
  @JsonKey(name: 'prayerCount')
  int get prayerCount => throw _privateConstructorUsedError;
  @JsonKey(name: 'isAnonymous')
  bool get isAnonymous => throw _privateConstructorUsedError;
  String? get category => throw _privateConstructorUsedError;
  String? get country => throw _privateConstructorUsedError;
  String get visibility => throw _privateConstructorUsedError;
  @JsonKey(name: 'isAnswered')
  bool get isAnswered => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  @JsonKey(name: 'User')
  PrayerUser? get user => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;

  /// Serializes this PrayerRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrayerRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerRequestCopyWith<PrayerRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerRequestCopyWith<$Res> {
  factory $PrayerRequestCopyWith(
    PrayerRequest value,
    $Res Function(PrayerRequest) then,
  ) = _$PrayerRequestCopyWithImpl<$Res, PrayerRequest>;
  @useResult
  $Res call({
    String id,
    String content,
    String? userId,
    @JsonKey(name: 'prayerCount') int prayerCount,
    @JsonKey(name: 'isAnonymous') bool isAnonymous,
    String? category,
    String? country,
    String visibility,
    @JsonKey(name: 'isAnswered') bool isAnswered,
    String status,
    @JsonKey(name: 'User') PrayerUser? user,
    DateTime? createdAt,
  });

  $PrayerUserCopyWith<$Res>? get user;
}

/// @nodoc
class _$PrayerRequestCopyWithImpl<$Res, $Val extends PrayerRequest>
    implements $PrayerRequestCopyWith<$Res> {
  _$PrayerRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrayerRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? content = null,
    Object? userId = freezed,
    Object? prayerCount = null,
    Object? isAnonymous = null,
    Object? category = freezed,
    Object? country = freezed,
    Object? visibility = null,
    Object? isAnswered = null,
    Object? status = null,
    Object? user = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            content: null == content
                ? _value.content
                : content // ignore: cast_nullable_to_non_nullable
                      as String,
            userId: freezed == userId
                ? _value.userId
                : userId // ignore: cast_nullable_to_non_nullable
                      as String?,
            prayerCount: null == prayerCount
                ? _value.prayerCount
                : prayerCount // ignore: cast_nullable_to_non_nullable
                      as int,
            isAnonymous: null == isAnonymous
                ? _value.isAnonymous
                : isAnonymous // ignore: cast_nullable_to_non_nullable
                      as bool,
            category: freezed == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String?,
            country: freezed == country
                ? _value.country
                : country // ignore: cast_nullable_to_non_nullable
                      as String?,
            visibility: null == visibility
                ? _value.visibility
                : visibility // ignore: cast_nullable_to_non_nullable
                      as String,
            isAnswered: null == isAnswered
                ? _value.isAnswered
                : isAnswered // ignore: cast_nullable_to_non_nullable
                      as bool,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            user: freezed == user
                ? _value.user
                : user // ignore: cast_nullable_to_non_nullable
                      as PrayerUser?,
            createdAt: freezed == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }

  /// Create a copy of PrayerRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PrayerUserCopyWith<$Res>? get user {
    if (_value.user == null) {
      return null;
    }

    return $PrayerUserCopyWith<$Res>(_value.user!, (value) {
      return _then(_value.copyWith(user: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PrayerRequestImplCopyWith<$Res>
    implements $PrayerRequestCopyWith<$Res> {
  factory _$$PrayerRequestImplCopyWith(
    _$PrayerRequestImpl value,
    $Res Function(_$PrayerRequestImpl) then,
  ) = __$$PrayerRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String content,
    String? userId,
    @JsonKey(name: 'prayerCount') int prayerCount,
    @JsonKey(name: 'isAnonymous') bool isAnonymous,
    String? category,
    String? country,
    String visibility,
    @JsonKey(name: 'isAnswered') bool isAnswered,
    String status,
    @JsonKey(name: 'User') PrayerUser? user,
    DateTime? createdAt,
  });

  @override
  $PrayerUserCopyWith<$Res>? get user;
}

/// @nodoc
class __$$PrayerRequestImplCopyWithImpl<$Res>
    extends _$PrayerRequestCopyWithImpl<$Res, _$PrayerRequestImpl>
    implements _$$PrayerRequestImplCopyWith<$Res> {
  __$$PrayerRequestImplCopyWithImpl(
    _$PrayerRequestImpl _value,
    $Res Function(_$PrayerRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrayerRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? content = null,
    Object? userId = freezed,
    Object? prayerCount = null,
    Object? isAnonymous = null,
    Object? category = freezed,
    Object? country = freezed,
    Object? visibility = null,
    Object? isAnswered = null,
    Object? status = null,
    Object? user = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(
      _$PrayerRequestImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: freezed == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String?,
        prayerCount: null == prayerCount
            ? _value.prayerCount
            : prayerCount // ignore: cast_nullable_to_non_nullable
                  as int,
        isAnonymous: null == isAnonymous
            ? _value.isAnonymous
            : isAnonymous // ignore: cast_nullable_to_non_nullable
                  as bool,
        category: freezed == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String?,
        country: freezed == country
            ? _value.country
            : country // ignore: cast_nullable_to_non_nullable
                  as String?,
        visibility: null == visibility
            ? _value.visibility
            : visibility // ignore: cast_nullable_to_non_nullable
                  as String,
        isAnswered: null == isAnswered
            ? _value.isAnswered
            : isAnswered // ignore: cast_nullable_to_non_nullable
                  as bool,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        user: freezed == user
            ? _value.user
            : user // ignore: cast_nullable_to_non_nullable
                  as PrayerUser?,
        createdAt: freezed == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrayerRequestImpl implements _PrayerRequest {
  const _$PrayerRequestImpl({
    required this.id,
    required this.content,
    this.userId,
    @JsonKey(name: 'prayerCount') this.prayerCount = 0,
    @JsonKey(name: 'isAnonymous') this.isAnonymous = false,
    this.category,
    this.country,
    this.visibility = 'PUBLIC',
    @JsonKey(name: 'isAnswered') this.isAnswered = false,
    this.status = 'PENDING',
    @JsonKey(name: 'User') this.user,
    this.createdAt,
  });

  factory _$PrayerRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerRequestImplFromJson(json);

  @override
  final String id;
  @override
  final String content;
  @override
  final String? userId;
  @override
  @JsonKey(name: 'prayerCount')
  final int prayerCount;
  @override
  @JsonKey(name: 'isAnonymous')
  final bool isAnonymous;
  @override
  final String? category;
  @override
  final String? country;
  @override
  @JsonKey()
  final String visibility;
  @override
  @JsonKey(name: 'isAnswered')
  final bool isAnswered;
  @override
  @JsonKey()
  final String status;
  @override
  @JsonKey(name: 'User')
  final PrayerUser? user;
  @override
  final DateTime? createdAt;

  @override
  String toString() {
    return 'PrayerRequest(id: $id, content: $content, userId: $userId, prayerCount: $prayerCount, isAnonymous: $isAnonymous, category: $category, country: $country, visibility: $visibility, isAnswered: $isAnswered, status: $status, user: $user, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerRequestImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.prayerCount, prayerCount) ||
                other.prayerCount == prayerCount) &&
            (identical(other.isAnonymous, isAnonymous) ||
                other.isAnonymous == isAnonymous) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.country, country) || other.country == country) &&
            (identical(other.visibility, visibility) ||
                other.visibility == visibility) &&
            (identical(other.isAnswered, isAnswered) ||
                other.isAnswered == isAnswered) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.user, user) || other.user == user) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    content,
    userId,
    prayerCount,
    isAnonymous,
    category,
    country,
    visibility,
    isAnswered,
    status,
    user,
    createdAt,
  );

  /// Create a copy of PrayerRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerRequestImplCopyWith<_$PrayerRequestImpl> get copyWith =>
      __$$PrayerRequestImplCopyWithImpl<_$PrayerRequestImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerRequestImplToJson(this);
  }
}

abstract class _PrayerRequest implements PrayerRequest {
  const factory _PrayerRequest({
    required final String id,
    required final String content,
    final String? userId,
    @JsonKey(name: 'prayerCount') final int prayerCount,
    @JsonKey(name: 'isAnonymous') final bool isAnonymous,
    final String? category,
    final String? country,
    final String visibility,
    @JsonKey(name: 'isAnswered') final bool isAnswered,
    final String status,
    @JsonKey(name: 'User') final PrayerUser? user,
    final DateTime? createdAt,
  }) = _$PrayerRequestImpl;

  factory _PrayerRequest.fromJson(Map<String, dynamic> json) =
      _$PrayerRequestImpl.fromJson;

  @override
  String get id;
  @override
  String get content;
  @override
  String? get userId;
  @override
  @JsonKey(name: 'prayerCount')
  int get prayerCount;
  @override
  @JsonKey(name: 'isAnonymous')
  bool get isAnonymous;
  @override
  String? get category;
  @override
  String? get country;
  @override
  String get visibility;
  @override
  @JsonKey(name: 'isAnswered')
  bool get isAnswered;
  @override
  String get status;
  @override
  @JsonKey(name: 'User')
  PrayerUser? get user;
  @override
  DateTime? get createdAt;

  /// Create a copy of PrayerRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerRequestImplCopyWith<_$PrayerRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
