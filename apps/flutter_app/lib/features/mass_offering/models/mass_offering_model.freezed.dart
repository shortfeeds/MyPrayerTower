// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'mass_offering_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

MassOffering _$MassOfferingFromJson(Map<String, dynamic> json) {
  return _MassOffering.fromJson(json);
}

/// @nodoc
mixin _$MassOffering {
  String get id => throw _privateConstructorUsedError;
  String get orderNumber => throw _privateConstructorUsedError;
  MassOfferingType get offeringType => throw _privateConstructorUsedError;
  int get amount => throw _privateConstructorUsedError;
  String get currency =>
      throw _privateConstructorUsedError; // Intention Details
  String get intentionFor => throw _privateConstructorUsedError;
  List<String> get additionalNames => throw _privateConstructorUsedError;
  bool get isForLiving => throw _privateConstructorUsedError;
  List<IntentionCategory> get categories => throw _privateConstructorUsedError;
  String? get specialIntention =>
      throw _privateConstructorUsedError; // Tribute/Memorial
  String? get offeredBy => throw _privateConstructorUsedError;
  String? get inMemoryOf => throw _privateConstructorUsedError;
  String? get inHonorOf => throw _privateConstructorUsedError;
  String? get tributeMessage =>
      throw _privateConstructorUsedError; // Purchaser Info
  String? get userId => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError; // Gift Option
  bool get isGift => throw _privateConstructorUsedError;
  String? get recipientEmail => throw _privateConstructorUsedError;
  String? get recipientName => throw _privateConstructorUsedError;
  String? get giftMessage => throw _privateConstructorUsedError;
  DateTime? get sendDate =>
      throw _privateConstructorUsedError; // Status & Payment
  MassOfferingStatus get status => throw _privateConstructorUsedError;
  String? get stripePaymentId => throw _privateConstructorUsedError;
  String? get stripeSessionId => throw _privateConstructorUsedError;
  DateTime? get paidAt => throw _privateConstructorUsedError; // Fulfillment
  String? get partnerId => throw _privateConstructorUsedError;
  DateTime? get celebrationDate => throw _privateConstructorUsedError;
  String? get celebrant => throw _privateConstructorUsedError;
  String? get massTime =>
      throw _privateConstructorUsedError; // Digital Deliverables
  String? get certificateUrl => throw _privateConstructorUsedError;
  DateTime? get cardGeneratedAt => throw _privateConstructorUsedError;
  bool get confirmationSent => throw _privateConstructorUsedError;
  bool get celebrationNotificationSent =>
      throw _privateConstructorUsedError; // Upsells
  bool get includesPrayerCandle => throw _privateConstructorUsedError;
  bool get includesPrintedCard => throw _privateConstructorUsedError;
  bool get includesFramedCertificate => throw _privateConstructorUsedError;
  DateTime? get createdAt => throw _privateConstructorUsedError;
  DateTime? get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this MassOffering to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MassOffering
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MassOfferingCopyWith<MassOffering> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MassOfferingCopyWith<$Res> {
  factory $MassOfferingCopyWith(
    MassOffering value,
    $Res Function(MassOffering) then,
  ) = _$MassOfferingCopyWithImpl<$Res, MassOffering>;
  @useResult
  $Res call({
    String id,
    String orderNumber,
    MassOfferingType offeringType,
    int amount,
    String currency,
    String intentionFor,
    List<String> additionalNames,
    bool isForLiving,
    List<IntentionCategory> categories,
    String? specialIntention,
    String? offeredBy,
    String? inMemoryOf,
    String? inHonorOf,
    String? tributeMessage,
    String? userId,
    String email,
    String name,
    String? phone,
    bool isGift,
    String? recipientEmail,
    String? recipientName,
    String? giftMessage,
    DateTime? sendDate,
    MassOfferingStatus status,
    String? stripePaymentId,
    String? stripeSessionId,
    DateTime? paidAt,
    String? partnerId,
    DateTime? celebrationDate,
    String? celebrant,
    String? massTime,
    String? certificateUrl,
    DateTime? cardGeneratedAt,
    bool confirmationSent,
    bool celebrationNotificationSent,
    bool includesPrayerCandle,
    bool includesPrintedCard,
    bool includesFramedCertificate,
    DateTime? createdAt,
    DateTime? updatedAt,
  });
}

/// @nodoc
class _$MassOfferingCopyWithImpl<$Res, $Val extends MassOffering>
    implements $MassOfferingCopyWith<$Res> {
  _$MassOfferingCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MassOffering
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderNumber = null,
    Object? offeringType = null,
    Object? amount = null,
    Object? currency = null,
    Object? intentionFor = null,
    Object? additionalNames = null,
    Object? isForLiving = null,
    Object? categories = null,
    Object? specialIntention = freezed,
    Object? offeredBy = freezed,
    Object? inMemoryOf = freezed,
    Object? inHonorOf = freezed,
    Object? tributeMessage = freezed,
    Object? userId = freezed,
    Object? email = null,
    Object? name = null,
    Object? phone = freezed,
    Object? isGift = null,
    Object? recipientEmail = freezed,
    Object? recipientName = freezed,
    Object? giftMessage = freezed,
    Object? sendDate = freezed,
    Object? status = null,
    Object? stripePaymentId = freezed,
    Object? stripeSessionId = freezed,
    Object? paidAt = freezed,
    Object? partnerId = freezed,
    Object? celebrationDate = freezed,
    Object? celebrant = freezed,
    Object? massTime = freezed,
    Object? certificateUrl = freezed,
    Object? cardGeneratedAt = freezed,
    Object? confirmationSent = null,
    Object? celebrationNotificationSent = null,
    Object? includesPrayerCandle = null,
    Object? includesPrintedCard = null,
    Object? includesFramedCertificate = null,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            orderNumber: null == orderNumber
                ? _value.orderNumber
                : orderNumber // ignore: cast_nullable_to_non_nullable
                      as String,
            offeringType: null == offeringType
                ? _value.offeringType
                : offeringType // ignore: cast_nullable_to_non_nullable
                      as MassOfferingType,
            amount: null == amount
                ? _value.amount
                : amount // ignore: cast_nullable_to_non_nullable
                      as int,
            currency: null == currency
                ? _value.currency
                : currency // ignore: cast_nullable_to_non_nullable
                      as String,
            intentionFor: null == intentionFor
                ? _value.intentionFor
                : intentionFor // ignore: cast_nullable_to_non_nullable
                      as String,
            additionalNames: null == additionalNames
                ? _value.additionalNames
                : additionalNames // ignore: cast_nullable_to_non_nullable
                      as List<String>,
            isForLiving: null == isForLiving
                ? _value.isForLiving
                : isForLiving // ignore: cast_nullable_to_non_nullable
                      as bool,
            categories: null == categories
                ? _value.categories
                : categories // ignore: cast_nullable_to_non_nullable
                      as List<IntentionCategory>,
            specialIntention: freezed == specialIntention
                ? _value.specialIntention
                : specialIntention // ignore: cast_nullable_to_non_nullable
                      as String?,
            offeredBy: freezed == offeredBy
                ? _value.offeredBy
                : offeredBy // ignore: cast_nullable_to_non_nullable
                      as String?,
            inMemoryOf: freezed == inMemoryOf
                ? _value.inMemoryOf
                : inMemoryOf // ignore: cast_nullable_to_non_nullable
                      as String?,
            inHonorOf: freezed == inHonorOf
                ? _value.inHonorOf
                : inHonorOf // ignore: cast_nullable_to_non_nullable
                      as String?,
            tributeMessage: freezed == tributeMessage
                ? _value.tributeMessage
                : tributeMessage // ignore: cast_nullable_to_non_nullable
                      as String?,
            userId: freezed == userId
                ? _value.userId
                : userId // ignore: cast_nullable_to_non_nullable
                      as String?,
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
            isGift: null == isGift
                ? _value.isGift
                : isGift // ignore: cast_nullable_to_non_nullable
                      as bool,
            recipientEmail: freezed == recipientEmail
                ? _value.recipientEmail
                : recipientEmail // ignore: cast_nullable_to_non_nullable
                      as String?,
            recipientName: freezed == recipientName
                ? _value.recipientName
                : recipientName // ignore: cast_nullable_to_non_nullable
                      as String?,
            giftMessage: freezed == giftMessage
                ? _value.giftMessage
                : giftMessage // ignore: cast_nullable_to_non_nullable
                      as String?,
            sendDate: freezed == sendDate
                ? _value.sendDate
                : sendDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            status: null == status
                ? _value.status
                : status // ignore: cast_nullable_to_non_nullable
                      as MassOfferingStatus,
            stripePaymentId: freezed == stripePaymentId
                ? _value.stripePaymentId
                : stripePaymentId // ignore: cast_nullable_to_non_nullable
                      as String?,
            stripeSessionId: freezed == stripeSessionId
                ? _value.stripeSessionId
                : stripeSessionId // ignore: cast_nullable_to_non_nullable
                      as String?,
            paidAt: freezed == paidAt
                ? _value.paidAt
                : paidAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            partnerId: freezed == partnerId
                ? _value.partnerId
                : partnerId // ignore: cast_nullable_to_non_nullable
                      as String?,
            celebrationDate: freezed == celebrationDate
                ? _value.celebrationDate
                : celebrationDate // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            celebrant: freezed == celebrant
                ? _value.celebrant
                : celebrant // ignore: cast_nullable_to_non_nullable
                      as String?,
            massTime: freezed == massTime
                ? _value.massTime
                : massTime // ignore: cast_nullable_to_non_nullable
                      as String?,
            certificateUrl: freezed == certificateUrl
                ? _value.certificateUrl
                : certificateUrl // ignore: cast_nullable_to_non_nullable
                      as String?,
            cardGeneratedAt: freezed == cardGeneratedAt
                ? _value.cardGeneratedAt
                : cardGeneratedAt // ignore: cast_nullable_to_non_nullable
                      as DateTime?,
            confirmationSent: null == confirmationSent
                ? _value.confirmationSent
                : confirmationSent // ignore: cast_nullable_to_non_nullable
                      as bool,
            celebrationNotificationSent: null == celebrationNotificationSent
                ? _value.celebrationNotificationSent
                : celebrationNotificationSent // ignore: cast_nullable_to_non_nullable
                      as bool,
            includesPrayerCandle: null == includesPrayerCandle
                ? _value.includesPrayerCandle
                : includesPrayerCandle // ignore: cast_nullable_to_non_nullable
                      as bool,
            includesPrintedCard: null == includesPrintedCard
                ? _value.includesPrintedCard
                : includesPrintedCard // ignore: cast_nullable_to_non_nullable
                      as bool,
            includesFramedCertificate: null == includesFramedCertificate
                ? _value.includesFramedCertificate
                : includesFramedCertificate // ignore: cast_nullable_to_non_nullable
                      as bool,
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
abstract class _$$MassOfferingImplCopyWith<$Res>
    implements $MassOfferingCopyWith<$Res> {
  factory _$$MassOfferingImplCopyWith(
    _$MassOfferingImpl value,
    $Res Function(_$MassOfferingImpl) then,
  ) = __$$MassOfferingImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String orderNumber,
    MassOfferingType offeringType,
    int amount,
    String currency,
    String intentionFor,
    List<String> additionalNames,
    bool isForLiving,
    List<IntentionCategory> categories,
    String? specialIntention,
    String? offeredBy,
    String? inMemoryOf,
    String? inHonorOf,
    String? tributeMessage,
    String? userId,
    String email,
    String name,
    String? phone,
    bool isGift,
    String? recipientEmail,
    String? recipientName,
    String? giftMessage,
    DateTime? sendDate,
    MassOfferingStatus status,
    String? stripePaymentId,
    String? stripeSessionId,
    DateTime? paidAt,
    String? partnerId,
    DateTime? celebrationDate,
    String? celebrant,
    String? massTime,
    String? certificateUrl,
    DateTime? cardGeneratedAt,
    bool confirmationSent,
    bool celebrationNotificationSent,
    bool includesPrayerCandle,
    bool includesPrintedCard,
    bool includesFramedCertificate,
    DateTime? createdAt,
    DateTime? updatedAt,
  });
}

