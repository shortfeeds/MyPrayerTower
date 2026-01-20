// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'prayer_partner_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

PrayerPartnerUser _$PrayerPartnerUserFromJson(Map<String, dynamic> json) {
  return _PrayerPartnerUser.fromJson(json);
}

/// @nodoc
mixin _$PrayerPartnerUser {
  String get id => throw _privateConstructorUsedError;
  String? get firstName => throw _privateConstructorUsedError;
  String? get lastName => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;

  /// Serializes this PrayerPartnerUser to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrayerPartnerUser
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerPartnerUserCopyWith<PrayerPartnerUser> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerPartnerUserCopyWith<$Res> {
  factory $PrayerPartnerUserCopyWith(
    PrayerPartnerUser value,
    $Res Function(PrayerPartnerUser) then,
  ) = _$PrayerPartnerUserCopyWithImpl<$Res, PrayerPartnerUser>;
  @useResult
  $Res call({
    String id,
    String? firstName,
    String? lastName,
    String? avatarUrl,
    String email,
  });
}

/// @nodoc
class _$PrayerPartnerUserCopyWithImpl<$Res, $Val extends PrayerPartnerUser>
    implements $PrayerPartnerUserCopyWith<$Res> {
  _$PrayerPartnerUserCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrayerPartnerUser
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
    Object? email = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
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
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PrayerPartnerUserImplCopyWith<$Res>
    implements $PrayerPartnerUserCopyWith<$Res> {
  factory _$$PrayerPartnerUserImplCopyWith(
    _$PrayerPartnerUserImpl value,
    $Res Function(_$PrayerPartnerUserImpl) then,
  ) = __$$PrayerPartnerUserImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String? firstName,
    String? lastName,
    String? avatarUrl,
    String email,
  });
}

