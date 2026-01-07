// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'church_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

Church _$ChurchFromJson(Map<String, dynamic> json) {
  return _Church.fromJson(json);
}

/// @nodoc
mixin _$Church {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get slug => throw _privateConstructorUsedError;
  String? get address => throw _privateConstructorUsedError;
  String get city => throw _privateConstructorUsedError;
  String? get state => throw _privateConstructorUsedError;
  String? get country => throw _privateConstructorUsedError;
  String? get primaryImageUrl => throw _privateConstructorUsedError;
  String? get website => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError;
  bool get isVerified => throw _privateConstructorUsedError;
  double? get latitude => throw _privateConstructorUsedError;
  double? get longitude => throw _privateConstructorUsedError;
  Map<String, dynamic>? get massSchedule => throw _privateConstructorUsedError;
  Map<String, dynamic>? get confessionSchedule =>
      throw _privateConstructorUsedError;

  /// Serializes this Church to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ChurchCopyWith<Church> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ChurchCopyWith<$Res> {
  factory $ChurchCopyWith(Church value, $Res Function(Church) then) =
      _$ChurchCopyWithImpl<$Res, Church>;
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? address,
    String city,
    String? state,
    String? country,
    String? primaryImageUrl,
    String? website,
    String? phone,
    String type,
    bool isVerified,
    double? latitude,
    double? longitude,
    Map<String, dynamic>? massSchedule,
    Map<String, dynamic>? confessionSchedule,
  });
}

/// @nodoc
class _$ChurchCopyWithImpl<$Res, $Val extends Church>
    implements $ChurchCopyWith<$Res> {
  _$ChurchCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? address = freezed,
    Object? city = null,
    Object? state = freezed,
    Object? country = freezed,
    Object? primaryImageUrl = freezed,
    Object? website = freezed,
    Object? phone = freezed,
    Object? type = null,
    Object? isVerified = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? massSchedule = freezed,
    Object? confessionSchedule = freezed,
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
            address: freezed == address
                ? _value.address
                : address // ignore: cast_nullable_to_non_nullable
                      as String?,
            city: null == city
                ? _value.city
                : city // ignore: cast_nullable_to_non_nullable
                      as String,
            state: freezed == state
                ? _value.state
                : state // ignore: cast_nullable_to_non_nullable
                      as String?,
            country: freezed == country
                ? _value.country
                : country // ignore: cast_nullable_to_non_nullable
                      as String?,
            primaryImageUrl: freezed == primaryImageUrl
                ? _value.primaryImageUrl
                : primaryImageUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            website: freezed == website
                ? _value.website
                : website // ignore: cast_nullable_to_non_nullable
                      as String?,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            type: null == type
                ? _value.type
                : type // ignore: cast_nullable_to_non_nullable
                      as String,
            isVerified: null == isVerified
                ? _value.isVerified
                : isVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
            latitude: freezed == latitude
                ? _value.latitude
                : latitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            longitude: freezed == longitude
                ? _value.longitude
                : longitude // ignore: cast_nullable_to_non_nullable
                      as double?,
            massSchedule: freezed == massSchedule
                ? _value.massSchedule
                : massSchedule // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            confessionSchedule: freezed == confessionSchedule
                ? _value.confessionSchedule
                : confessionSchedule // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ChurchImplCopyWith<$Res> implements $ChurchCopyWith<$Res> {
  factory _$$ChurchImplCopyWith(
    _$ChurchImpl value,
    $Res Function(_$ChurchImpl) then,
  ) = __$$ChurchImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String slug,
    String? address,
    String city,
    String? state,
    String? country,
    String? primaryImageUrl,
    String? website,
    String? phone,
    String type,
    bool isVerified,
    double? latitude,
    double? longitude,
    Map<String, dynamic>? massSchedule,
    Map<String, dynamic>? confessionSchedule,
  });
}

