// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'reading_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DailyReading _$DailyReadingFromJson(Map<String, dynamic> json) {
  return _DailyReading.fromJson(json);
}

/// @nodoc
mixin _$DailyReading {
  String get id => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  String? get liturgicalSeason => throw _privateConstructorUsedError;
  String? get liturgicalColor => throw _privateConstructorUsedError;
  String? get feastName => throw _privateConstructorUsedError;
  String? get firstReading => throw _privateConstructorUsedError;
  String? get firstReadingRef => throw _privateConstructorUsedError;
  String? get psalm => throw _privateConstructorUsedError;
  String? get psalmRef => throw _privateConstructorUsedError;
  String? get secondReading => throw _privateConstructorUsedError;
  String? get secondReadingRef => throw _privateConstructorUsedError;
  String? get gospel => throw _privateConstructorUsedError;
  String? get gospelRef => throw _privateConstructorUsedError;
  String? get reflection => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;

  /// Serializes this DailyReading to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DailyReading
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DailyReadingCopyWith<DailyReading> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DailyReadingCopyWith<$Res> {
  factory $DailyReadingCopyWith(
    DailyReading value,
    $Res Function(DailyReading) then,
  ) = _$DailyReadingCopyWithImpl<$Res, DailyReading>;
  @useResult
  $Res call({
    String id,
    DateTime date,
    String? liturgicalSeason,
    String? liturgicalColor,
    String? feastName,
    String? firstReading,
    String? firstReadingRef,
    String? psalm,
    String? psalmRef,
    String? secondReading,
    String? secondReadingRef,
    String? gospel,
    String? gospelRef,
    String? reflection,
    DateTime? createdAt,
  });
}

/// @nodoc
class _$DailyReadingCopyWithImpl<$Res, $Val extends DailyReading>
    implements $DailyReadingCopyWith<$Res> {
  _$DailyReadingCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DailyReading
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? liturgicalSeason = freezed,
    Object? liturgicalColor = freezed,
    Object? feastName = freezed,
    Object? firstReading = freezed,
    Object? firstReadingRef = freezed,
    Object? psalm = freezed,
    Object? psalmRef = freezed,
    Object? secondReading = freezed,
    Object? secondReadingRef = freezed,
    Object? gospel = freezed,
    Object? gospelRef = freezed,
    Object? reflection = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            date: null == date
                ? _value.date
                : date // ignore: cast_nullable_to_non_nullable
                      as DateTime,
            liturgicalSeason: freezed == liturgicalSeason
                ? _value.liturgicalSeason
                : liturgicalSeason // ignore: cast_nullable_to_non_nullable
                      as String?,
            liturgicalColor: freezed == liturgicalColor
                ? _value.liturgicalColor
                : liturgicalColor // ignore: cast_nullable_to_non_nullable
                      as String?,
            feastName: freezed == feastName
                ? _value.feastName
                : feastName // ignore: cast_nullable_to_non_nullable
                      as String?,
            firstReading: freezed == firstReading
                ? _value.firstReading
                : firstReading // ignore: cast_nullable_to_non_nullable
                      as String?,
            firstReadingRef: freezed == firstReadingRef
                ? _value.firstReadingRef
                : firstReadingRef // ignore: cast_nullable_to_non_nullable
                      as String?,
            psalm: freezed == psalm
                ? _value.psalm
                : psalm // ignore: cast_nullable_to_non_nullable
                      as String?,
            psalmRef: freezed == psalmRef
                ? _value.psalmRef
                : psalmRef // ignore: cast_nullable_to_non_nullable
                      as String?,
            secondReading: freezed == secondReading
                ? _value.secondReading
                : secondReading // ignore: cast_nullable_to_non_nullable
                      as String?,
            secondReadingRef: freezed == secondReadingRef
                ? _value.secondReadingRef
                : secondReadingRef // ignore: cast_nullable_to_non_nullable
                      as String?,
            gospel: freezed == gospel
                ? _value.gospel
                : gospel // ignore: cast_nullable_to_non_nullable
                      as String?,
            gospelRef: freezed == gospelRef
                ? _value.gospelRef
                : gospelRef // ignore: cast_nullable_to_non_nullable
                      as String?,
            reflection: freezed == reflection
                ? _value.reflection
                : reflection // ignore: cast_nullable_to_non_nullable
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
abstract class _$$DailyReadingImplCopyWith<$Res>
    implements $DailyReadingCopyWith<$Res> {
  factory _$$DailyReadingImplCopyWith(
    _$DailyReadingImpl value,
    $Res Function(_$DailyReadingImpl) then,
  ) = __$$DailyReadingImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    DateTime date,
    String? liturgicalSeason,
    String? liturgicalColor,
    String? feastName,
    String? firstReading,
    String? firstReadingRef,
    String? psalm,
    String? psalmRef,
    String? secondReading,
    String? secondReadingRef,
    String? gospel,
    String? gospelRef,
    String? reflection,
    DateTime? createdAt,
  });
}

