// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'prayer_group_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

PrayerGroup _$PrayerGroupFromJson(Map<String, dynamic> json) {
  return _PrayerGroup.fromJson(json);
}

/// @nodoc
mixin _$PrayerGroup {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  bool get isPrivate => throw _privateConstructorUsedError;
  String get createdBy => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime get updatedAt => throw _privateConstructorUsedError;
  List<PrayerGroupMember>? get members => throw _privateConstructorUsedError;
  List<GroupPrayer>? get prayers => throw _privateConstructorUsedError;
  @JsonKey(name: '_count')
  GroupCounts? get counts => throw _privateConstructorUsedError;

  /// Serializes this PrayerGroup to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrayerGroup
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerGroupCopyWith<PrayerGroup> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerGroupCopyWith<$Res> {
  factory $PrayerGroupCopyWith(
    PrayerGroup value,
    $Res Function(PrayerGroup) then,
  ) = _$PrayerGroupCopyWithImpl<$Res, PrayerGroup>;
  @useResult
  $Res call({
    String id,
    String name,
    String? description,
    bool isPrivate,
    String createdBy,
    DateTime createdAt,
    DateTime updatedAt,
    List<PrayerGroupMember>? members,
    List<GroupPrayer>? prayers,
    @JsonKey(name: '_count') GroupCounts? counts,
  });

  $GroupCountsCopyWith<$Res>? get counts;
}

/// @nodoc
class _$PrayerGroupCopyWithImpl<$Res, $Val extends PrayerGroup>
    implements $PrayerGroupCopyWith<$Res> {
  _$PrayerGroupCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrayerGroup
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? isPrivate = null,
    Object? createdBy = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? members = freezed,
    Object? prayers = freezed,
    Object? counts = freezed,
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
            description: freezed == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String?,
            isPrivate: null == isPrivate
                ? _value.isPrivate
                : isPrivate // ignore: cast_nullable_to_non_nullable
                      as bool,
            createdBy: null == createdBy
                ? _value.createdBy
                : createdBy // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            members: freezed == members
                ? _value.members
                : members // ignore: cast_nullable_to_non_nullable
                      as List<PrayerGroupMember>?,
            prayers: freezed == prayers
                ? _value.prayers
                : prayers // ignore: cast_nullable_to_non_nullable
                      as List<GroupPrayer>?,
            counts: freezed == counts
                ? _value.counts
                : counts // ignore: cast_nullable_to_non_nullable
                      as GroupCounts?,
          )
          as $Val,
    );
  }

  /// Create a copy of PrayerGroup
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $GroupCountsCopyWith<$Res>? get counts {
    if (_value.counts == null) {
      return null;
    }

    return $GroupCountsCopyWith<$Res>(_value.counts!, (value) {
      return _then(_value.copyWith(counts: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PrayerGroupImplCopyWith<$Res>
    implements $PrayerGroupCopyWith<$Res> {
  factory _$$PrayerGroupImplCopyWith(
    _$PrayerGroupImpl value,
    $Res Function(_$PrayerGroupImpl) then,
  ) = __$$PrayerGroupImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String? description,
    bool isPrivate,
    String createdBy,
    DateTime createdAt,
    DateTime updatedAt,
    List<PrayerGroupMember>? members,
    List<GroupPrayer>? prayers,
    @JsonKey(name: '_count') GroupCounts? counts,
  });

  @override
  $GroupCountsCopyWith<$Res>? get counts;
}

/// @nodoc
class __$$PrayerGroupImplCopyWithImpl<$Res>
    extends _$PrayerGroupCopyWithImpl<$Res, _$PrayerGroupImpl>
    implements _$$PrayerGroupImplCopyWith<$Res> {
  __$$PrayerGroupImplCopyWithImpl(
    _$PrayerGroupImpl _value,
    $Res Function(_$PrayerGroupImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrayerGroup
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? description = freezed,
    Object? isPrivate = null,
    Object? createdBy = null,
    Object? createdAt = null,
    Object? updatedAt = null,
    Object? members = freezed,
    Object? prayers = freezed,
    Object? counts = freezed,
  }) {
    return _then(
      _$PrayerGroupImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        description: freezed == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String?,
        isPrivate: null == isPrivate
            ? _value.isPrivate
            : isPrivate // ignore: cast_nullable_to_non_nullable
                  as bool,
        createdBy: null == createdBy
            ? _value.createdBy
            : createdBy // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        members: freezed == members
            ? _value._members
            : members // ignore: cast_nullable_to_non_nullable
                  as List<PrayerGroupMember>?,
        prayers: freezed == prayers
            ? _value._prayers
            : prayers // ignore: cast_nullable_to_non_nullable
                  as List<GroupPrayer>?,
        counts: freezed == counts
            ? _value.counts
            : counts // ignore: cast_nullable_to_non_nullable
                  as GroupCounts?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrayerGroupImpl implements _PrayerGroup {
  const _$PrayerGroupImpl({
    required this.id,
    required this.name,
    this.description,
    this.isPrivate = true,
    required this.createdBy,
    required this.createdAt,
    required this.updatedAt,
    final List<PrayerGroupMember>? members,
    final List<GroupPrayer>? prayers,
    @JsonKey(name: '_count') this.counts,
  }) : _members = members,
       _prayers = prayers;

  factory _$PrayerGroupImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerGroupImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String? description;
  @override
  @JsonKey()
  final bool isPrivate;
  @override
  final String createdBy;
  @override
  final DateTime createdAt;
  @override
  final DateTime updatedAt;
  final List<PrayerGroupMember>? _members;
  @override
  List<PrayerGroupMember>? get members {
    final value = _members;
    if (value == null) return null;
    if (_members is EqualUnmodifiableListView) return _members;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  final List<GroupPrayer>? _prayers;
  @override
  List<GroupPrayer>? get prayers {
    final value = _prayers;
    if (value == null) return null;
    if (_prayers is EqualUnmodifiableListView) return _prayers;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  @JsonKey(name: '_count')
  final GroupCounts? counts;

  @override
  String toString() {
    return 'PrayerGroup(id: $id, name: $name, description: $description, isPrivate: $isPrivate, createdBy: $createdBy, createdAt: $createdAt, updatedAt: $updatedAt, members: $members, prayers: $prayers, counts: $counts)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerGroupImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.isPrivate, isPrivate) ||
                other.isPrivate == isPrivate) &&
            (identical(other.createdBy, createdBy) ||
                other.createdBy == createdBy) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt) &&
            const DeepCollectionEquality().equals(other._members, _members) &&
            const DeepCollectionEquality().equals(other._prayers, _prayers) &&
            (identical(other.counts, counts) || other.counts == counts));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    description,
    isPrivate,
    createdBy,
    createdAt,
    updatedAt,
    const DeepCollectionEquality().hash(_members),
    const DeepCollectionEquality().hash(_prayers),
    counts,
  );

  /// Create a copy of PrayerGroup
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerGroupImplCopyWith<_$PrayerGroupImpl> get copyWith =>
      __$$PrayerGroupImplCopyWithImpl<_$PrayerGroupImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerGroupImplToJson(this);
  }
}

abstract class _PrayerGroup implements PrayerGroup {
  const factory _PrayerGroup({
    required final String id,
    required final String name,
    final String? description,
    final bool isPrivate,
    required final String createdBy,
    required final DateTime createdAt,
    required final DateTime updatedAt,
    final List<PrayerGroupMember>? members,
    final List<GroupPrayer>? prayers,
    @JsonKey(name: '_count') final GroupCounts? counts,
  }) = _$PrayerGroupImpl;

  factory _PrayerGroup.fromJson(Map<String, dynamic> json) =
      _$PrayerGroupImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String? get description;
  @override
  bool get isPrivate;
  @override
  String get createdBy;
  @override
  DateTime get createdAt;
  @override
  DateTime get updatedAt;
  @override
  List<PrayerGroupMember>? get members;
  @override
  List<GroupPrayer>? get prayers;
  @override
  @JsonKey(name: '_count')
  GroupCounts? get counts;

  /// Create a copy of PrayerGroup
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerGroupImplCopyWith<_$PrayerGroupImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

GroupCounts _$GroupCountsFromJson(Map<String, dynamic> json) {
  return _GroupCounts.fromJson(json);
}

/// @nodoc
mixin _$GroupCounts {
  int get members => throw _privateConstructorUsedError;
  int get prayers => throw _privateConstructorUsedError;

  /// Serializes this GroupCounts to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GroupCounts
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GroupCountsCopyWith<GroupCounts> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GroupCountsCopyWith<$Res> {
  factory $GroupCountsCopyWith(
    GroupCounts value,
    $Res Function(GroupCounts) then,
  ) = _$GroupCountsCopyWithImpl<$Res, GroupCounts>;
  @useResult
  $Res call({int members, int prayers});
}

/// @nodoc
class _$GroupCountsCopyWithImpl<$Res, $Val extends GroupCounts>
    implements $GroupCountsCopyWith<$Res> {
  _$GroupCountsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GroupCounts
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? members = null, Object? prayers = null}) {
    return _then(
      _value.copyWith(
            members: null == members
                ? _value.members
                : members // ignore: cast_nullable_to_non_nullable
                      as int,
            prayers: null == prayers
                ? _value.prayers
                : prayers // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$GroupCountsImplCopyWith<$Res>
    implements $GroupCountsCopyWith<$Res> {
  factory _$$GroupCountsImplCopyWith(
    _$GroupCountsImpl value,
    $Res Function(_$GroupCountsImpl) then,
  ) = __$$GroupCountsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({int members, int prayers});
}

/// @nodoc
class __$$GroupCountsImplCopyWithImpl<$Res>
    extends _$GroupCountsCopyWithImpl<$Res, _$GroupCountsImpl>
    implements _$$GroupCountsImplCopyWith<$Res> {
  __$$GroupCountsImplCopyWithImpl(
    _$GroupCountsImpl _value,
    $Res Function(_$GroupCountsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of GroupCounts
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? members = null, Object? prayers = null}) {
    return _then(
      _$GroupCountsImpl(
        members: null == members
            ? _value.members
            : members // ignore: cast_nullable_to_non_nullable
                  as int,
        prayers: null == prayers
            ? _value.prayers
            : prayers // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$GroupCountsImpl implements _GroupCounts {
  const _$GroupCountsImpl({this.members = 0, this.prayers = 0});

  factory _$GroupCountsImpl.fromJson(Map<String, dynamic> json) =>
      _$$GroupCountsImplFromJson(json);

  @override
  @JsonKey()
  final int members;
  @override
  @JsonKey()
  final int prayers;

  @override
  String toString() {
    return 'GroupCounts(members: $members, prayers: $prayers)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GroupCountsImpl &&
            (identical(other.members, members) || other.members == members) &&
            (identical(other.prayers, prayers) || other.prayers == prayers));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, members, prayers);

  /// Create a copy of GroupCounts
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GroupCountsImplCopyWith<_$GroupCountsImpl> get copyWith =>
      __$$GroupCountsImplCopyWithImpl<_$GroupCountsImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GroupCountsImplToJson(this);
  }
}

abstract class _GroupCounts implements GroupCounts {
  const factory _GroupCounts({final int members, final int prayers}) =
      _$GroupCountsImpl;

  factory _GroupCounts.fromJson(Map<String, dynamic> json) =
      _$GroupCountsImpl.fromJson;

  @override
  int get members;
  @override
  int get prayers;

  /// Create a copy of GroupCounts
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GroupCountsImplCopyWith<_$GroupCountsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PrayerGroupMember _$PrayerGroupMemberFromJson(Map<String, dynamic> json) {
  return _PrayerGroupMember.fromJson(json);
}

/// @nodoc
mixin _$PrayerGroupMember {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String get role => throw _privateConstructorUsedError; // ADMIN, MEMBER
  DateTime? get joinedAt => throw _privateConstructorUsedError;
  GroupMemberUser? get user => throw _privateConstructorUsedError;

  /// Serializes this PrayerGroupMember to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PrayerGroupMember
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerGroupMemberCopyWith<PrayerGroupMember> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerGroupMemberCopyWith<$Res> {
  factory $PrayerGroupMemberCopyWith(
    PrayerGroupMember value,
    $Res Function(PrayerGroupMember) then,
  ) = _$PrayerGroupMemberCopyWithImpl<$Res, PrayerGroupMember>;
  @useResult
  $Res call({
    String id,
    String userId,
    String role,
    DateTime? joinedAt,
    GroupMemberUser? user,
  });

  $GroupMemberUserCopyWith<$Res>? get user;
}

/// @nodoc
class _$PrayerGroupMemberCopyWithImpl<$Res, $Val extends PrayerGroupMember>
    implements $PrayerGroupMemberCopyWith<$Res> {
  _$PrayerGroupMemberCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PrayerGroupMember
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? role = null,
    Object? joinedAt = freezed,
    Object? user = freezed,
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
            role: null == role
                ? _value.role
                : role // ignore: cast_nullable_to_non_nullable
                      as String,
            joinedAt: freezed == joinedAt
                ? _value.joinedAt
                : joinedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            user: freezed == user
                ? _value.user
                : user // ignore: cast_nullable_to_non_nullable
                      as GroupMemberUser?,
          )
          as $Val,
    );
  }

  /// Create a copy of PrayerGroupMember
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $GroupMemberUserCopyWith<$Res>? get user {
    if (_value.user == null) {
      return null;
    }

    return $GroupMemberUserCopyWith<$Res>(_value.user!, (value) {
      return _then(_value.copyWith(user: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$PrayerGroupMemberImplCopyWith<$Res>
    implements $PrayerGroupMemberCopyWith<$Res> {
  factory _$$PrayerGroupMemberImplCopyWith(
    _$PrayerGroupMemberImpl value,
    $Res Function(_$PrayerGroupMemberImpl) then,
  ) = __$$PrayerGroupMemberImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String userId,
    String role,
    DateTime? joinedAt,
    GroupMemberUser? user,
  });

  @override
  $GroupMemberUserCopyWith<$Res>? get user;
}

/// @nodoc
class __$$PrayerGroupMemberImplCopyWithImpl<$Res>
    extends _$PrayerGroupMemberCopyWithImpl<$Res, _$PrayerGroupMemberImpl>
    implements _$$PrayerGroupMemberImplCopyWith<$Res> {
  __$$PrayerGroupMemberImplCopyWithImpl(
    _$PrayerGroupMemberImpl _value,
    $Res Function(_$PrayerGroupMemberImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PrayerGroupMember
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? role = null,
    Object? joinedAt = freezed,
    Object? user = freezed,
  }) {
    return _then(
      _$PrayerGroupMemberImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: null == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String,
        role: null == role
            ? _value.role
            : role // ignore: cast_nullable_to_non_nullable
                  as String,
        joinedAt: freezed == joinedAt
            ? _value.joinedAt
            : joinedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        user: freezed == user
            ? _value.user
            : user // ignore: cast_nullable_to_non_nullable
                  as GroupMemberUser?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PrayerGroupMemberImpl implements _PrayerGroupMember {
  const _$PrayerGroupMemberImpl({
    required this.id,
    required this.userId,
    required this.role,
    this.joinedAt,
    this.user,
  });

  factory _$PrayerGroupMemberImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerGroupMemberImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final String role;
  // ADMIN, MEMBER
  @override
  final DateTime? joinedAt;
  @override
  final GroupMemberUser? user;

  @override
  String toString() {
    return 'PrayerGroupMember(id: $id, userId: $userId, role: $role, joinedAt: $joinedAt, user: $user)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerGroupMemberImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.role, role) || other.role == role) &&
            (identical(other.joinedAt, joinedAt) ||
                other.joinedAt == joinedAt) &&
            (identical(other.user, user) || other.user == user));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, userId, role, joinedAt, user);

  /// Create a copy of PrayerGroupMember
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerGroupMemberImplCopyWith<_$PrayerGroupMemberImpl> get copyWith =>
      __$$PrayerGroupMemberImplCopyWithImpl<_$PrayerGroupMemberImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerGroupMemberImplToJson(this);
  }
}

abstract class _PrayerGroupMember implements PrayerGroupMember {
  const factory _PrayerGroupMember({
    required final String id,
    required final String userId,
    required final String role,
    final DateTime? joinedAt,
    final GroupMemberUser? user,
  }) = _$PrayerGroupMemberImpl;

  factory _PrayerGroupMember.fromJson(Map<String, dynamic> json) =
      _$PrayerGroupMemberImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  String get role; // ADMIN, MEMBER
  @override
  DateTime? get joinedAt;
  @override
  GroupMemberUser? get user;

  /// Create a copy of PrayerGroupMember
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerGroupMemberImplCopyWith<_$PrayerGroupMemberImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

GroupMemberUser _$GroupMemberUserFromJson(Map<String, dynamic> json) {
  return _GroupMemberUser.fromJson(json);
}

/// @nodoc
mixin _$GroupMemberUser {
  String get id => throw _privateConstructorUsedError;
  String? get firstName => throw _privateConstructorUsedError;
  String? get lastName => throw _privateConstructorUsedError;
  String? get avatarUrl => throw _privateConstructorUsedError;

  /// Serializes this GroupMemberUser to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GroupMemberUser
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GroupMemberUserCopyWith<GroupMemberUser> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GroupMemberUserCopyWith<$Res> {
  factory $GroupMemberUserCopyWith(
    GroupMemberUser value,
    $Res Function(GroupMemberUser) then,
  ) = _$GroupMemberUserCopyWithImpl<$Res, GroupMemberUser>;
  @useResult
  $Res call({
    String id,
    String? firstName,
    String? lastName,
    String? avatarUrl,
  });
}

/// @nodoc
class _$GroupMemberUserCopyWithImpl<$Res, $Val extends GroupMemberUser>
    implements $GroupMemberUserCopyWith<$Res> {
  _$GroupMemberUserCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GroupMemberUser
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
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
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$GroupMemberUserImplCopyWith<$Res>
    implements $GroupMemberUserCopyWith<$Res> {
  factory _$$GroupMemberUserImplCopyWith(
    _$GroupMemberUserImpl value,
    $Res Function(_$GroupMemberUserImpl) then,
  ) = __$$GroupMemberUserImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String? firstName,
    String? lastName,
    String? avatarUrl,
  });
}

/// @nodoc
class __$$GroupMemberUserImplCopyWithImpl<$Res>
    extends _$GroupMemberUserCopyWithImpl<$Res, _$GroupMemberUserImpl>
    implements _$$GroupMemberUserImplCopyWith<$Res> {
  __$$GroupMemberUserImplCopyWithImpl(
    _$GroupMemberUserImpl _value,
    $Res Function(_$GroupMemberUserImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of GroupMemberUser
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? firstName = freezed,
    Object? lastName = freezed,
    Object? avatarUrl = freezed,
  }) {
    return _then(
      _$GroupMemberUserImpl(
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
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$GroupMemberUserImpl implements _GroupMemberUser {
  const _$GroupMemberUserImpl({
    required this.id,
    this.firstName,
    this.lastName,
    this.avatarUrl,
  });

  factory _$GroupMemberUserImpl.fromJson(Map<String, dynamic> json) =>
      _$$GroupMemberUserImplFromJson(json);

  @override
  final String id;
  @override
  final String? firstName;
  @override
  final String? lastName;
  @override
  final String? avatarUrl;

  @override
  String toString() {
    return 'GroupMemberUser(id: $id, firstName: $firstName, lastName: $lastName, avatarUrl: $avatarUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GroupMemberUserImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.firstName, firstName) ||
                other.firstName == firstName) &&
            (identical(other.lastName, lastName) ||
                other.lastName == lastName) &&
            (identical(other.avatarUrl, avatarUrl) ||
                other.avatarUrl == avatarUrl));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, firstName, lastName, avatarUrl);

  /// Create a copy of GroupMemberUser
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GroupMemberUserImplCopyWith<_$GroupMemberUserImpl> get copyWith =>
      __$$GroupMemberUserImplCopyWithImpl<_$GroupMemberUserImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$GroupMemberUserImplToJson(this);
  }
}

abstract class _GroupMemberUser implements GroupMemberUser {
  const factory _GroupMemberUser({
    required final String id,
    final String? firstName,
    final String? lastName,
    final String? avatarUrl,
  }) = _$GroupMemberUserImpl;

  factory _GroupMemberUser.fromJson(Map<String, dynamic> json) =
      _$GroupMemberUserImpl.fromJson;

  @override
  String get id;
  @override
  String? get firstName;
  @override
  String? get lastName;
  @override
  String? get avatarUrl;

  /// Create a copy of GroupMemberUser
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GroupMemberUserImplCopyWith<_$GroupMemberUserImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

GroupPrayer _$GroupPrayerFromJson(Map<String, dynamic> json) {
  return _GroupPrayer.fromJson(json);
}

/// @nodoc
mixin _$GroupPrayer {
  String get id => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  GroupMemberUser? get user => throw _privateConstructorUsedError;

  /// Serializes this GroupPrayer to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of GroupPrayer
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $GroupPrayerCopyWith<GroupPrayer> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $GroupPrayerCopyWith<$Res> {
  factory $GroupPrayerCopyWith(
    GroupPrayer value,
    $Res Function(GroupPrayer) then,
  ) = _$GroupPrayerCopyWithImpl<$Res, GroupPrayer>;
  @useResult
  $Res call({
    String id,
    String content,
    String userId,
    DateTime createdAt,
    GroupMemberUser? user,
  });

  $GroupMemberUserCopyWith<$Res>? get user;
}

/// @nodoc
class _$GroupPrayerCopyWithImpl<$Res, $Val extends GroupPrayer>
    implements $GroupPrayerCopyWith<$Res> {
  _$GroupPrayerCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of GroupPrayer
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? content = null,
    Object? userId = null,
    Object? createdAt = null,
    Object? user = freezed,
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
            userId: null == userId
                ? _value.userId
                : userId // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            user: freezed == user
                ? _value.user
                : user // ignore: cast_nullable_to_non_nullable
                      as GroupMemberUser?,
          )
          as $Val,
    );
  }

  /// Create a copy of GroupPrayer
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $GroupMemberUserCopyWith<$Res>? get user {
    if (_value.user == null) {
      return null;
    }

    return $GroupMemberUserCopyWith<$Res>(_value.user!, (value) {
      return _then(_value.copyWith(user: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$GroupPrayerImplCopyWith<$Res>
    implements $GroupPrayerCopyWith<$Res> {
  factory _$$GroupPrayerImplCopyWith(
    _$GroupPrayerImpl value,
    $Res Function(_$GroupPrayerImpl) then,
  ) = __$$GroupPrayerImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String content,
    String userId,
    DateTime createdAt,
    GroupMemberUser? user,
  });

  @override
  $GroupMemberUserCopyWith<$Res>? get user;
}

/// @nodoc
class __$$GroupPrayerImplCopyWithImpl<$Res>
    extends _$GroupPrayerCopyWithImpl<$Res, _$GroupPrayerImpl>
    implements _$$GroupPrayerImplCopyWith<$Res> {
  __$$GroupPrayerImplCopyWithImpl(
    _$GroupPrayerImpl _value,
    $Res Function(_$GroupPrayerImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of GroupPrayer
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? content = null,
    Object? userId = null,
    Object? createdAt = null,
    Object? user = freezed,
  }) {
    return _then(
      _$GroupPrayerImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: null == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        user: freezed == user
            ? _value.user
            : user // ignore: cast_nullable_to_non_nullable
                  as GroupMemberUser?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$GroupPrayerImpl implements _GroupPrayer {
  const _$GroupPrayerImpl({
    required this.id,
    required this.content,
    required this.userId,
    required this.createdAt,
    this.user,
  });

  factory _$GroupPrayerImpl.fromJson(Map<String, dynamic> json) =>
      _$$GroupPrayerImplFromJson(json);

  @override
  final String id;
  @override
  final String content;
  @override
  final String userId;
  @override
  final DateTime createdAt;
  @override
  final GroupMemberUser? user;

  @override
  String toString() {
    return 'GroupPrayer(id: $id, content: $content, userId: $userId, createdAt: $createdAt, user: $user)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$GroupPrayerImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.user, user) || other.user == user));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, content, userId, createdAt, user);

  /// Create a copy of GroupPrayer
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$GroupPrayerImplCopyWith<_$GroupPrayerImpl> get copyWith =>
      __$$GroupPrayerImplCopyWithImpl<_$GroupPrayerImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$GroupPrayerImplToJson(this);
  }
}

abstract class _GroupPrayer implements GroupPrayer {
  const factory _GroupPrayer({
    required final String id,
    required final String content,
    required final String userId,
    required final DateTime createdAt,
    final GroupMemberUser? user,
  }) = _$GroupPrayerImpl;

  factory _GroupPrayer.fromJson(Map<String, dynamic> json) =
      _$GroupPrayerImpl.fromJson;

  @override
  String get id;
  @override
  String get content;
  @override
  String get userId;
  @override
  DateTime get createdAt;
  @override
  GroupMemberUser? get user;

  /// Create a copy of GroupPrayer
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$GroupPrayerImplCopyWith<_$GroupPrayerImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
