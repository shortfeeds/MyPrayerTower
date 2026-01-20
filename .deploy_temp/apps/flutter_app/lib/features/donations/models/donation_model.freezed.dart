// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'donation_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

DonationTier _$DonationTierFromJson(Map<String, dynamic> json) {
  return _DonationTier.fromJson(json);
}

/// @nodoc
mixin _$DonationTier {
  String get id => throw _privateConstructorUsedError;
  String get label => throw _privateConstructorUsedError;
  String get icon => throw _privateConstructorUsedError;
  int get amount => throw _privateConstructorUsedError; // in cents
  String? get description => throw _privateConstructorUsedError;
  bool get isPopular => throw _privateConstructorUsedError;

  /// Serializes this DonationTier to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DonationTier
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DonationTierCopyWith<DonationTier> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DonationTierCopyWith<$Res> {
  factory $DonationTierCopyWith(
    DonationTier value,
    $Res Function(DonationTier) then,
  ) = _$DonationTierCopyWithImpl<$Res, DonationTier>;
  @useResult
  $Res call({
    String id,
    String label,
    String icon,
    int amount,
    String? description,
    bool isPopular,
  });
}

/// @nodoc
class _$DonationTierCopyWithImpl<$Res, $Val extends DonationTier>
    implements $DonationTierCopyWith<$Res> {
  _$DonationTierCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DonationTier
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? label = null,
    Object? icon = null,
    Object? amount = null,
    Object? description = freezed,
    Object? isPopular = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            label: null == label
                ? _value.label
                : label // ignore: cast_nullable_to_non_nullable
                      as String,
            icon: null == icon
                ? _value.icon
                : icon // ignore: cast_nullable_to_non_nullable
                      as String,
            amount: null == amount
                ? _value.amount
                : amount // ignore: cast_nullable_to_non_nullable
                      as int,
            description: freezed == description
                ? _value.description
                : description // ignore: cast_nullable_to_non_nullable
                      as String?,
            isPopular: null == isPopular
                ? _value.isPopular
                : isPopular // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DonationTierImplCopyWith<$Res>
    implements $DonationTierCopyWith<$Res> {
  factory _$$DonationTierImplCopyWith(
    _$DonationTierImpl value,
    $Res Function(_$DonationTierImpl) then,
  ) = __$$DonationTierImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String label,
    String icon,
    int amount,
    String? description,
    bool isPopular,
  });
}

/// @nodoc
class __$$DonationTierImplCopyWithImpl<$Res>
    extends _$DonationTierCopyWithImpl<$Res, _$DonationTierImpl>
    implements _$$DonationTierImplCopyWith<$Res> {
  __$$DonationTierImplCopyWithImpl(
    _$DonationTierImpl _value,
    $Res Function(_$DonationTierImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DonationTier
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? label = null,
    Object? icon = null,
    Object? amount = null,
    Object? description = freezed,
    Object? isPopular = null,
  }) {
    return _then(
      _$DonationTierImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        label: null == label
            ? _value.label
            : label // ignore: cast_nullable_to_non_nullable
                  as String,
        icon: null == icon
            ? _value.icon
            : icon // ignore: cast_nullable_to_non_nullable
                  as String,
        amount: null == amount
            ? _value.amount
            : amount // ignore: cast_nullable_to_non_nullable
                  as int,
        description: freezed == description
            ? _value.description
            : description // ignore: cast_nullable_to_non_nullable
                  as String?,
        isPopular: null == isPopular
            ? _value.isPopular
            : isPopular // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DonationTierImpl implements _DonationTier {
  const _$DonationTierImpl({
    required this.id,
    required this.label,
    required this.icon,
    required this.amount,
    this.description,
    this.isPopular = false,
  });

  factory _$DonationTierImpl.fromJson(Map<String, dynamic> json) =>
      _$$DonationTierImplFromJson(json);

  @override
  final String id;
  @override
  final String label;
  @override
  final String icon;
  @override
  final int amount;
  // in cents
  @override
  final String? description;
  @override
  @JsonKey()
  final bool isPopular;

  @override
  String toString() {
    return 'DonationTier(id: $id, label: $label, icon: $icon, amount: $amount, description: $description, isPopular: $isPopular)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DonationTierImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.label, label) || other.label == label) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.isPopular, isPopular) ||
                other.isPopular == isPopular));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, label, icon, amount, description, isPopular);

  /// Create a copy of DonationTier
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DonationTierImplCopyWith<_$DonationTierImpl> get copyWith =>
      __$$DonationTierImplCopyWithImpl<_$DonationTierImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DonationTierImplToJson(this);
  }
}

