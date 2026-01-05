// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'saint_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Saint _$SaintFromJson(Map<String, dynamic> json) {
  return _Saint.fromJson(json);
}

/// @nodoc
mixin _$Saint {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get title => throw _privateConstructorUsedError;
  String? get feastDay => throw _privateConstructorUsedError;
  int? get feastMonth => throw _privateConstructorUsedError;
  int? get feastDayOfMonth => throw _privateConstructorUsedError;
  @JsonKey(name: 'biography')
  String? get bio => throw _privateConstructorUsedError;
  @JsonKey(name: 'shortBio')
  String? get shortDescription => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  @JsonKey(name: 'patronOf')
  List<String>? get patronage => throw _privateConstructorUsedError;
  String? get prayer => throw _privateConstructorUsedError;

  /// Serializes this Saint to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Saint
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SaintCopyWith<Saint> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SaintCopyWith<$Res> {
  factory $SaintCopyWith(Saint value, $Res Function(Saint) then) =
      _$SaintCopyWithImpl<$Res, Saint>;
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? title,
    String? feastDay,
    int? feastMonth,
    int? feastDayOfMonth,
    @JsonKey(name: 'biography') String? bio,
    @JsonKey(name: 'shortBio') String? shortDescription,
    String? imageUrl,
    @JsonKey(name: 'patronOf') List<String>? patronage,
    String? prayer,
  });
}

/// @nodoc
class _$SaintCopyWithImpl<$Res, $Val extends Saint>
    implements $SaintCopyWith<$Res> {
  _$SaintCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Saint
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? title = freezed,
    Object? feastDay = freezed,
    Object? feastMonth = freezed,
    Object? feastDayOfMonth = freezed,
    Object? bio = freezed,
    Object? shortDescription = freezed,
    Object? imageUrl = freezed,
    Object? patronage = freezed,
    Object? prayer = freezed,
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
            title: freezed == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String?,
            feastDay: freezed == feastDay
                ? _value.feastDay
                : feastDay // ignore: cast_nullable_to_non_nullable
                      as String?,
            feastMonth: freezed == feastMonth
                ? _value.feastMonth
                : feastMonth // ignore: cast_nullable_to_non_nullable
                      as int?,
            feastDayOfMonth: freezed == feastDayOfMonth
                ? _value.feastDayOfMonth
                : feastDayOfMonth // ignore: cast_nullable_to_non_nullable
                      as int?,
            bio: freezed == bio
                ? _value.bio
                : bio // ignore: cast_nullable_to_non_nullable
                      as String?,
            shortDescription: freezed == shortDescription
                ? _value.shortDescription
                : shortDescription // ignore: cast_nullable_to_non_nullable
                      as String?,
            imageUrl: freezed == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            patronage: freezed == patronage
                ? _value.patronage
                : patronage // ignore: cast_nullable_to_non_nullable
                      as List<String>?,
            prayer: freezed == prayer
                ? _value.prayer
                : prayer // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$SaintImplCopyWith<$Res> implements $SaintCopyWith<$Res> {
  factory _$$SaintImplCopyWith(
    _$SaintImpl value,
    $Res Function(_$SaintImpl) then,
  ) = __$$SaintImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? title,
    String? feastDay,
    int? feastMonth,
    int? feastDayOfMonth,
    @JsonKey(name: 'biography') String? bio,
    @JsonKey(name: 'shortBio') String? shortDescription,
    String? imageUrl,
    @JsonKey(name: 'patronOf') List<String>? patronage,
    String? prayer,
  });
}