/// @nodoc
class __$$MassOfferingImplCopyWithImpl<$Res>
    extends _$MassOfferingCopyWithImpl<$Res, _$MassOfferingImpl>
    implements _$$MassOfferingImplCopyWith<$Res> {
  __$$MassOfferingImplCopyWithImpl(
    _$MassOfferingImpl _value,
    $Res Function(_$MassOfferingImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of MassOffering
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? orderNumber = null,
    Object? offeringType = null,
    Object? amount = null,
    Object? currency = null,
    Object? intentionFor = null,
    Object? additionalNames = null,
    Object? isForLiving = null,
    Object? categories = null,
    Object? specialIntention = freezed,
    Object? offeredBy = freezed,
    Object? inMemoryOf = freezed,
    Object? inHonorOf = freezed,
    Object? tributeMessage = freezed,
    Object? userId = freezed,
    Object? email = null,
    Object? name = null,
    Object? phone = freezed,
    Object? isGift = null,
    Object? recipientEmail = freezed,
    Object? recipientName = freezed,
    Object? giftMessage = freezed,
    Object? sendDate = freezed,
    Object? status = null,
    Object? stripePaymentId = freezed,
    Object? stripeSessionId = freezed,
    Object? paidAt = freezed,
    Object? partnerId = freezed,
    Object? celebrationDate = freezed,
    Object? celebrant = freezed,
    Object? massTime = freezed,
    Object? certificateUrl = freezed,
    Object? cardGeneratedAt = freezed,
    Object? confirmationSent = null,
    Object? celebrationNotificationSent = null,
    Object? includesPrayerCandle = null,
    Object? includesPrintedCard = null,
    Object? includesFramedCertificate = null,
    Object? createdAt = freezed,
    Object? updatedAt = freezed,
  }) {
    return _then(
      _$MassOfferingImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        orderNumber: null == orderNumber
            ? _value.orderNumber
            : orderNumber // ignore: cast_nullable_to_non_nullable
                  as String,
        offeringType: null == offeringType
            ? _value.offeringType
            : offeringType // ignore: cast_nullable_to_non_nullable
                  as MassOfferingType,
        amount: null == amount
            ? _value.amount
            : amount // ignore: cast_nullable_to_non_nullable
                  as int,
        currency: null == currency
            ? _value.currency
            : currency // ignore: cast_nullable_to_non_nullable
                  as String,
        intentionFor: null == intentionFor
            ? _value.intentionFor
            : intentionFor // ignore: cast_nullable_to_non_nullable
                  as String,
        additionalNames: null == additionalNames
            ? _value._additionalNames
            : additionalNames // ignore: cast_nullable_to_non_nullable
                  as List<String>,
        isForLiving: null == isForLiving
            ? _value.isForLiving
            : isForLiving // ignore: cast_nullable_to_non_nullable
                  as bool,
        categories: null == categories
            ? _value._categories
            : categories // ignore: cast_nullable_to_non_nullable
                  as List<IntentionCategory>,
        specialIntention: freezed == specialIntention
            ? _value.specialIntention
            : specialIntention // ignore: cast_nullable_to_non_nullable
                  as String?,
        offeredBy: freezed == offeredBy
            ? _value.offeredBy
            : offeredBy // ignore: cast_nullable_to_non_nullable
                  as String?,
        inMemoryOf: freezed == inMemoryOf
            ? _value.inMemoryOf
            : inMemoryOf // ignore: cast_nullable_to_non_nullable
                  as String?,
        inHonorOf: freezed == inHonorOf
            ? _value.inHonorOf
            : inHonorOf // ignore: cast_nullable_to_non_nullable
                  as String?,
        tributeMessage: freezed == tributeMessage
            ? _value.tributeMessage
            : tributeMessage // ignore: cast_nullable_to_non_nullable
                  as String?,
        userId: freezed == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String?,
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
        isGift: null == isGift
            ? _value.isGift
            : isGift // ignore: cast_nullable_to_non_nullable
                  as bool,
        recipientEmail: freezed == recipientEmail
            ? _value.recipientEmail
            : recipientEmail // ignore: cast_nullable_to_non_nullable
                  as String?,
        recipientName: freezed == recipientName
            ? _value.recipientName
            : recipientName // ignore: cast_nullable_to_non_nullable
                  as String?,
        giftMessage: freezed == giftMessage
            ? _value.giftMessage
            : giftMessage // ignore: cast_nullable_to_non_nullable
                  as String?,
        sendDate: freezed == sendDate
            ? _value.sendDate
            : sendDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        status: null == status
            ? _value.status
            : status // ignore: cast_nullable_to_non_nullable
                  as MassOfferingStatus,
        stripePaymentId: freezed == stripePaymentId
            ? _value.stripePaymentId
            : stripePaymentId // ignore: cast_nullable_to_non_nullable
                  as String?,
        stripeSessionId: freezed == stripeSessionId
            ? _value.stripeSessionId
            : stripeSessionId // ignore: cast_nullable_to_non_nullable
                  as String?,
        paidAt: freezed == paidAt
            ? _value.paidAt
            : paidAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        partnerId: freezed == partnerId
            ? _value.partnerId
            : partnerId // ignore: cast_nullable_to_non_nullable
                  as String?,
        celebrationDate: freezed == celebrationDate
            ? _value.celebrationDate
            : celebrationDate // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        celebrant: freezed == celebrant
            ? _value.celebrant
            : celebrant // ignore: cast_nullable_to_non_nullable
                  as String?,
        massTime: freezed == massTime
            ? _value.massTime
            : massTime // ignore: cast_nullable_to_non_nullable
                  as String?,
        certificateUrl: freezed == certificateUrl
            ? _value.certificateUrl
            : certificateUrl // ignore: cast_nullable_to_non_nullable
                  as String?,
        cardGeneratedAt: freezed == cardGeneratedAt
            ? _value.cardGeneratedAt
            : cardGeneratedAt // ignore: cast_nullable_to_non_nullable
                  as DateTime?,
        confirmationSent: null == confirmationSent
            ? _value.confirmationSent
            : confirmationSent // ignore: cast_nullable_to_non_nullable
                  as bool,
        celebrationNotificationSent: null == celebrationNotificationSent
            ? _value.celebrationNotificationSent
            : celebrationNotificationSent // ignore: cast_nullable_to_non_nullable
                  as bool,
        includesPrayerCandle: null == includesPrayerCandle
            ? _value.includesPrayerCandle
            : includesPrayerCandle // ignore: cast_nullable_to_non_nullable
                  as bool,
        includesPrintedCard: null == includesPrintedCard
            ? _value.includesPrintedCard
            : includesPrintedCard // ignore: cast_nullable_to_non_nullable
                  as bool,
        includesFramedCertificate: null == includesFramedCertificate
            ? _value.includesFramedCertificate
            : includesFramedCertificate // ignore: cast_nullable_to_non_nullable
                  as bool,
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
class _$MassOfferingImpl implements _MassOffering {
  const _$MassOfferingImpl({
    required this.id,
    required this.orderNumber,
    this.offeringType = MassOfferingType.regular,
    required this.amount,
    this.currency = 'usd',
    required this.intentionFor,
    final List<String> additionalNames = const [],
    this.isForLiving = false,
    final List<IntentionCategory> categories = const [],
    this.specialIntention,
    this.offeredBy,
    this.inMemoryOf,
    this.inHonorOf,
    this.tributeMessage,
    this.userId,
    required this.email,
    required this.name,
    this.phone,
    this.isGift = false,
    this.recipientEmail,
    this.recipientName,
    this.giftMessage,
    this.sendDate,
    this.status = MassOfferingStatus.pendingPayment,
    this.stripePaymentId,
    this.stripeSessionId,
    this.paidAt,
    this.partnerId,
    this.celebrationDate,
    this.celebrant,
    this.massTime,
    this.certificateUrl,
    this.cardGeneratedAt,
    this.confirmationSent = false,
    this.celebrationNotificationSent = false,
    this.includesPrayerCandle = false,
    this.includesPrintedCard = false,
    this.includesFramedCertificate = false,
    this.createdAt,
    this.updatedAt,
  }) : _additionalNames = additionalNames,
       _categories = categories;

  factory _$MassOfferingImpl.fromJson(Map<String, dynamic> json) =>
      _$$MassOfferingImplFromJson(json);

  @override
  final String id;
  @override
  final String orderNumber;
  @override
  @JsonKey()
  final MassOfferingType offeringType;
  @override
  final int amount;
  @override
  @JsonKey()
  final String currency;
  // Intention Details
  @override
  final String intentionFor;
  final List<String> _additionalNames;
  @override
  @JsonKey()
  List<String> get additionalNames {
    if (_additionalNames is EqualUnmodifiableListView) return _additionalNames;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_additionalNames);
  }

  @override
  @JsonKey()
  final bool isForLiving;
  final List<IntentionCategory> _categories;
  @override
  @JsonKey()
  List<IntentionCategory> get categories {
    if (_categories is EqualUnmodifiableListView) return _categories;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_categories);
  }

  @override
  final String? specialIntention;
  // Tribute/Memorial
  @override
  final String? offeredBy;
  @override
  final String? inMemoryOf;
  @override
  final String? inHonorOf;
  @override
  final String? tributeMessage;
  // Purchaser Info
  @override
  final String? userId;
  @override
  final String email;
  @override
  final String name;
  @override
  final String? phone;
  // Gift Option
  @override
  @JsonKey()
  final bool isGift;
  @override
  final String? recipientEmail;
  @override
  final String? recipientName;
  @override
  final String? giftMessage;
  @override
  final DateTime? sendDate;
  // Status & Payment
  @override
  @JsonKey()
  final MassOfferingStatus status;
  @override
  final String? stripePaymentId;
  @override
  final String? stripeSessionId;
  @override
  final DateTime? paidAt;
  // Fulfillment
  @override
  final String? partnerId;
  @override
  final DateTime? celebrationDate;
  @override
  final String? celebrant;
  @override
  final String? massTime;
  // Digital Deliverables
  @override
  final String? certificateUrl;
  @override
  final DateTime? cardGeneratedAt;
  @override
  @JsonKey()
  final bool confirmationSent;
  @override
  @JsonKey()
  final bool celebrationNotificationSent;
  // Upsells
  @override
  @JsonKey()
  final bool includesPrayerCandle;
  @override
  @JsonKey()
  final bool includesPrintedCard;
  @override
  @JsonKey()
  final bool includesFramedCertificate;
  @override
  final DateTime? createdAt;
  @override
  final DateTime? updatedAt;

  @override
  String toString() {
    return 'MassOffering(id: $id, orderNumber: $orderNumber, offeringType: $offeringType, amount: $amount, currency: $currency, intentionFor: $intentionFor, additionalNames: $additionalNames, isForLiving: $isForLiving, categories: $categories, specialIntention: $specialIntention, offeredBy: $offeredBy, inMemoryOf: $inMemoryOf, inHonorOf: $inHonorOf, tributeMessage: $tributeMessage, userId: $userId, email: $email, name: $name, phone: $phone, isGift: $isGift, recipientEmail: $recipientEmail, recipientName: $recipientName, giftMessage: $giftMessage, sendDate: $sendDate, status: $status, stripePaymentId: $stripePaymentId, stripeSessionId: $stripeSessionId, paidAt: $paidAt, partnerId: $partnerId, celebrationDate: $celebrationDate, celebrant: $celebrant, massTime: $massTime, certificateUrl: $certificateUrl, cardGeneratedAt: $cardGeneratedAt, confirmationSent: $confirmationSent, celebrationNotificationSent: $celebrationNotificationSent, includesPrayerCandle: $includesPrayerCandle, includesPrintedCard: $includesPrintedCard, includesFramedCertificate: $includesFramedCertificate, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MassOfferingImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.orderNumber, orderNumber) ||
                other.orderNumber == orderNumber) &&
            (identical(other.offeringType, offeringType) ||
                other.offeringType == offeringType) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.currency, currency) ||
                other.currency == currency) &&
            (identical(other.intentionFor, intentionFor) ||
                other.intentionFor == intentionFor) &&
            const DeepCollectionEquality().equals(
              other._additionalNames,
              _additionalNames,
            ) &&
            (identical(other.isForLiving, isForLiving) ||
                other.isForLiving == isForLiving) &&
            const DeepCollectionEquality().equals(
              other._categories,
              _categories,
            ) &&
            (identical(other.specialIntention, specialIntention) ||
                other.specialIntention == specialIntention) &&
            (identical(other.offeredBy, offeredBy) ||
                other.offeredBy == offeredBy) &&
            (identical(other.inMemoryOf, inMemoryOf) ||
                other.inMemoryOf == inMemoryOf) &&
            (identical(other.inHonorOf, inHonorOf) ||
                other.inHonorOf == inHonorOf) &&
            (identical(other.tributeMessage, tributeMessage) ||
                other.tributeMessage == tributeMessage) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.isGift, isGift) || other.isGift == isGift) &&
            (identical(other.recipientEmail, recipientEmail) ||
                other.recipientEmail == recipientEmail) &&
            (identical(other.recipientName, recipientName) ||
                other.recipientName == recipientName) &&
            (identical(other.giftMessage, giftMessage) ||
                other.giftMessage == giftMessage) &&
            (identical(other.sendDate, sendDate) ||
                other.sendDate == sendDate) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.stripePaymentId, stripePaymentId) ||
                other.stripePaymentId == stripePaymentId) &&
            (identical(other.stripeSessionId, stripeSessionId) ||
                other.stripeSessionId == stripeSessionId) &&
            (identical(other.paidAt, paidAt) || other.paidAt == paidAt) &&
            (identical(other.partnerId, partnerId) ||
                other.partnerId == partnerId) &&
            (identical(other.celebrationDate, celebrationDate) ||
                other.celebrationDate == celebrationDate) &&
            (identical(other.celebrant, celebrant) ||
                other.celebrant == celebrant) &&
            (identical(other.massTime, massTime) ||
                other.massTime == massTime) &&
            (identical(other.certificateUrl, certificateUrl) ||
                other.certificateUrl == certificateUrl) &&
            (identical(other.cardGeneratedAt, cardGeneratedAt) ||
                other.cardGeneratedAt == cardGeneratedAt) &&
            (identical(other.confirmationSent, confirmationSent) ||
                other.confirmationSent == confirmationSent) &&
            (identical(
                  other.celebrationNotificationSent,
                  celebrationNotificationSent,
                ) ||
                other.celebrationNotificationSent ==
                    celebrationNotificationSent) &&
            (identical(other.includesPrayerCandle, includesPrayerCandle) ||
                other.includesPrayerCandle == includesPrayerCandle) &&
            (identical(other.includesPrintedCard, includesPrintedCard) ||
                other.includesPrintedCard == includesPrintedCard) &&
            (identical(
                  other.includesFramedCertificate,
                  includesFramedCertificate,
                ) ||
                other.includesFramedCertificate == includesFramedCertificate) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
    runtimeType,
    id,
    orderNumber,
    offeringType,
    amount,
    currency,
    intentionFor,
    const DeepCollectionEquality().hash(_additionalNames),
    isForLiving,
    const DeepCollectionEquality().hash(_categories),
    specialIntention,
    offeredBy,
    inMemoryOf,
    inHonorOf,
    tributeMessage,
    userId,
    email,
    name,
    phone,
    isGift,
    recipientEmail,
    recipientName,
    giftMessage,
    sendDate,
    status,
    stripePaymentId,
    stripeSessionId,
    paidAt,
    partnerId,
    celebrationDate,
    celebrant,
    massTime,
    certificateUrl,
    cardGeneratedAt,
    confirmationSent,
    celebrationNotificationSent,
    includesPrayerCandle,
    includesPrintedCard,
    includesFramedCertificate,
    createdAt,
    updatedAt,
  ]);

  /// Create a copy of MassOffering
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MassOfferingImplCopyWith<_$MassOfferingImpl> get copyWith =>
      __$$MassOfferingImplCopyWithImpl<_$MassOfferingImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MassOfferingImplToJson(this);
  }
}