abstract class _DonationTier implements DonationTier {
  const factory _DonationTier({
    required final String id,
    required final String label,
    required final String icon,
    required final int amount,
    final String? description,
    final bool isPopular,
  }) = _$DonationTierImpl;

  factory _DonationTier.fromJson(Map<String, dynamic> json) =
      _$DonationTierImpl.fromJson;

  @override
  String get id;
  @override
  String get label;
  @override
  String get icon;
  @override
  int get amount; // in cents
  @override
  String? get description;
  @override
  bool get isPopular;

  /// Create a copy of DonationTier
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DonationTierImplCopyWith<_$DonationTierImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

SubscriptionPlan _$SubscriptionPlanFromJson(Map<String, dynamic> json) {
  return _SubscriptionPlan.fromJson(json);
}

/// @nodoc
mixin _$SubscriptionPlan {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get icon => throw _privateConstructorUsedError;
  int get price => throw _privateConstructorUsedError; // in cents per month
  List<String> get perks => throw _privateConstructorUsedError;
  bool get isPopular => throw _privateConstructorUsedError;

  /// Serializes this SubscriptionPlan to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SubscriptionPlanCopyWith<SubscriptionPlan> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SubscriptionPlanCopyWith<$Res> {
  factory $SubscriptionPlanCopyWith(
    SubscriptionPlan value,
    $Res Function(SubscriptionPlan) then,
  ) = _$SubscriptionPlanCopyWithImpl<$Res, SubscriptionPlan>;
  @useResult
  $Res call({
    String id,
    String name,
    String icon,
    int price,
    List<String> perks,
    bool isPopular,
  });
}

/// @nodoc
class _$SubscriptionPlanCopyWithImpl<$Res, $Val extends SubscriptionPlan>
    implements $SubscriptionPlanCopyWith<$Res> {
  _$SubscriptionPlanCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? icon = null,
    Object? price = null,
    Object? perks = null,
    Object? isPopular = null,
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
            icon: null == icon
                ? _value.icon
                : icon // ignore: cast_nullable_to_non_nullable
                      as String,
            price: null == price
                ? _value.price
                : price // ignore: cast_nullable_to_non_nullable
                      as int,
            perks: null == perks
                ? _value.perks
                : perks // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            isPopular: null == isPopular
                ? _value.isPopular
                : isPopular // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$SubscriptionPlanImplCopyWith<$Res>
    implements $SubscriptionPlanCopyWith<$Res> {
  factory _$$SubscriptionPlanImplCopyWith(
    _$SubscriptionPlanImpl value,
    $Res Function(_$SubscriptionPlanImpl) then,
  ) = __$$SubscriptionPlanImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String icon,
    int price,
    List<String> perks,
    bool isPopular,
  });
}

