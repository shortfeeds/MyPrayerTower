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

PrayerRequest _$PrayerRequestFromJson(Map<String, dynamic> json) {
  return _PrayerRequest.fromJson(json);
}

/// @nodoc
mixin _$PrayerRequest {
  String get id => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String? get userId => throw _privateConstructorUsedError;
  @JsonKey(name: 'prayerCount')
  int get prayCount => throw _privateConstructorUsedError;
  bool get isAnonymous => throw _privateConstructorUsedError;
  String? get category => throw _privateConstructorUsedError;
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
    @JsonKey(name: 'prayerCount') int prayCount,
    bool isAnonymous,
    String? category,
    DateTime? createdAt,
  });
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
    Object? prayCount = null,
    Object? isAnonymous = null,
    Object? category = freezed,
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
            prayCount: null == prayCount
                ? _value.prayCount
                : prayCount // ignore: cast_nullable_to_non_nullable
                      as int,
            isAnonymous: null == isAnonymous
                ? _value.isAnonymous
                : isAnonymous // ignore: cast_nullable_to_non_nullable
                      as bool,
            category: freezed == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String?,
            createdAt: freezed == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
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
    @JsonKey(name: 'prayerCount') int prayCount,
    bool isAnonymous,
    String? category,
    DateTime? createdAt,
  });
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
    Object? prayCount = null,
    Object? isAnonymous = null,
    Object? category = freezed,
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
        prayCount: null == prayCount
            ? _value.prayCount
            : prayCount // ignore: cast_nullable_to_non_nullable
                  as int,
        isAnonymous: null == isAnonymous
            ? _value.isAnonymous
            : isAnonymous // ignore: cast_nullable_to_non_nullable
                  as bool,
        category: freezed == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String?,
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
    @JsonKey(name: 'prayerCount') this.prayCount = 0,
    required this.isAnonymous,
    this.category,
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
  final int prayCount;
  @override
  final bool isAnonymous;
  @override
  final String? category;
  @override
  final DateTime? createdAt;

  @override
  String toString() {
    return 'PrayerRequest(id: $id, content: $content, userId: $userId, prayCount: $prayCount, isAnonymous: $isAnonymous, category: $category, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerRequestImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.prayCount, prayCount) ||
                other.prayCount == prayCount) &&
            (identical(other.isAnonymous, isAnonymous) ||
                other.isAnonymous == isAnonymous) &&
            (identical(other.category, category) ||
                other.category == category) &&
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
    prayCount,
    isAnonymous,
    category,
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
    @JsonKey(name: 'prayerCount') final int prayCount,
    required final bool isAnonymous,
    final String? category,
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
  int get prayCount;
  @override
  bool get isAnonymous;
  @override
  String? get category;
  @override
  DateTime? get createdAt;

  /// Create a copy of PrayerRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerRequestImplCopyWith<_$PrayerRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