/// @nodoc
class __$$DailyReadingImplCopyWithImpl<$Res>
    extends _$DailyReadingCopyWithImpl<$Res, _$DailyReadingImpl>
    implements _$$DailyReadingImplCopyWith<$Res> {
  __$$DailyReadingImplCopyWithImpl(
    _$DailyReadingImpl _value,
    $Res Function(_$DailyReadingImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DailyReading
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? liturgicalSeason = freezed,
    Object? liturgicalColor = freezed,
    Object? feastName = freezed,
    Object? firstReading = freezed,
    Object? firstReadingRef = freezed,
    Object? psalm = freezed,
    Object? psalmRef = freezed,
    Object? secondReading = freezed,
    Object? secondReadingRef = freezed,
    Object? gospel = freezed,
    Object? gospelRef = freezed,
    Object? reflection = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(
      _$DailyReadingImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        liturgicalSeason: freezed == liturgicalSeason
            ? _value.liturgicalSeason
            : liturgicalSeason // ignore: cast_nullable_to_non_nullable
                  as String?,
        liturgicalColor: freezed == liturgicalColor
            ? _value.liturgicalColor
            : liturgicalColor // ignore: cast_nullable_to_non_nullable
                  as String?,
        feastName: freezed == feastName
            ? _value.feastName
            : feastName // ignore: cast_nullable_to_non_nullable
                  as String?,
        firstReading: freezed == firstReading
            ? _value.firstReading
            : firstReading // ignore: cast_nullable_to_non_nullable
                  as String?,
        firstReadingRef: freezed == firstReadingRef
            ? _value.firstReadingRef
            : firstReadingRef // ignore: cast_nullable_to_non_nullable
                  as String?,
        psalm: freezed == psalm
            ? _value.psalm
            : psalm // ignore: cast_nullable_to_non_nullable
                  as String?,
        psalmRef: freezed == psalmRef
            ? _value.psalmRef
            : psalmRef // ignore: cast_nullable_to_non_nullable
                  as String?,
        secondReading: freezed == secondReading
            ? _value.secondReading
            : secondReading // ignore: cast_nullable_to_non_nullable
                  as String?,
        secondReadingRef: freezed == secondReadingRef
            ? _value.secondReadingRef
            : secondReadingRef // ignore: cast_nullable_to_non_nullable
                  as String?,
        gospel: freezed == gospel
            ? _value.gospel
            : gospel // ignore: cast_nullable_to_non_nullable
                  as String?,
        gospelRef: freezed == gospelRef
            ? _value.gospelRef
            : gospelRef // ignore: cast_nullable_to_non_nullable
                  as String?,
        reflection: freezed == reflection
            ? _value.reflection
            : reflection // ignore: cast_nullable_to_non_nullable
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
class _$DailyReadingImpl implements _DailyReading {
  const _$DailyReadingImpl({
    required this.id,
    required this.date,
    this.liturgicalSeason,
    this.liturgicalColor,
    this.feastName,
    this.firstReading,
    this.firstReadingRef,
    this.psalm,
    this.psalmRef,
    this.secondReading,
    this.secondReadingRef,
    this.gospel,
    this.gospelRef,
    this.reflection,
    this.createdAt,
  });

  factory _$DailyReadingImpl.fromJson(Map<String, dynamic> json) =>
      _$$DailyReadingImplFromJson(json);

  @override
  final String id;
  @override
  final DateTime date;
  @override
  final String? liturgicalSeason;
  @override
  final String? liturgicalColor;
  @override
  final String? feastName;
  @override
  final String? firstReading;
  @override
  final String? firstReadingRef;
  @override
  final String? psalm;
  @override
  final String? psalmRef;
  @override
  final String? secondReading;
  @override
  final String? secondReadingRef;
  @override
  final String? gospel;
  @override
  final String? gospelRef;
  @override
  final String? reflection;
  @override
  final DateTime? createdAt;

  @override
  String toString() {
    return 'DailyReading(id: $id, date: $date, liturgicalSeason: $liturgicalSeason, liturgicalColor: $liturgicalColor, feastName: $feastName, firstReading: $firstReading, firstReadingRef: $firstReadingRef, psalm: $psalm, psalmRef: $psalmRef, secondReading: $secondReading, secondReadingRef: $secondReadingRef, gospel: $gospel, gospelRef: $gospelRef, reflection: $reflection, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DailyReadingImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.liturgicalSeason, liturgicalSeason) ||
                other.liturgicalSeason == liturgicalSeason) &&
            (identical(other.liturgicalColor, liturgicalColor) ||
                other.liturgicalColor == liturgicalColor) &&
            (identical(other.feastName, feastName) ||
                other.feastName == feastName) &&
            (identical(other.firstReading, firstReading) ||
                other.firstReading == firstReading) &&
            (identical(other.firstReadingRef, firstReadingRef) ||
                other.firstReadingRef == firstReadingRef) &&
            (identical(other.psalm, psalm) || other.psalm == psalm) &&
            (identical(other.psalmRef, psalmRef) ||
                other.psalmRef == psalmRef) &&
            (identical(other.secondReading, secondReading) ||
                other.secondReading == secondReading) &&
            (identical(other.secondReadingRef, secondReadingRef) ||
                other.secondReadingRef == secondReadingRef) &&
            (identical(other.gospel, gospel) || other.gospel == gospel) &&
            (identical(other.gospelRef, gospelRef) ||
                other.gospelRef == gospelRef) &&
            (identical(other.reflection, reflection) ||
                other.reflection == reflection) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    date,
    liturgicalSeason,
    liturgicalColor,
    feastName,
    firstReading,
    firstReadingRef,
    psalm,
    psalmRef,
    secondReading,
    secondReadingRef,
    gospel,
    gospelRef,
    reflection,
    createdAt,
  );

  /// Create a copy of DailyReading
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DailyReadingImplCopyWith<_$DailyReadingImpl> get copyWith =>
      __$$DailyReadingImplCopyWithImpl<_$DailyReadingImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DailyReadingImplToJson(this);
  }
}

abstract class _DailyReading implements DailyReading {
  const factory _DailyReading({
    required final String id,
    required final DateTime date,
    final String? liturgicalSeason,
    final String? liturgicalColor,
    final String? feastName,
    final String? firstReading,
    final String? firstReadingRef,
    final String? psalm,
    final String? psalmRef,
    final String? secondReading,
    final String? secondReadingRef,
    final String? gospel,
    final String? gospelRef,
    final String? reflection,
    final DateTime? createdAt,
  }) = _$DailyReadingImpl;

  factory _DailyReading.fromJson(Map<String, dynamic> json) =
      _$DailyReadingImpl.fromJson;

  @override
  String get id;
  @override
  DateTime get date;
  @override
  String? get liturgicalSeason;
  @override
  String? get liturgicalColor;
  @override
  String? get feastName;
  @override
  String? get firstReading;
  @override
  String? get firstReadingRef;
  @override
  String? get psalm;
  @override
  String? get psalmRef;
  @override
  String? get secondReading;
  @override
  String? get secondReadingRef;
  @override
  String? get gospel;
  @override
  String? get gospelRef;
  @override
  String? get reflection;
  @override
  DateTime? get createdAt;

  /// Create a copy of DailyReading
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DailyReadingImplCopyWith<_$DailyReadingImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