/// @nodoc
class __$$SubscriptionPlanImplCopyWithImpl<$Res>
    extends _$SubscriptionPlanCopyWithImpl<$Res, _$SubscriptionPlanImpl>
    implements _$$SubscriptionPlanImplCopyWith<$Res> {
  __$$SubscriptionPlanImplCopyWithImpl(
    _$SubscriptionPlanImpl _value,
    $Res Function(_$SubscriptionPlanImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? icon = null,
    Object? price = null,
    Object? perks = null,
    Object? isPopular = null,
  }) {
    return _then(
      _$SubscriptionPlanImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        icon: null == icon
            ? _value.icon
            : icon // ignore: cast_nullable_to_non_nullable
                  as String,
        price: null == price
            ? _value.price
            : price // ignore: cast_nullable_to_non_nullable
                  as int,
        perks: null == perks
            ? _value._perks
            : perks // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        isPopular: null == isPopular
            ? _value.isPopular
            : isPopular // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$SubscriptionPlanImpl implements _SubscriptionPlan {
  const _$SubscriptionPlanImpl({
    required this.id,
    required this.name,
    required this.icon,
    required this.price,
    required final List<String> perks,
    this.isPopular = false,
  }) : _perks = perks;

  factory _$SubscriptionPlanImpl.fromJson(Map<String, dynamic> json) =>
      _$$SubscriptionPlanImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String icon;
  @override
  final int price;
  // in cents per month
  final List<String> _perks;
  // in cents per month
  @override
  List<String> get perks {
    if (_perks is EqualUnmodifiableListView) return _perks;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_perks);
  }

  @override
  @JsonKey()
  final bool isPopular;

  @override
  String toString() {
    return 'SubscriptionPlan(id: $id, name: $name, icon: $icon, price: $price, perks: $perks, isPopular: $isPopular)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SubscriptionPlanImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.icon, icon) || other.icon == icon) &&
            (identical(other.price, price) || other.price == price) &&
            const DeepCollectionEquality().equals(other._perks, _perks) &&
            (identical(other.isPopular, isPopular) ||
                other.isPopular == isPopular));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    icon,
    price,
    const DeepCollectionEquality().hash(_perks),
    isPopular,
  );

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SubscriptionPlanImplCopyWith<_$SubscriptionPlanImpl> get copyWith =>
      __$$SubscriptionPlanImplCopyWithImpl<_$SubscriptionPlanImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$SubscriptionPlanImplToJson(this);
  }
}

abstract class _SubscriptionPlan implements SubscriptionPlan {
  const factory _SubscriptionPlan({
    required final String id,
    required final String name,
    required final String icon,
    required final int price,
    required final List<String> perks,
    final bool isPopular,
  }) = _$SubscriptionPlanImpl;

  factory _SubscriptionPlan.fromJson(Map<String, dynamic> json) =
      _$SubscriptionPlanImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get icon;
  @override
  int get price; // in cents per month
  @override
  List<String> get perks;
  @override
  bool get isPopular;