abstract class _MassOffering implements MassOffering {
  const factory _MassOffering({
    required final String id,
    required final String orderNumber,
    final MassOfferingType offeringType,
    required final int amount,
    final String currency,
    required final String intentionFor,
    final List<String> additionalNames,
    final bool isForLiving,
    final List<IntentionCategory> categories,
    final String? specialIntention,
    final String? offeredBy,
    final String? inMemoryOf,
    final String? inHonorOf,
    final String? tributeMessage,
    final String? userId,
    required final String email,
    required final String name,
    final String? phone,
    final bool isGift,
    final String? recipientEmail,
    final String? recipientName,
    final String? giftMessage,
    final DateTime? sendDate,
    final MassOfferingStatus status,
    final String? stripePaymentId,
    final String? stripeSessionId,
    final DateTime? paidAt,
    final String? partnerId,
    final DateTime? celebrationDate,
    final String? celebrant,
    final String? massTime,
    final String? certificateUrl,
    final DateTime? cardGeneratedAt,
    final bool confirmationSent,
    final bool celebrationNotificationSent,
    final bool includesPrayerCandle,
    final bool includesPrintedCard,
    final bool includesFramedCertificate,
    final DateTime? createdAt,
    final DateTime? updatedAt,
  }) = _$MassOfferingImpl;

