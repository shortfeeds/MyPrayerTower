// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mass_offering_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MassOfferingImpl _$$MassOfferingImplFromJson(Map<String, dynamic> json) =>
    _$MassOfferingImpl(
      id: json['id'] as String,
      orderNumber: json['orderNumber'] as String,
      offeringType:
          $enumDecodeNullable(
            _$MassOfferingTypeEnumMap,
            json['offeringType'],
          ) ??
          MassOfferingType.regular,
      amount: (json['amount'] as num).toInt(),
      currency: json['currency'] as String? ?? 'usd',
      intentionFor: json['intentionFor'] as String,
      additionalNames:
          (json['additionalNames'] as List<dynamic>?)
              ?.map((e) => e as String)
              .toList() ??
          const [],
      isForLiving: json['isForLiving'] as bool? ?? false,
      categories:
          (json['categories'] as List<dynamic>?)
              ?.map((e) => $enumDecode(_$IntentionCategoryEnumMap, e))
              .toList() ??
          const [],
      specialIntention: json['specialIntention'] as String?,
      offeredBy: json['offeredBy'] as String?,
      inMemoryOf: json['inMemoryOf'] as String?,
      inHonorOf: json['inHonorOf'] as String?,
      tributeMessage: json['tributeMessage'] as String?,
      userId: json['userId'] as String?,
      email: json['email'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String?,
      isGift: json['isGift'] as bool? ?? false,
      recipientEmail: json['recipientEmail'] as String?,
      recipientName: json['recipientName'] as String?,
      giftMessage: json['giftMessage'] as String?,
      sendDate: json['sendDate'] == null
          ? null
          : DateTime.parse(json['sendDate'] as String),
      status:
          $enumDecodeNullable(_$MassOfferingStatusEnumMap, json['status']) ??
          MassOfferingStatus.pendingPayment,
      stripePaymentId: json['stripePaymentId'] as String?,
      stripeSessionId: json['stripeSessionId'] as String?,
      paidAt: json['paidAt'] == null
          ? null
          : DateTime.parse(json['paidAt'] as String),
      partnerId: json['partnerId'] as String?,
      celebrationDate: json['celebrationDate'] == null
          ? null
          : DateTime.parse(json['celebrationDate'] as String),
      celebrant: json['celebrant'] as String?,
      massTime: json['massTime'] as String?,
      certificateUrl: json['certificateUrl'] as String?,
      cardGeneratedAt: json['cardGeneratedAt'] == null
          ? null
          : DateTime.parse(json['cardGeneratedAt'] as String),
      confirmationSent: json['confirmationSent'] as bool? ?? false,
      celebrationNotificationSent:
          json['celebrationNotificationSent'] as bool? ?? false,
      includesPrayerCandle: json['includesPrayerCandle'] as bool? ?? false,
      includesPrintedCard: json['includesPrintedCard'] as bool? ?? false,
      includesFramedCertificate:
          json['includesFramedCertificate'] as bool? ?? false,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$MassOfferingImplToJson(_$MassOfferingImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'orderNumber': instance.orderNumber,
      'offeringType': _$MassOfferingTypeEnumMap[instance.offeringType]!,
      'amount': instance.amount,
      'currency': instance.currency,
      'intentionFor': instance.intentionFor,
      'additionalNames': instance.additionalNames,
      'isForLiving': instance.isForLiving,
      'categories': instance.categories
          .map((e) => _$IntentionCategoryEnumMap[e]!)
          .toList(),
      'specialIntention': instance.specialIntention,
      'offeredBy': instance.offeredBy,
      'inMemoryOf': instance.inMemoryOf,
      'inHonorOf': instance.inHonorOf,
      'tributeMessage': instance.tributeMessage,
      'userId': instance.userId,
      'email': instance.email,
      'name': instance.name,
      'phone': instance.phone,
      'isGift': instance.isGift,
      'recipientEmail': instance.recipientEmail,
      'recipientName': instance.recipientName,
      'giftMessage': instance.giftMessage,
      'sendDate': instance.sendDate?.toIso8601String(),
      'status': _$MassOfferingStatusEnumMap[instance.status]!,
      'stripePaymentId': instance.stripePaymentId,
      'stripeSessionId': instance.stripeSessionId,
      'paidAt': instance.paidAt?.toIso8601String(),
      'partnerId': instance.partnerId,
      'celebrationDate': instance.celebrationDate?.toIso8601String(),
      'celebrant': instance.celebrant,
      'massTime': instance.massTime,
      'certificateUrl': instance.certificateUrl,
      'cardGeneratedAt': instance.cardGeneratedAt?.toIso8601String(),
      'confirmationSent': instance.confirmationSent,
      'celebrationNotificationSent': instance.celebrationNotificationSent,
      'includesPrayerCandle': instance.includesPrayerCandle,
      'includesPrintedCard': instance.includesPrintedCard,
      'includesFramedCertificate': instance.includesFramedCertificate,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };

const _$MassOfferingTypeEnumMap = {
  MassOfferingType.regular: 'REGULAR',
  MassOfferingType.expedited: 'EXPEDITED',
  MassOfferingType.novena: 'NOVENA',
  MassOfferingType.gregorian: 'GREGORIAN',
  MassOfferingType.perpetual: 'PERPETUAL',
  MassOfferingType.monthlyClub: 'MONTHLY_CLUB',
};

const _$IntentionCategoryEnumMap = {
  IntentionCategory.thanksgiving: 'THANKSGIVING',
  IntentionCategory.goodHealth: 'GOOD_HEALTH',
  IntentionCategory.healing: 'HEALING',
  IntentionCategory.birthdayBlessing: 'BIRTHDAY_BLESSING',
  IntentionCategory.weddingAnniversary: 'WEDDING_ANNIVERSARY',
  IntentionCategory.safeTravel: 'SAFE_TRAVEL',
  IntentionCategory.examSuccess: 'EXAM_SUCCESS',
  IntentionCategory.careerSuccess: 'CAREER_SUCCESS',
  IntentionCategory.familyPeace: 'FAMILY_PEACE',
  IntentionCategory.familyUnity: 'FAMILY_UNITY',
  IntentionCategory.protection: 'PROTECTION',
  IntentionCategory.conversion: 'CONVERSION',
  IntentionCategory.specialGrace: 'SPECIAL_GRACE',
  IntentionCategory.vocations: 'VOCATIONS',
  IntentionCategory.reposeOfSoul: 'REPOSE_OF_SOUL',
  IntentionCategory.allSouls: 'ALL_SOULS',
  IntentionCategory.deathAnniversary: 'DEATH_ANNIVERSARY',
  IntentionCategory.recentlyDeceased: 'RECENTLY_DECEASED',
  IntentionCategory.forgottenSouls: 'FORGOTTEN_SOULS',
  IntentionCategory.purgatory: 'PURGATORY',
  IntentionCategory.feastDay: 'FEAST_DAY',
  IntentionCategory.allSaints: 'ALL_SAINTS',
  IntentionCategory.christmas: 'CHRISTMAS',
  IntentionCategory.easter: 'EASTER',
  IntentionCategory.mothersDay: 'MOTHERS_DAY',
  IntentionCategory.fathersDay: 'FATHERS_DAY',
  IntentionCategory.specialIntention: 'SPECIAL_INTENTION',
  IntentionCategory.other: 'OTHER',
};

const _$MassOfferingStatusEnumMap = {
  MassOfferingStatus.pendingPayment: 'PENDING',
  MassOfferingStatus.paid: 'PAID',
  MassOfferingStatus.assigned: 'ASSIGNED',
  MassOfferingStatus.scheduled: 'SCHEDULED',
  MassOfferingStatus.offered: 'OFFERED',
  MassOfferingStatus.completed: 'COMPLETED',
  MassOfferingStatus.cancelled: 'CANCELLED',
  MassOfferingStatus.refunded: 'REFUNDED',
};