  /// Create a copy of SubscriptionPlan
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SubscriptionPlanImplCopyWith<_$SubscriptionPlanImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

DonationRequest _$DonationRequestFromJson(Map<String, dynamic> json) {
  return _DonationRequest.fromJson(json);
}

/// @nodoc
mixin _$DonationRequest {
  int get amount => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  bool get isAnonymous => throw _privateConstructorUsedError;
  String? get message => throw _privateConstructorUsedError;
  String? get inMemoryOf => throw _privateConstructorUsedError;
  String? get inHonorOf => throw _privateConstructorUsedError;
  bool get coversFee => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;

  /// Serializes this DonationRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of DonationRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DonationRequestCopyWith<DonationRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DonationRequestCopyWith<$Res> {
  factory $DonationRequestCopyWith(
    DonationRequest value,
    $Res Function(DonationRequest) then,
  ) = _$DonationRequestCopyWithImpl<$Res, DonationRequest>;
  @useResult
  $Res call({
    int amount,
    String email,
    String name,
    String? phone,
    bool isAnonymous,
    String? message,
    String? inMemoryOf,
    String? inHonorOf,
    bool coversFee,
    String currency,
  });
}

/// @nodoc
class _$DonationRequestCopyWithImpl<$Res, $Val extends DonationRequest>
    implements $DonationRequestCopyWith<$Res> {
  _$DonationRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of DonationRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? amount = null,
    Object? email = null,
    Object? name = null,
    Object? phone = freezed,
    Object? isAnonymous = null,
    Object? message = freezed,
    Object? inMemoryOf = freezed,
    Object? inHonorOf = freezed,
    Object? coversFee = null,
    Object? currency = null,
  }) {
    return _then(
      _value.copyWith(
            amount: null == amount
                ? _value.amount
                : amount // ignore: cast_nullable_to_non_nullable
                      as int,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            isAnonymous: null == isAnonymous
                ? _value.isAnonymous
                : isAnonymous // ignore: cast_nullable_to_non_nullable
                      as bool,
            message: freezed == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String?,
            inMemoryOf: freezed == inMemoryOf
                ? _value.inMemoryOf
                : inMemoryOf // ignore: cast_nullable_to_non_nullable
                      as String?,
            inHonorOf: freezed == inHonorOf
                ? _value.inHonorOf
                : inHonorOf // ignore: cast_nullable_to_non_nullable
                      as String?,
            coversFee: null == coversFee
                ? _value.coversFee
                : coversFee // ignore: cast_nullable_to_non_nullable
                      as bool,
            currency: null == currency
                ? _value.currency
                : currency // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DonationRequestImplCopyWith<$Res>
    implements $DonationRequestCopyWith<$Res> {
  factory _$$DonationRequestImplCopyWith(
    _$DonationRequestImpl value,
    $Res Function(_$DonationRequestImpl) then,
  ) = __$$DonationRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    int amount,
    String email,
    String name,
    String? phone,
    bool isAnonymous,
    String? message,
    String? inMemoryOf,
    String? inHonorOf,
    bool coversFee,
    String currency,
  });
}

/// @nodoc
class __$$DonationRequestImplCopyWithImpl<$Res>
    extends _$DonationRequestCopyWithImpl<$Res, _$DonationRequestImpl>
    implements _$$DonationRequestImplCopyWith<$Res> {
  __$$DonationRequestImplCopyWithImpl(
    _$DonationRequestImpl _value,
    $Res Function(_$DonationRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of DonationRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? amount = null,
    Object? email = null,
    Object? name = null,
    Object? phone = freezed,
    Object? isAnonymous = null,
    Object? message = freezed,
    Object? inMemoryOf = freezed,
    Object? inHonorOf = freezed,
    Object? coversFee = null,
    Object? currency = null,
  }) {
    return _then(
      _$DonationRequestImpl(
        amount: null == amount
            ? _value.amount
            : amount // ignore: cast_nullable_to_non_nullable
                  as int,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        isAnonymous: null == isAnonymous
            ? _value.isAnonymous
            : isAnonymous // ignore: cast_nullable_to_non_nullable
                  as bool,
        message: freezed == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String?,
        inMemoryOf: freezed == inMemoryOf
            ? _value.inMemoryOf
            : inMemoryOf // ignore: cast_nullable_to_non_nullable
                  as String?,
        inHonorOf: freezed == inHonorOf
            ? _value.inHonorOf
            : inHonorOf // ignore: cast_nullable_to_non_nullable
                  as String?,
        coversFee: null == coversFee
            ? _value.coversFee
            : coversFee // ignore: cast_nullable_to_non_nullable
                  as bool,
        currency: null == currency
            ? _value.currency
            : currency // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DonationRequestImpl implements _DonationRequest {
  const _$DonationRequestImpl({
    required this.amount,
    required this.email,
    required this.name,
    this.phone,
    this.isAnonymous = false,
    this.message,
    this.inMemoryOf,
    this.inHonorOf,
    this.coversFee = false,
    this.currency = 'usd',
  });

  factory _$DonationRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$DonationRequestImplFromJson(json);

  @override
  final int amount;
  @override
  final String email;
  @override
  final String name;
  @override
  final String? phone;
  @override
  @JsonKey()
  final bool isAnonymous;
  @override
  final String? message;
  @override
  final String? inMemoryOf;
  @override
  final String? inHonorOf;
  @override
  @JsonKey()
  final bool coversFee;
  @override
  @JsonKey()
  final String currency;

  @override
  String toString() {
    return 'DonationRequest(amount: $amount, email: $email, name: $name, phone: $phone, isAnonymous: $isAnonymous, message: $message, inMemoryOf: $inMemoryOf, inHonorOf: $inHonorOf, coversFee: $coversFee, currency: $currency)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DonationRequestImpl &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.isAnonymous, isAnonymous) ||
                other.isAnonymous == isAnonymous) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.inMemoryOf, inMemoryOf) ||
                other.inMemoryOf == inMemoryOf) &&
            (identical(other.inHonorOf, inHonorOf) ||
                other.inHonorOf == inHonorOf) &&
            (identical(other.coversFee, coversFee) ||
                other.coversFee == coversFee) &&
            (identical(other.currency, currency) ||
                other.currency == currency));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    amount,
    email,
    name,
    phone,
    isAnonymous,
    message,
    inMemoryOf,
    inHonorOf,
    coversFee,
    currency,
  );

  /// Create a copy of DonationRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DonationRequestImplCopyWith<_$DonationRequestImpl> get copyWith =>
      __$$DonationRequestImplCopyWithImpl<_$DonationRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$DonationRequestImplToJson(this);
  }
}

