// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'ad_config.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

AdConfig _$AdConfigFromJson(Map<String, dynamic> json) {
  return _AdConfig.fromJson(json);
}

/// @nodoc
mixin _$AdConfig {
  String get id => throw _privateConstructorUsedError;
  AdSource get adSource => throw _privateConstructorUsedError;
  String? get imageUrl => throw _privateConstructorUsedError;
  String? get linkUrl => throw _privateConstructorUsedError;
  String? get googleAdUnitId => throw _privateConstructorUsedError;
  String? get androidAdUnitId => throw _privateConstructorUsedError;
  String? get iosAdUnitId => throw _privateConstructorUsedError;
  String? get position => throw _privateConstructorUsedError;
  int get priority => throw _privateConstructorUsedError;

  /// Serializes this AdConfig to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AdConfig
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AdConfigCopyWith<AdConfig> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AdConfigCopyWith<$Res> {
  factory $AdConfigCopyWith(AdConfig value, $Res Function(AdConfig) then) =
      _$AdConfigCopyWithImpl<$Res, AdConfig>;
  @useResult
  $Res call({
    String id,
    AdSource adSource,
    String? imageUrl,
    String? linkUrl,
    String? googleAdUnitId,
    String? androidAdUnitId,
    String? iosAdUnitId,
    String? position,
    int priority,
  });
}

/// @nodoc
class _$AdConfigCopyWithImpl<$Res, $Val extends AdConfig>
    implements $AdConfigCopyWith<$Res> {
  _$AdConfigCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AdConfig
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? adSource = null,
    Object? imageUrl = freezed,
    Object? linkUrl = freezed,
    Object? googleAdUnitId = freezed,
    Object? androidAdUnitId = freezed,
    Object? iosAdUnitId = freezed,
    Object? position = freezed,
    Object? priority = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            adSource: null == adSource
                ? _value.adSource
                : adSource // ignore: cast_nullable_to_non_nullable
                      as AdSource,
            imageUrl: freezed == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            linkUrl: freezed == linkUrl
                ? _value.linkUrl
                : linkUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            googleAdUnitId: freezed == googleAdUnitId
                ? _value.googleAdUnitId
                : googleAdUnitId // ignore: cast_nullable_to_non_nullable
                      as String?,
            androidAdUnitId: freezed == androidAdUnitId
                ? _value.androidAdUnitId
                : androidAdUnitId // ignore: cast_nullable_to_non_nullable
                      as String?,
            iosAdUnitId: freezed == iosAdUnitId
                ? _value.iosAdUnitId
                : iosAdUnitId // ignore: cast_nullable_to_non_nullable
                      as String?,
            position: freezed == position
                ? _value.position
                : position // ignore: cast_nullable_to_non_nullable
                      as String?,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AdConfigImplCopyWith<$Res>
    implements $AdConfigCopyWith<$Res> {
  factory _$$AdConfigImplCopyWith(
    _$AdConfigImpl value,
    $Res Function(_$AdConfigImpl) then,
  ) = __$$AdConfigImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    AdSource adSource,
    String? imageUrl,
    String? linkUrl,
    String? googleAdUnitId,
    String? androidAdUnitId,
    String? iosAdUnitId,
    String? position,
    int priority,
  });
}