/// @nodoc
class __$$SaintImplCopyWithImpl<$Res>
    extends _$SaintCopyWithImpl<$Res, _$SaintImpl>
    implements _$$SaintImplCopyWith<$Res> {
  __$$SaintImplCopyWithImpl(
    _$SaintImpl _value,
    $Res Function(_$SaintImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Saint
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? title = freezed,
    Object? feastDay = freezed,
    Object? feastMonth = freezed,
    Object? feastDayOfMonth = freezed,
    Object? bio = freezed,
    Object? shortDescription = freezed,
    Object? imageUrl = freezed,
    Object? patronage = freezed,
    Object? prayer = freezed,
  }) {
    return _then(
      _$SaintImpl(
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
        title: freezed == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String?,
        feastDay: freezed == feastDay
            ? _value.feastDay
            : feastDay // ignore: cast_nullable_to_non_nullable
                  as String?,
        feastMonth: freezed == feastMonth
            ? _value.feastMonth
            : feastMonth // ignore: cast_nullable_to_non_nullable
                  as int?,
        feastDayOfMonth: freezed == feastDayOfMonth
            ? _value.feastDayOfMonth
            : feastDayOfMonth // ignore: cast_nullable_to_non_nullable
                  as int?,
        bio: freezed == bio
            ? _value.bio
            : bio // ignore: cast_nullable_to_non_nullable
                  as String?,
        shortDescription: freezed == shortDescription
            ? _value.shortDescription
            : shortDescription // ignore: cast_nullable_to_non_nullable
                  as String?,
        imageUrl: freezed == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        patronage: freezed == patronage
            ? _value._patronage
            : patronage // ignore: cast_nullable_to_non_nullable
                  as List<String>?,
        prayer: freezed == prayer
            ? _value.prayer
            : prayer // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$SaintImpl implements _Saint {
  const _$SaintImpl({
    required this.id,
    required this.name,
    required this.slug,
    this.title,
    this.feastDay,
    this.feastMonth,
    this.feastDayOfMonth,
    @JsonKey(name: 'biography') this.bio,
    @JsonKey(name: 'shortBio') this.shortDescription,
    this.imageUrl,
    @JsonKey(name: 'patronOf') final List<String>? patronage,
    this.prayer,
  }) : _patronage = patronage;

  factory _$SaintImpl.fromJson(Map<String, dynamic> json) =>
      _$$SaintImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? title;
  @override
  final String? feastDay;
  @override
  final int? feastMonth;
  @override
  final int? feastDayOfMonth;
  @override
  @JsonKey(name: 'biography')
  final String? bio;
  @override
  @JsonKey(name: 'shortBio')
  final String? shortDescription;
  @override
  final String? imageUrl;
  final List<String>? _patronage;
  @override
  @JsonKey(name: 'patronOf')
  List<String>? get patronage {
    final value = _patronage;
    if (value == null) return null;
    if (_patronage is EqualUnmodifiableListView) return _patronage;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String? prayer;

  @override
  String toString() {
    return 'Saint(id: $id, name: $name, slug: $slug, title: $title, feastDay: $feastDay, feastMonth: $feastMonth, feastDayOfMonth: $feastDayOfMonth, bio: $bio, shortDescription: $shortDescription, imageUrl: $imageUrl, patronage: $patronage, prayer: $prayer)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SaintImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.feastDay, feastDay) ||
                other.feastDay == feastDay) &&
            (identical(other.feastMonth, feastMonth) ||
                other.feastMonth == feastMonth) &&
            (identical(other.feastDayOfMonth, feastDayOfMonth) ||
                other.feastDayOfMonth == feastDayOfMonth) &&
            (identical(other.bio, bio) || other.bio == bio) &&
            (identical(other.shortDescription, shortDescription) ||
                other.shortDescription == shortDescription) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            const DeepCollectionEquality().equals(
              other._patronage,
              _patronage,
            ) &&
            (identical(other.prayer, prayer) || other.prayer == prayer));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    slug,
    title,
    feastDay,
    feastMonth,
    feastDayOfMonth,
    bio,
    shortDescription,
    imageUrl,
    const DeepCollectionEquality().hash(_patronage),
    prayer,
  );

  /// Create a copy of Saint
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SaintImplCopyWith<_$SaintImpl> get copyWith =>
      __$$SaintImplCopyWithImpl<_$SaintImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SaintImplToJson(this);
  }
}

abstract class _Saint implements Saint {
  const factory _Saint({
    required final String id,
    required final String name,
    required final String slug,
    final String? title,
    final String? feastDay,
    final int? feastMonth,
    final int? feastDayOfMonth,
    @JsonKey(name: 'biography') final String? bio,
    @JsonKey(name: 'shortBio') final String? shortDescription,
    final String? imageUrl,
    @JsonKey(name: 'patronOf') final List<String>? patronage,
    final String? prayer,
  }) = _$SaintImpl;

  factory _Saint.fromJson(Map<String, dynamic> json) = _$SaintImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get title;
  @override
  String? get feastDay;
  @override
  int? get feastMonth;
  @override
  int? get feastDayOfMonth;
  @override
  @JsonKey(name: 'biography')
  String? get bio;
  @override
  @JsonKey(name: 'shortBio')
  String? get shortDescription;
  @override
  String? get imageUrl;
  @override
  @JsonKey(name: 'patronOf')
  List<String>? get patronage;
  @override
  String? get prayer;

  /// Create a copy of Saint
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SaintImplCopyWith<_$SaintImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