abstract class _DonationRequest implements DonationRequest {
  const factory _DonationRequest({
    required final int amount,
    required final String email,
    required final String name,
    final String? phone,
    final bool isAnonymous,
    final String? message,
    final String? inMemoryOf,
    final String? inHonorOf,
    final bool coversFee,
    final String currency,
  }) = _$DonationRequestImpl;

  factory _DonationRequest.fromJson(Map<String, dynamic> json) =
      _$DonationRequestImpl.fromJson;

  @override
  int get amount;
  @override
  String get email;
  @override
  String get name;
  @override
  String? get phone;
  @override
  bool get isAnonymous;
  @override
  String? get message;
  @override
  String? get inMemoryOf;
  @override
  String? get inHonorOf;
  @override
  bool get coversFee;
  @override
  String get currency;

  /// Create a copy of DonationRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DonationRequestImplCopyWith<_$DonationRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Donation _$DonationFromJson(Map<String, dynamic> json) {
  return _Donation.fromJson(json);
}

/// @nodoc
mixin _$Donation {
  String get id => throw _privateConstructorUsedError;
  String get churchId => throw _privateConstructorUsedError;
  String? get userId => throw _privateConstructorUsedError;
  int get amount => throw _privateConstructorUsedError;
  String get currency => throw _privateConstructorUsedError;
  String? get message => throw _privateConstructorUsedError;
  bool get isAnonymous => throw _privateConstructorUsedError;
  String? get stripeSessionId => throw _privateConstructorUsedError;
  String get status =>
      throw _privateConstructorUsedError; // PENDING, COMPLETED, FAILED
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this Donation to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of Donation
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $DonationCopyWith<Donation> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DonationCopyWith<$Res> {
  factory $DonationCopyWith(Donation value, $Res Function(Donation) then) =
      _$DonationCopyWithImpl<$Res, Donation>;
  @useResult
  $Res call({
    String id,
    String churchId,
    String? userId,
    int amount,
    String currency,
    String? message,
    bool isAnonymous,
    String? stripeSessionId,
    String status,
    DateTime? createdAt,
    DateTime? updatedAt,
  });
}

/// @nodoc
class _$DonationCopyWithImpl<$Res, $Val extends Donation>
    implements $DonationCopyWith<$Res> {
  _$DonationCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of Donation
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? churchId = null,
    Object? userId = freezed,
    Object? amount = null,
    Object? currency = null,
    Object? message = freezed,
    Object? isAnonymous = null,
    Object? stripeSessionId = freezed,
    Object? status = null,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            churchId: null == churchId
                ? _value.churchId
                : churchId // ignore: cast_nullable_to_non_nullable
                      as String,
            userId: freezed == userId
                ? _value.userId
                : userId // ignore: cast_nullable_to_non_nullable
                      as String?,
            amount: null == amount
                ? _value.amount
                : amount // ignore: cast_nullable_to_non_nullable
                      as int,
            currency: null == currency
                ? _value.currency
                : currency // ignore: cast_nullable_to_non_nullable
                      as String,
            message: freezed == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String?,
            isAnonymous: null == isAnonymous
                ? _value.isAnonymous
                : isAnonymous // ignore: cast_nullable_to_non_nullable
                      as bool,
            stripeSessionId: freezed == stripeSessionId
                ? _value.stripeSessionId
                : stripeSessionId // ignore: cast_nullable_to_non_nullable
                      as String?,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: freezed == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            updatedAt: freezed == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$DonationImplCopyWith<$Res>
    implements $DonationCopyWith<$Res> {
  factory _$$DonationImplCopyWith(
    _$DonationImpl value,
    $Res Function(_$DonationImpl) then,
  ) = __$$DonationImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String churchId,
    String? userId,
    int amount,
    String currency,
    String? message,
    bool isAnonymous,
    String? stripeSessionId,
    String status,
    DateTime? createdAt,
    DateTime? updatedAt,
  });
}