  factory _MassOffering.fromJson(Map<String, dynamic> json) =
      _$MassOfferingImpl.fromJson;

  @override
  String get id;
  @override
  String get orderNumber;
  @override
  MassOfferingType get offeringType;
  @override
  int get amount;
  @override
  String get currency; // Intention Details
  @override
  String get intentionFor;
  @override
  List<String> get additionalNames;
  @override
  bool get isForLiving;
  @override
  List<IntentionCategory> get categories;
  @override
  String? get specialIntention; // Tribute/Memorial
  @override
  String? get offeredBy;
  @override
  String? get inMemoryOf;
  @override
  String? get inHonorOf;
  @override
  String? get tributeMessage; // Purchaser Info
  @override
  String? get userId;
  @override
  String get email;
  @override
  String get name;
  @override
  String? get phone; // Gift Option
  @override
  bool get isGift;
  @override
  String? get recipientEmail;
  @override
  String? get recipientName;
  @override
  String? get giftMessage;
  @override
  DateTime? get sendDate; // Status & Payment
  @override
  MassOfferingStatus get status;
  @override
  String? get stripePaymentId;
  @override
  String? get stripeSessionId;
  @override
  DateTime? get paidAt; // Fulfillment
  @override
  String? get partnerId;
  @override
  DateTime? get celebrationDate;
  @override
  String? get celebrant;
  @override
  String? get massTime; // Digital Deliverables
  @override
  String? get certificateUrl;
  @override
  DateTime? get cardGeneratedAt;
  @override
  bool get confirmationSent;
  @override
  bool get celebrationNotificationSent; // Upsells
  @override
  bool get includesPrayerCandle;
  @override
  bool get includesPrintedCard;
  @override
  bool get includesFramedCertificate;
  @override
  DateTime? get createdAt;
  @override
  DateTime? get updatedAt;

  /// Create a copy of MassOffering
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MassOfferingImplCopyWith<_$MassOfferingImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
