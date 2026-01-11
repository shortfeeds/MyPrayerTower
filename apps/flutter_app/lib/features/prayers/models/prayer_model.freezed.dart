// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'prayer_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Prayer _$PrayerFromJson(Map<String, dynamic> json) {
  return _Prayer.fromJson(json);
}

/// @nodoc
mixin _$Prayer {
  int get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String? get slug => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String get category => throw _privateConstructorUsedError;
  @JsonKey(name: 'category_label')
  String get categoryLabel => throw _privateConstructorUsedError;
  List<String> get tags => throw _privateConstructorUsedError;
  @JsonKey(name: 'is_active')
  bool? get isActive => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  DateTime? get createdAt => throw _privateConstructorUsedError;

  /// Serializes this Prayer to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Prayer
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PrayerCopyWith<Prayer> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PrayerCopyWith<$Res> {
  factory $PrayerCopyWith(Prayer value, $Res Function(Prayer) then) =
      _$PrayerCopyWithImpl<$Res, Prayer>;
  @useResult
  $Res call({
    int id,
    String title,
    String? slug,
    String content,
    String category,
    @JsonKey(name: 'category_label') String categoryLabel,
    List<String> tags,
    @JsonKey(name: 'is_active') bool? isActive,
    @JsonKey(name: 'created_at') DateTime? createdAt,
  });
}

/// @nodoc
class _$PrayerCopyWithImpl<$Res, $Val extends Prayer>
    implements $PrayerCopyWith<$Res> {
  _$PrayerCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Prayer
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? slug = freezed,
    Object? content = null,
    Object? category = null,
    Object? categoryLabel = null,
    Object? tags = null,
    Object? isActive = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as int,
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            slug: freezed == slug
                ? _value.slug
                : slug // ignore: cast_nullable_to_non_nullable
                      as String?,
            content: null == content
                ? _value.content
                : content // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String,
            categoryLabel: null == categoryLabel
                ? _value.categoryLabel
                : categoryLabel // ignore: cast_nullable_to_non_nullable
                      as String,
            tags: null == tags
                ? _value.tags
                : tags // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            isActive: freezed == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool?,
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
abstract class _$$PrayerImplCopyWith<$Res> implements $PrayerCopyWith<$Res> {
  factory _$$PrayerImplCopyWith(
    _$PrayerImpl value,
    $Res Function(_$PrayerImpl) then,
  ) = __$$PrayerImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int id,
    String title,
    String? slug,
    String content,
    String category,
    @JsonKey(name: 'category_label') String categoryLabel,
    List<String> tags,
    @JsonKey(name: 'is_active') bool? isActive,
    @JsonKey(name: 'created_at') DateTime? createdAt,
  });
}

/// @nodoc
class __$$PrayerImplCopyWithImpl<$Res>
    extends _$PrayerCopyWithImpl<$Res, _$PrayerImpl>
    implements _$$PrayerImplCopyWith<$Res> {
  __$$PrayerImplCopyWithImpl(
    _$PrayerImpl _value,
    $Res Function(_$PrayerImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Prayer
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? title = null,
    Object? slug = freezed,
    Object? content = null,
    Object? category = null,
    Object? categoryLabel = null,
    Object? tags = null,
    Object? isActive = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(
      _$PrayerImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as int,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        slug: freezed == slug
            ? _value.slug
            : slug // ignore: cast_nullable_to_non_nullable
                  as String?,
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String,
        categoryLabel: null == categoryLabel
            ? _value.categoryLabel
            : categoryLabel // ignore: cast_nullable_to_non_nullable
                  as String,
        tags: null == tags
            ? _value._tags
            : tags // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        isActive: freezed == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool?,
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
class _$PrayerImpl implements _Prayer {
  const _$PrayerImpl({
    required this.id,
    required this.title,
    this.slug,
    required this.content,
    required this.category,
    @JsonKey(name: 'category_label') required this.categoryLabel,
    final List<String> tags = const [],
    @JsonKey(name: 'is_active') this.isActive = true,
    @JsonKey(name: 'created_at') this.createdAt,
  }) : _tags = tags;

  factory _$PrayerImpl.fromJson(Map<String, dynamic> json) =>
      _$$PrayerImplFromJson(json);

  @override
  final int id;
  @override
  final String title;
  @override
  final String? slug;
  @override
  final String content;
  @override
  final String category;
  @override
  @JsonKey(name: 'category_label')
  final String categoryLabel;
  final List<String> _tags;
  @override
  @JsonKey()
  List<String> get tags {
    if (_tags is EqualUnmodifiableListView) return _tags;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_tags);
  }

  @override
  @JsonKey(name: 'is_active')
  final bool? isActive;
  @override
  @JsonKey(name: 'created_at')
  final DateTime? createdAt;

  @override
  String toString() {
    return 'Prayer(id: $id, title: $title, slug: $slug, content: $content, category: $category, categoryLabel: $categoryLabel, tags: $tags, isActive: $isActive, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PrayerImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.categoryLabel, categoryLabel) ||
                other.categoryLabel == categoryLabel) &&
            const DeepCollectionEquality().equals(other._tags, _tags) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    title,
    slug,
    content,
    category,
    categoryLabel,
    const DeepCollectionEquality().hash(_tags),
    isActive,
    createdAt,
  );

  /// Create a copy of Prayer
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PrayerImplCopyWith<_$PrayerImpl> get copyWith =>
      __$$PrayerImplCopyWithImpl<_$PrayerImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PrayerImplToJson(this);
  }
}

abstract class _Prayer implements Prayer {
  const factory _Prayer({
    required final int id,
    required final String title,
    final String? slug,
    required final String content,
    required final String category,
    @JsonKey(name: 'category_label') required final String categoryLabel,
    final List<String> tags,
    @JsonKey(name: 'is_active') final bool? isActive,
    @JsonKey(name: 'created_at') final DateTime? createdAt,
  }) = _$PrayerImpl;

  factory _Prayer.fromJson(Map<String, dynamic> json) = _$PrayerImpl.fromJson;

  @override
  int get id;
  @override
  String get title;
  @override
  String? get slug;
  @override
  String get content;
  @override
  String get category;
  @override
  @JsonKey(name: 'category_label')
  String get categoryLabel;
  @override
  List<String> get tags;
  @override
  @JsonKey(name: 'is_active')
  bool? get isActive;
  @override
  @JsonKey(name: 'created_at')
  DateTime? get createdAt;

  /// Create a copy of Prayer
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PrayerImplCopyWith<_$PrayerImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