/// @nodoc
class __$$DonationImplCopyWithImpl<$Res>
    extends _$DonationCopyWithImpl<$Res, _$DonationImpl>
    implements _$$DonationImplCopyWith<$Res> {
  __$$DonationImplCopyWithImpl(
    _$DonationImpl _value,
    $Res Function(_$DonationImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of Donation
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? churchId = null,
    Object? userId = freezed,
    Object? amount = null,
    Object? currency = null,
    Object? message = freezed,
    Object? isAnonymous = null,
    Object? stripeSessionId = freezed,
    Object? status = null,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(
      _$DonationImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        churchId: null == churchId
            ? _value.churchId
            : churchId // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: freezed == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String?,
        amount: null == amount
            ? _value.amount
            : amount // ignore: cast_nullable_to_non_nullable
                  as int,
        currency: null == currency
            ? _value.currency
            : currency // ignore: cast_nullable_to_non_nullable
                  as String,
        message: freezed == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String?,
        isAnonymous: null == isAnonymous
            ? _value.isAnonymous
            : isAnonymous // ignore: cast_nullable_to_non_nullable
                  as bool,
        stripeSessionId: freezed == stripeSessionId
            ? _value.stripeSessionId
            : stripeSessionId // ignore: cast_nullable_to_non_nullable
                  as String?,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: freezed == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        updatedAt: freezed == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$DonationImpl implements _Donation {
  const _$DonationImpl({
    required this.id,
    required this.churchId,
    this.userId,
    required this.amount,
    this.currency = 'usd',
    this.message,
    this.isAnonymous = false,
    this.stripeSessionId,
    this.status = 'PENDING',
    this.createdAt,
    this.updatedAt,
  });

  factory _$DonationImpl.fromJson(Map<String, dynamic> json) =>
      _$$DonationImplFromJson(json);

  @override
  final String id;
  @override
  final String churchId;
  @override
  final String? userId;
  @override
  final int amount;
  @override
  @JsonKey()
  final String currency;
  @override
  final String? message;
  @override
  @JsonKey()
  final bool isAnonymous;
  @override
  final String? stripeSessionId;
  @override
  @JsonKey()
  final String status;
  // PENDING, COMPLETED, FAILED
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  @override
  String toString() {
    return 'Donation(id: $id, churchId: $churchId, userId: $userId, amount: $amount, currency: $currency, message: $message, isAnonymous: $isAnonymous, stripeSessionId: $stripeSessionId, status: $status, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DonationImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.churchId, churchId) ||
                other.churchId == churchId) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.isAnonymous, isAnonymous) ||
                other.isAnonymous == isAnonymous) &&
            (identical(other.stripeSessionId, stripeSessionId) ||
                other.stripeSessionId == stripeSessionId) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    churchId,
    userId,
    amount,
    currency,
    message,
    isAnonymous,
    stripeSessionId,
    status,
    createdAt,
    updatedAt,
  );

  /// Create a copy of Donation
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$DonationImplCopyWith<_$DonationImpl> get copyWith =>
      __$$DonationImplCopyWithImpl<_$DonationImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DonationImplToJson(this);
  }
}

abstract class _Donation implements Donation {
  const factory _Donation({
    required final String id,
    required final String churchId,
    final String? userId,
    required final int amount,
    final String currency,
    final String? message,
    final bool isAnonymous,
    final String? stripeSessionId,
    final String status,
    final DateTime? createdAt,
    final DateTime? updatedAt,
  }) = _$DonationImpl;

  factory _Donation.fromJson(Map<String, dynamic> json) =
      _$DonationImpl.fromJson;

  @override
  String get id;
  @override
  String get churchId;
  @override
  String? get userId;
  @override
  int get amount;
  @override
  String get currency;
  @override
  String? get message;
  @override
  bool get isAnonymous;
  @override
  String? get stripeSessionId;
  @override
  String get status; // PENDING, COMPLETED, FAILED
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;

  /// Create a copy of Donation
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$DonationImplCopyWith<_$DonationImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