/// @nodoc
class __$$ChurchImplCopyWithImpl<$Res>
    extends _$ChurchCopyWithImpl<$Res, _$ChurchImpl>
    implements _$$ChurchImplCopyWith<$Res> {
  __$$ChurchImplCopyWithImpl(
    _$ChurchImpl _value,
    $Res Function(_$ChurchImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? slug = null,
    Object? address = freezed,
    Object? city = null,
    Object? state = freezed,
    Object? country = freezed,
    Object? primaryImageUrl = freezed,
    Object? website = freezed,
    Object? phone = freezed,
    Object? type = null,
    Object? isVerified = null,
    Object? latitude = freezed,
    Object? longitude = freezed,
    Object? massSchedule = freezed,
    Object? confessionSchedule = freezed,
  }) {
    return _then(
      _$ChurchImpl(
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
        address: freezed == address
            ? _value.address
            : address // ignore: cast_nullable_to_non_nullable
                  as String?,
        city: null == city
            ? _value.city
            : city // ignore: cast_nullable_to_non_nullable
                  as String,
        state: freezed == state
            ? _value.state
            : state // ignore: cast_nullable_to_non_nullable
                  as String?,
        country: freezed == country
            ? _value.country
            : country // ignore: cast_nullable_to_non_nullable
                  as String?,
        primaryImageUrl: freezed == primaryImageUrl
            ? _value.primaryImageUrl
            : primaryImageUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        website: freezed == website
            ? _value.website
            : website // ignore: cast_nullable_to_non_nullable
                  as String?,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        type: null == type
            ? _value.type
            : type // ignore: cast_nullable_to_non_nullable
                  as String,
        isVerified: null == isVerified
            ? _value.isVerified
            : isVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
        latitude: freezed == latitude
            ? _value.latitude
            : latitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        longitude: freezed == longitude
            ? _value.longitude
            : longitude // ignore: cast_nullable_to_non_nullable
                  as double?,
        massSchedule: freezed == massSchedule
            ? _value._massSchedule
            : massSchedule // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        confessionSchedule: freezed == confessionSchedule
            ? _value._confessionSchedule
            : confessionSchedule // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ChurchImpl implements _Church {
  const _$ChurchImpl({
    required this.id,
    required this.name,
    required this.slug,
    this.address,
    required this.city,
    this.state,
    this.country,
    this.primaryImageUrl,
    this.website,
    this.phone,
    this.type = 'PARISH',
    this.isVerified = false,
    this.latitude,
    this.longitude,
    final Map<String, dynamic>? massSchedule,
    final Map<String, dynamic>? confessionSchedule,
  }) : _massSchedule = massSchedule,
       _confessionSchedule = confessionSchedule;

  factory _$ChurchImpl.fromJson(Map<String, dynamic> json) =>
      _$$ChurchImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String slug;
  @override
  final String? address;
  @override
  final String city;
  @override
  final String? state;
  @override
  final String? country;
  @override
  final String? primaryImageUrl;
  @override
  final String? website;
  @override
  final String? phone;
  @override
  @JsonKey()
  final String type;
  @override
  @JsonKey()
  final bool isVerified;
  @override
  final double? latitude;
  @override
  final double? longitude;
  final Map<String, dynamic>? _massSchedule;
  @override
  Map<String, dynamic>? get massSchedule {
    final value = _massSchedule;
    if (value == null) return null;
    if (_massSchedule is EqualUnmodifiableMapView) return _massSchedule;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  final Map<String, dynamic>? _confessionSchedule;
  @override
  Map<String, dynamic>? get confessionSchedule {
    final value = _confessionSchedule;
    if (value == null) return null;
    if (_confessionSchedule is EqualUnmodifiableMapView)
      return _confessionSchedule;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  String toString() {
    return 'Church(id: $id, name: $name, slug: $slug, address: $address, city: $city, state: $state, country: $country, primaryImageUrl: $primaryImageUrl, website: $website, phone: $phone, type: $type, isVerified: $isVerified, latitude: $latitude, longitude: $longitude, massSchedule: $massSchedule, confessionSchedule: $confessionSchedule)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ChurchImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.slug, slug) || other.slug == slug) &&
            (identical(other.address, address) || other.address == address) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.state, state) || other.state == state) &&
            (identical(other.country, country) || other.country == country) &&
            (identical(other.primaryImageUrl, primaryImageUrl) ||
                other.primaryImageUrl == primaryImageUrl) &&
            (identical(other.website, website) || other.website == website) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified) &&
            (identical(other.latitude, latitude) ||
                other.latitude == latitude) &&
            (identical(other.longitude, longitude) ||
                other.longitude == longitude) &&
            const DeepCollectionEquality().equals(
              other._massSchedule,
              _massSchedule,
            ) &&
            const DeepCollectionEquality().equals(
              other._confessionSchedule,
              _confessionSchedule,
            ));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    slug,
    address,
    city,
    state,
    country,
    primaryImageUrl,
    website,
    phone,
    type,
    isVerified,
    latitude,
    longitude,
    const DeepCollectionEquality().hash(_massSchedule),
    const DeepCollectionEquality().hash(_confessionSchedule),
  );

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ChurchImplCopyWith<_$ChurchImpl> get copyWith =>
      __$$ChurchImplCopyWithImpl<_$ChurchImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ChurchImplToJson(this);
  }
}

abstract class _Church implements Church {
  const factory _Church({
    required final String id,
    required final String name,
    required final String slug,
    final String? address,
    required final String city,
    final String? state,
    final String? country,
    final String? primaryImageUrl,
    final String? website,
    final String? phone,
    final String type,
    final bool isVerified,
    final double? latitude,
    final double? longitude,
    final Map<String, dynamic>? massSchedule,
    final Map<String, dynamic>? confessionSchedule,
  }) = _$ChurchImpl;

  factory _Church.fromJson(Map<String, dynamic> json) = _$ChurchImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get slug;
  @override
  String? get address;
  @override
  String get city;
  @override
  String? get state;
  @override
  String? get country;
  @override
  String? get primaryImageUrl;
  @override
  String? get website;
  @override
  String? get phone;
  @override
  String get type;
  @override
  bool get isVerified;
  @override
  double? get latitude;
  @override
  double? get longitude;
  @override
  Map<String, dynamic>? get massSchedule;
  @override
  Map<String, dynamic>? get confessionSchedule;

  /// Create a copy of Church
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ChurchImplCopyWith<_$ChurchImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