/// @nodoc
class __$$AdConfigImplCopyWithImpl<$Res>
    extends _$AdConfigCopyWithImpl<$Res, _$AdConfigImpl>
    implements _$$AdConfigImplCopyWith<$Res> {
  __$$AdConfigImplCopyWithImpl(
    _$AdConfigImpl _value,
    $Res Function(_$AdConfigImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AdConfig
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? adSource = null,
    Object? imageUrl = freezed,
    Object? linkUrl = freezed,
    Object? googleAdUnitId = freezed,
    Object? androidAdUnitId = freezed,
    Object? iosAdUnitId = freezed,
    Object? position = freezed,
    Object? priority = null,
  }) {
    return _then(
      _$AdConfigImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        adSource: null == adSource
            ? _value.adSource
            : adSource // ignore: cast_nullable_to_non_nullable
                  as AdSource,
        imageUrl: freezed == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        linkUrl: freezed == linkUrl
            ? _value.linkUrl
            : linkUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        googleAdUnitId: freezed == googleAdUnitId
            ? _value.googleAdUnitId
            : googleAdUnitId // ignore: cast_nullable_to_non_nullable
                  as String?,
        androidAdUnitId: freezed == androidAdUnitId
            ? _value.androidAdUnitId
            : androidAdUnitId // ignore: cast_nullable_to_non_nullable
                  as String?,
        iosAdUnitId: freezed == iosAdUnitId
            ? _value.iosAdUnitId
            : iosAdUnitId // ignore: cast_nullable_to_non_nullable
                  as String?,
        position: freezed == position
            ? _value.position
            : position // ignore: cast_nullable_to_non_nullable
                  as String?,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AdConfigImpl implements _AdConfig {
  const _$AdConfigImpl({
    required this.id,
    this.adSource = AdSource.offline,
    this.imageUrl,
    this.linkUrl,
    this.googleAdUnitId,
    this.androidAdUnitId,
    this.iosAdUnitId,
    this.position,
    this.priority = 0,
  });

  factory _$AdConfigImpl.fromJson(Map<String, dynamic> json) =>
      _$$AdConfigImplFromJson(json);

  @override
  final String id;
  @override
  @JsonKey()
  final AdSource adSource;
  @override
  final String? imageUrl;
  @override
  final String? linkUrl;
  @override
  final String? googleAdUnitId;
  @override
  final String? androidAdUnitId;
  @override
  final String? iosAdUnitId;
  @override
  final String? position;
  @override
  @JsonKey()
  final int priority;

  @override
  String toString() {
    return 'AdConfig(id: $id, adSource: $adSource, imageUrl: $imageUrl, linkUrl: $linkUrl, googleAdUnitId: $googleAdUnitId, androidAdUnitId: $androidAdUnitId, iosAdUnitId: $iosAdUnitId, position: $position, priority: $priority)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AdConfigImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.adSource, adSource) ||
                other.adSource == adSource) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.linkUrl, linkUrl) || other.linkUrl == linkUrl) &&
            (identical(other.googleAdUnitId, googleAdUnitId) ||
                other.googleAdUnitId == googleAdUnitId) &&
            (identical(other.androidAdUnitId, androidAdUnitId) ||
                other.androidAdUnitId == androidAdUnitId) &&
            (identical(other.iosAdUnitId, iosAdUnitId) ||
                other.iosAdUnitId == iosAdUnitId) &&
            (identical(other.position, position) ||
                other.position == position) &&
            (identical(other.priority, priority) ||
                other.priority == priority));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    adSource,
    imageUrl,
    linkUrl,
    googleAdUnitId,
    androidAdUnitId,
    iosAdUnitId,
    position,
    priority,
  );

  /// Create a copy of AdConfig
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AdConfigImplCopyWith<_$AdConfigImpl> get copyWith =>
      __$$AdConfigImplCopyWithImpl<_$AdConfigImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AdConfigImplToJson(this);
  }
}

abstract class _AdConfig implements AdConfig {
  const factory _AdConfig({
    required final String id,
    final AdSource adSource,
    final String? imageUrl,
    final String? linkUrl,
    final String? googleAdUnitId,
    final String? androidAdUnitId,
    final String? iosAdUnitId,
    final String? position,
    final int priority,
  }) = _$AdConfigImpl;

  factory _AdConfig.fromJson(Map<String, dynamic> json) =
      _$AdConfigImpl.fromJson;

  @override
  String get id;
  @override
  AdSource get adSource;
  @override
  String? get imageUrl;
  @override
  String? get linkUrl;
  @override
  String? get googleAdUnitId;
  @override
  String? get androidAdUnitId;
  @override
  String? get iosAdUnitId;
  @override
  String? get position;
  @override
  int get priority;

  /// Create a copy of AdConfig
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AdConfigImplCopyWith<_$AdConfigImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