/// @nodoc
class __$$PrayerPartnerUserImplCopyWithImpl<$Res>
    extends _$PrayerPartnerUserCopyWithImpl<$Res, _$PrayerPartnerUserImpl>
    implements _$$PrayerPartnerUserImplCopyWith<$Res> {
  __$$PrayerPartnerUserImplCopyWithImpl(
    _$PrayerPartnerUserImpl _value,
    $Res Function(_$PrayerPartnerUserImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrayerPartnerUser
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
    Object? email = null,
  }) {
    return _then(
      _$PrayerPartnerUserImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
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
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrayerPartnerUserImpl implements _PrayerPartnerUser {
  const _$PrayerPartnerUserImpl({
    required this.id,
    this.firstName,
    this.lastName,
    this.avatarUrl,
    required this.email,
  });

  factory _$PrayerPartnerUserImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerPartnerUserImplFromJson(json);

  @override
  final String id;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? avatarUrl;
  @override
  final String email;

  @override
  String toString() {
    return 'PrayerPartnerUser(id: $id, firstName: $firstName, lastName: $lastName, avatarUrl: $avatarUrl, email: $email)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerPartnerUserImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl) &&
            (identical(other.email, email) || other.email == email));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, firstName, lastName, avatarUrl, email);

  /// Create a copy of PrayerPartnerUser
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerPartnerUserImplCopyWith<_$PrayerPartnerUserImpl> get copyWith =>
      __$$PrayerPartnerUserImplCopyWithImpl<_$PrayerPartnerUserImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerPartnerUserImplToJson(this);
  }
}

abstract class _PrayerPartnerUser implements PrayerPartnerUser {
  const factory _PrayerPartnerUser({
    required final String id,
    final String? firstName,
    final String? lastName,
    final String? avatarUrl,
    required final String email,
  }) = _$PrayerPartnerUserImpl;

  factory _PrayerPartnerUser.fromJson(Map<String, dynamic> json) =
      _$PrayerPartnerUserImpl.fromJson;

  @override
  String get id;
  @override
  String? get firstName;
  @override
  String? get lastName;
  @override
  String? get avatarUrl;
  @override
  String get email;

  /// Create a copy of PrayerPartnerUser
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerPartnerUserImplCopyWith<_$PrayerPartnerUserImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PrayerPartner _$PrayerPartnerFromJson(Map<String, dynamic> json) {
  return _PrayerPartner.fromJson(json);
}

/// @nodoc
mixin _$PrayerPartner {
  String get id => throw _privateConstructorUsedError;
  PrayerPartnerUser get partner => throw _privateConstructorUsedError;
  PrayerPartnerStatus get status => throw _privateConstructorUsedError;
  DateTime get since => throw _privateConstructorUsedError;

  /// Serializes this PrayerPartner to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrayerPartner
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerPartnerCopyWith<PrayerPartner> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerPartnerCopyWith<$Res> {
  factory $PrayerPartnerCopyWith(
    PrayerPartner value,
    $Res Function(PrayerPartner) then,
  ) = _$PrayerPartnerCopyWithImpl<$Res, PrayerPartner>;
  @useResult
  $Res call({
    String id,
    PrayerPartnerUser partner,
    PrayerPartnerStatus status,
    DateTime since,
  });

  $PrayerPartnerUserCopyWith<$Res> get partner;
}

/// @nodoc
class _$PrayerPartnerCopyWithImpl<$Res, $Val extends PrayerPartner>
    implements $PrayerPartnerCopyWith<$Res> {
  _$PrayerPartnerCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrayerPartner
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partner = null,
    Object? status = null,
    Object? since = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            partner: null == partner
                ? _value.partner
                : partner // ignore: cast_nullable_to_non_nullable
                      as PrayerPartnerUser,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as PrayerPartnerStatus,
            since: null == since
                ? _value.since
                : since // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }

  /// Create a copy of PrayerPartner
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PrayerPartnerUserCopyWith<$Res> get partner {
    return $PrayerPartnerUserCopyWith<$Res>(_value.partner, (value) {
      return _then(_value.copyWith(partner: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PrayerPartnerImplCopyWith<$Res>
    implements $PrayerPartnerCopyWith<$Res> {
  factory _$$PrayerPartnerImplCopyWith(
    _$PrayerPartnerImpl value,
    $Res Function(_$PrayerPartnerImpl) then,
  ) = __$$PrayerPartnerImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    PrayerPartnerUser partner,
    PrayerPartnerStatus status,
    DateTime since,
  });

  @override
  $PrayerPartnerUserCopyWith<$Res> get partner;
}

/// @nodoc
class __$$PrayerPartnerImplCopyWithImpl<$Res>
    extends _$PrayerPartnerCopyWithImpl<$Res, _$PrayerPartnerImpl>
    implements _$$PrayerPartnerImplCopyWith<$Res> {
  __$$PrayerPartnerImplCopyWithImpl(
    _$PrayerPartnerImpl _value,
    $Res Function(_$PrayerPartnerImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrayerPartner
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? partner = null,
    Object? status = null,
    Object? since = null,
  }) {
    return _then(
      _$PrayerPartnerImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        partner: null == partner
            ? _value.partner
            : partner // ignore: cast_nullable_to_non_nullable
                  as PrayerPartnerUser,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as PrayerPartnerStatus,
        since: null == since
            ? _value.since
            : since // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrayerPartnerImpl implements _PrayerPartner {
  const _$PrayerPartnerImpl({
    required this.id,
    required this.partner,
    required this.status,
    required this.since,
  });

  factory _$PrayerPartnerImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerPartnerImplFromJson(json);

  @override
  final String id;
  @override
  final PrayerPartnerUser partner;
  @override
  final PrayerPartnerStatus status;
  @override
  final DateTime since;

  @override
  String toString() {
    return 'PrayerPartner(id: $id, partner: $partner, status: $status, since: $since)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerPartnerImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.partner, partner) || other.partner == partner) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.since, since) || other.since == since));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, partner, status, since);

  /// Create a copy of PrayerPartner
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerPartnerImplCopyWith<_$PrayerPartnerImpl> get copyWith =>
      __$$PrayerPartnerImplCopyWithImpl<_$PrayerPartnerImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerPartnerImplToJson(this);
  }
}

abstract class _PrayerPartner implements PrayerPartner {
  const factory _PrayerPartner({
    required final String id,
    required final PrayerPartnerUser partner,
    required final PrayerPartnerStatus status,
    required final DateTime since,
  }) = _$PrayerPartnerImpl;

  factory _PrayerPartner.fromJson(Map<String, dynamic> json) =
      _$PrayerPartnerImpl.fromJson;

  @override
  String get id;
  @override
  PrayerPartnerUser get partner;
  @override
  PrayerPartnerStatus get status;
  @override
  DateTime get since;

  /// Create a copy of PrayerPartner
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerPartnerImplCopyWith<_$PrayerPartnerImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PartnerRequest _$PartnerRequestFromJson(Map<String, dynamic> json) {
  return _PartnerRequest.fromJson(json);
}

/// @nodoc
mixin _$PartnerRequest {
  String get id => throw _privateConstructorUsedError;
  PrayerPartnerUser get requester => throw _privateConstructorUsedError;
  PrayerPartnerStatus get status => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;

  /// Serializes this PartnerRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PartnerRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PartnerRequestCopyWith<PartnerRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PartnerRequestCopyWith<$Res> {
  factory $PartnerRequestCopyWith(
    PartnerRequest value,
    $Res Function(PartnerRequest) then,
  ) = _$PartnerRequestCopyWithImpl<$Res, PartnerRequest>;
  @useResult
  $Res call({
    String id,
    PrayerPartnerUser requester,
    PrayerPartnerStatus status,
    DateTime createdAt,
  });

  $PrayerPartnerUserCopyWith<$Res> get requester;
}

/// @nodoc
class _$PartnerRequestCopyWithImpl<$Res, $Val extends PartnerRequest>
    implements $PartnerRequestCopyWith<$Res> {
  _$PartnerRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PartnerRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? requester = null,
    Object? status = null,
    Object? createdAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            requester: null == requester
                ? _value.requester
                : requester // ignore: cast_nullable_to_non_nullable
                      as PrayerPartnerUser,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as PrayerPartnerStatus,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
          )
          as $Val,
    );
  }

  /// Create a copy of PartnerRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $PrayerPartnerUserCopyWith<$Res> get requester {
    return $PrayerPartnerUserCopyWith<$Res>(_value.requester, (value) {
      return _then(_value.copyWith(requester: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PartnerRequestImplCopyWith<$Res>
    implements $PartnerRequestCopyWith<$Res> {
  factory _$$PartnerRequestImplCopyWith(
    _$PartnerRequestImpl value,
    $Res Function(_$PartnerRequestImpl) then,
  ) = __$$PartnerRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    PrayerPartnerUser requester,
    PrayerPartnerStatus status,
    DateTime createdAt,
  });

  @override
  $PrayerPartnerUserCopyWith<$Res> get requester;
}

/// @nodoc
class __$$PartnerRequestImplCopyWithImpl<$Res>
    extends _$PartnerRequestCopyWithImpl<$Res, _$PartnerRequestImpl>
    implements _$$PartnerRequestImplCopyWith<$Res> {
  __$$PartnerRequestImplCopyWithImpl(
    _$PartnerRequestImpl _value,
    $Res Function(_$PartnerRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PartnerRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? requester = null,
    Object? status = null,
    Object? createdAt = null,
  }) {
    return _then(
      _$PartnerRequestImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        requester: null == requester
            ? _value.requester
            : requester // ignore: cast_nullable_to_non_nullable
                  as PrayerPartnerUser,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as PrayerPartnerStatus,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PartnerRequestImpl implements _PartnerRequest {
  const _$PartnerRequestImpl({
    required this.id,
    required this.requester,
    required this.status,
    required this.createdAt,
  });

  factory _$PartnerRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$PartnerRequestImplFromJson(json);

  @override
  final String id;
  @override
  final PrayerPartnerUser requester;
  @override
  final PrayerPartnerStatus status;
  @override
  final DateTime createdAt;

  @override
  String toString() {
    return 'PartnerRequest(id: $id, requester: $requester, status: $status, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PartnerRequestImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.requester, requester) ||
                other.requester == requester) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, requester, status, createdAt);

  /// Create a copy of PartnerRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PartnerRequestImplCopyWith<_$PartnerRequestImpl> get copyWith =>
      __$$PartnerRequestImplCopyWithImpl<_$PartnerRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$PartnerRequestImplToJson(this);
  }
}

abstract class _PartnerRequest implements PartnerRequest {
  const factory _PartnerRequest({
    required final String id,
    required final PrayerPartnerUser requester,
    required final PrayerPartnerStatus status,
    required final DateTime createdAt,
  }) = _$PartnerRequestImpl;

  factory _PartnerRequest.fromJson(Map<String, dynamic> json) =
      _$PartnerRequestImpl.fromJson;

  @override
  String get id;
  @override
  PrayerPartnerUser get requester;
  @override
  PrayerPartnerStatus get status;
  @override
  DateTime get createdAt;

  /// Create a copy of PartnerRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PartnerRequestImplCopyWith<_$PartnerRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
