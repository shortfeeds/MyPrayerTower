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

Reading _$ReadingFromJson(Map<String, dynamic> json) {
  return _Reading.fromJson(json);
}

/// @nodoc
mixin _$Reading {
  String get id => throw _privateConstructorUsedError;
  DateTime get date => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  String get reference => throw _privateConstructorUsedError;
  String get text => throw _privateConstructorUsedError; // Markdown text
  String? get imageUrl => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError; // Daily, Sunday, Feast
  String? get liturgicalColor => throw _privateConstructorUsedError;

  /// Serializes this Reading to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Reading
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReadingCopyWith<Reading> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReadingCopyWith<$Res> {
  factory $ReadingCopyWith(Reading value, $Res Function(Reading) then) =
      _$ReadingCopyWithImpl<$Res, Reading>;
  @useResult
  $Res call({
    String id,
    DateTime date,
    String title,
    String reference,
    String text,
    String? imageUrl,
    String type,
    String? liturgicalColor,
  });
}

/// @nodoc
class _$ReadingCopyWithImpl<$Res, $Val extends Reading>
    implements $ReadingCopyWith<$Res> {
  _$ReadingCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Reading
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? title = null,
    Object? reference = null,
    Object? text = null,
    Object? imageUrl = freezed,
    Object? type = null,
    Object? liturgicalColor = freezed,
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
            title: null == title
                ? _value.title
                : title // ignore: cast_nullable_to_non_nullable
                      as String,
            reference: null == reference
                ? _value.reference
                : reference // ignore: cast_nullable_to_non_nullable
                      as String,
            text: null == text
                ? _value.text
                : text // ignore: cast_nullable_to_non_nullable
                      as String,
            imageUrl: freezed == imageUrl
                ? _value.imageUrl
                : imageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as String,
            liturgicalColor: freezed == liturgicalColor
                ? _value.liturgicalColor
                : liturgicalColor // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ReadingImplCopyWith<$Res> implements $ReadingCopyWith<$Res> {
  factory _$$ReadingImplCopyWith(
    _$ReadingImpl value,
    $Res Function(_$ReadingImpl) then,
  ) = __$$ReadingImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    DateTime date,
    String title,
    String reference,
    String text,
    String? imageUrl,
    String type,
    String? liturgicalColor,
  });
}

/// @nodoc
class __$$ReadingImplCopyWithImpl<$Res>
    extends _$ReadingCopyWithImpl<$Res, _$ReadingImpl>
    implements _$$ReadingImplCopyWith<$Res> {
  __$$ReadingImplCopyWithImpl(
    _$ReadingImpl _value,
    $Res Function(_$ReadingImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Reading
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? date = null,
    Object? title = null,
    Object? reference = null,
    Object? text = null,
    Object? imageUrl = freezed,
    Object? type = null,
    Object? liturgicalColor = freezed,
  }) {
    return _then(
      _$ReadingImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        date: null == date
            ? _value.date
            : date // ignore: cast_nullable_to_non_nullable
                  as DateTime,
        title: null == title
            ? _value.title
            : title // ignore: cast_nullable_to_non_nullable
                  as String,
        reference: null == reference
            ? _value.reference
            : reference // ignore: cast_nullable_to_non_nullable
                  as String,
        text: null == text
            ? _value.text
            : text // ignore: cast_nullable_to_non_nullable
                  as String,
        imageUrl: freezed == imageUrl
            ? _value.imageUrl
            : imageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as String,
        liturgicalColor: freezed == liturgicalColor
            ? _value.liturgicalColor
            : liturgicalColor // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ReadingImpl implements _Reading {
  const _$ReadingImpl({
    required this.id,
    required this.date,
    required this.title,
    required this.reference,
    required this.text,
    this.imageUrl,
    this.type = 'Daily',
    this.liturgicalColor,
  });

  factory _$ReadingImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReadingImplFromJson(json);

  @override
  final String id;
  @override
  final DateTime date;
  @override
  final String title;
  @override
  final String reference;
  @override
  final String text;
  // Markdown text
  @override
  final String? imageUrl;
  @override
  @JsonKey()
  final String type;
  // Daily, Sunday, Feast
  @override
  final String? liturgicalColor;

  @override
  String toString() {
    return 'Reading(id: $id, date: $date, title: $title, reference: $reference, text: $text, imageUrl: $imageUrl, type: $type, liturgicalColor: $liturgicalColor)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReadingImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.date, date) || other.date == date) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.reference, reference) ||
                other.reference == reference) &&
            (identical(other.text, text) || other.text == text) &&
            (identical(other.imageUrl, imageUrl) ||
                other.imageUrl == imageUrl) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.liturgicalColor, liturgicalColor) ||
                other.liturgicalColor == liturgicalColor));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    date,
    title,
    reference,
    text,
    imageUrl,
    type,
    liturgicalColor,
  );

  /// Create a copy of Reading
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReadingImplCopyWith<_$ReadingImpl> get copyWith =>
      __$$ReadingImplCopyWithImpl<_$ReadingImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ReadingImplToJson(this);
  }
}

abstract class _Reading implements Reading {
  const factory _Reading({
    required final String id,
    required final DateTime date,
    required final String title,
    required final String reference,
    required final String text,
    final String? imageUrl,
    final String type,
    final String? liturgicalColor,
  }) = _$ReadingImpl;

  factory _Reading.fromJson(Map<String, dynamic> json) = _$ReadingImpl.fromJson;

  @override
  String get id;
  @override
  DateTime get date;
  @override
  String get title;
  @override
  String get reference;
  @override
  String get text; // Markdown text
  @override
  String? get imageUrl;
  @override
  String get type; // Daily, Sunday, Feast
  @override
  String? get liturgicalColor;

  /// Create a copy of Reading
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReadingImplCopyWith<_$ReadingImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
