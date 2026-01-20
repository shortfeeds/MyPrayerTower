// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'candle_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Candle _$CandleFromJson(Map<String, dynamic> json) {
  return _Candle.fromJson(json);
}

/// @nodoc
mixin _$Candle {
  String get id => throw _privateConstructorUsedError;
  String get intention => throw _privateConstructorUsedError;
  bool get isAnonymous => throw _privateConstructorUsedError;
  String? get name => throw _privateConstructorUsedError;
  String get duration =>
      throw _privateConstructorUsedError; // ONE_DAY, THREE_DAYS, SEVEN_DAYS, THIRTY_DAYS
  DateTime get litAt => throw _privateConstructorUsedError;
  DateTime get expiresAt => throw _privateConstructorUsedError;
  bool get isActive =>
      throw _privateConstructorUsedError; // Helper fields for UI (calculated or fallback)
  int get prayerCount => throw _privateConstructorUsedError;

  /// Serializes this Candle to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Candle
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CandleCopyWith<Candle> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CandleCopyWith<$Res> {
  factory $CandleCopyWith(Candle value, $Res Function(Candle) then) =
      _$CandleCopyWithImpl<$Res, Candle>;
  @useResult
  $Res call({
    String id,
    String intention,
    bool isAnonymous,
    String? name,
    String duration,
    DateTime litAt,
    DateTime expiresAt,
    bool isActive,
    int prayerCount,
  });
}

/// @nodoc
class _$CandleCopyWithImpl<$Res, $Val extends Candle>
    implements $CandleCopyWith<$Res> {
  _$CandleCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Candle
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? intention = null,
    Object? isAnonymous = null,
    Object? name = freezed,
    Object? duration = null,
    Object? litAt = null,
    Object? expiresAt = null,
    Object? isActive = null,
    Object? prayerCount = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            intention: null == intention
                ? _value.intention
                : intention // ignore: cast_nullable_to_non_nullable
                      as String,
            isAnonymous: null == isAnonymous
                ? _value.isAnonymous
                : isAnonymous // ignore: cast_nullable_to_non_nullable
                      as bool,
            name: freezed == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String?,
            duration: null == duration
                ? _value.duration
                : duration // ignore: cast_nullable_to_non_nullable
                      as String,
            litAt: null == litAt
                ? _value.litAt
                : litAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            expiresAt: null == expiresAt
                ? _value.expiresAt
                : expiresAt // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            prayerCount: null == prayerCount
                ? _value.prayerCount
                : prayerCount // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CandleImplCopyWith<$Res> implements $CandleCopyWith<$Res> {
  factory _$$CandleImplCopyWith(
    _$CandleImpl value,
    $Res Function(_$CandleImpl) then,
  ) = __$$CandleImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String intention,
    bool isAnonymous,
    String? name,
    String duration,
    DateTime litAt,
    DateTime expiresAt,
    bool isActive,
    int prayerCount,
  });
}

/// @nodoc
class __$$CandleImplCopyWithImpl<$Res>
    extends _$CandleCopyWithImpl<$Res, _$CandleImpl>
    implements _$$CandleImplCopyWith<$Res> {
  __$$CandleImplCopyWithImpl(
    _$CandleImpl _value,
    $Res Function(_$CandleImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Candle
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? intention = null,
    Object? isAnonymous = null,
    Object? name = freezed,
    Object? duration = null,
    Object? litAt = null,
    Object? expiresAt = null,
    Object? isActive = null,
    Object? prayerCount = null,
  }) {
    return _then(
      _$CandleImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        intention: null == intention
            ? _value.intention
            : intention // ignore: cast_nullable_to_non_nullable
                  as String,
        isAnonymous: null == isAnonymous
            ? _value.isAnonymous
            : isAnonymous // ignore: cast_nullable_to_non_nullable
                  as bool,
        name: freezed == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String?,
        duration: null == duration
            ? _value.duration
            : duration // ignore: cast_nullable_to_non_nullable
                  as String,
        litAt: null == litAt
            ? _value.litAt
            : litAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        expiresAt: null == expiresAt
            ? _value.expiresAt
            : expiresAt // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        prayerCount: null == prayerCount
            ? _value.prayerCount
            : prayerCount // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CandleImpl extends _Candle {
  const _$CandleImpl({
    required this.id,
    required this.intention,
    this.isAnonymous = false,
    this.name,
    required this.duration,
    required this.litAt,
    required this.expiresAt,
    this.isActive = true,
    this.prayerCount = 0,
  }) : super._();

  factory _$CandleImpl.fromJson(Map<String, dynamic> json) =>
      _$$CandleImplFromJson(json);

  @override
  final String id;
  @override
  final String intention;
  @override
  @JsonKey()
  final bool isAnonymous;
  @override
  final String? name;
  @override
  final String duration;
  // ONE_DAY, THREE_DAYS, SEVEN_DAYS, THIRTY_DAYS
  @override
  final DateTime litAt;
  @override
  final DateTime expiresAt;
  @override
  @JsonKey()
  final bool isActive;
  // Helper fields for UI (calculated or fallback)
  @override
  @JsonKey()
  final int prayerCount;

  @override
  String toString() {
    return 'Candle(id: $id, intention: $intention, isAnonymous: $isAnonymous, name: $name, duration: $duration, litAt: $litAt, expiresAt: $expiresAt, isActive: $isActive, prayerCount: $prayerCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CandleImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.intention, intention) ||
                other.intention == intention) &&
            (identical(other.isAnonymous, isAnonymous) ||
                other.isAnonymous == isAnonymous) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.litAt, litAt) || other.litAt == litAt) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.prayerCount, prayerCount) ||
                other.prayerCount == prayerCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    intention,
    isAnonymous,
    name,
    duration,
    litAt,
    expiresAt,
    isActive,
    prayerCount,
  );

  /// Create a copy of Candle
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CandleImplCopyWith<_$CandleImpl> get copyWith =>
      __$$CandleImplCopyWithImpl<_$CandleImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CandleImplToJson(this);
  }
}

abstract class _Candle extends Candle {
  const factory _Candle({
    required final String id,
    required final String intention,
    final bool isAnonymous,
    final String? name,
    required final String duration,
    required final DateTime litAt,
    required final DateTime expiresAt,
    final bool isActive,
    final int prayerCount,
  }) = _$CandleImpl;
  const _Candle._() : super._();

  factory _Candle.fromJson(Map<String, dynamic> json) = _$CandleImpl.fromJson;

  @override
  String get id;
  @override
  String get intention;
  @override
  bool get isAnonymous;
  @override
  String? get name;
  @override
  String get duration; // ONE_DAY, THREE_DAYS, SEVEN_DAYS, THIRTY_DAYS
  @override
  DateTime get litAt;
  @override
  DateTime get expiresAt;
  @override
  bool get isActive; // Helper fields for UI (calculated or fallback)
  @override
  int get prayerCount;

  /// Create a copy of Candle
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CandleImplCopyWith<_$CandleImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
