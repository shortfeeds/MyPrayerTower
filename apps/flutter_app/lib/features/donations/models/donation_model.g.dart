// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'donation_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DonationTierImpl _$$DonationTierImplFromJson(Map<String, dynamic> json) =>
    _$DonationTierImpl(
      id: json['id'] as String,
      label: json['label'] as String,
      icon: json['icon'] as String,
      amount: (json['amount'] as num).toInt(),
      description: json['description'] as String?,
      isPopular: json['isPopular'] as bool? ?? false,
    );

Map<String, dynamic> _$$DonationTierImplToJson(_$DonationTierImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'label': instance.label,
      'icon': instance.icon,
      'amount': instance.amount,
      'description': instance.description,
      'isPopular': instance.isPopular,
    };

_$SubscriptionPlanImpl _$$SubscriptionPlanImplFromJson(
  Map<String, dynamic> json,
) => _$SubscriptionPlanImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  icon: json['icon'] as String,
  price: (json['price'] as num).toInt(),
  perks: (json['perks'] as List<dynamic>).map((e) => e as String).toList(),
  isPopular: json['isPopular'] as bool? ?? false,
);

Map<String, dynamic> _$$SubscriptionPlanImplToJson(
  _$SubscriptionPlanImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'icon': instance.icon,
  'price': instance.price,
  'perks': instance.perks,
  'isPopular': instance.isPopular,
};

_$DonationRequestImpl _$$DonationRequestImplFromJson(
  Map<String, dynamic> json,
) => _$DonationRequestImpl(
  amount: (json['amount'] as num).toInt(),
  email: json['email'] as String,
  name: json['name'] as String,
  phone: json['phone'] as String?,
  isAnonymous: json['isAnonymous'] as bool? ?? false,
  message: json['message'] as String?,
  inMemoryOf: json['inMemoryOf'] as String?,
  inHonorOf: json['inHonorOf'] as String?,
  coversFee: json['coversFee'] as bool? ?? false,
  currency: json['currency'] as String? ?? 'usd',
);

Map<String, dynamic> _$$DonationRequestImplToJson(
  _$DonationRequestImpl instance,
) => <String, dynamic>{
  'amount': instance.amount,
  'email': instance.email,
  'name': instance.name,
  'phone': instance.phone,
  'isAnonymous': instance.isAnonymous,
  'message': instance.message,
  'inMemoryOf': instance.inMemoryOf,
  'inHonorOf': instance.inHonorOf,
  'coversFee': instance.coversFee,
  'currency': instance.currency,
};

_$DonationImpl _$$DonationImplFromJson(Map<String, dynamic> json) =>
    _$DonationImpl(
      id: json['id'] as String,
      churchId: json['churchId'] as String,
      userId: json['userId'] as String?,
      amount: (json['amount'] as num).toInt(),
      currency: json['currency'] as String? ?? 'usd',
      message: json['message'] as String?,
      isAnonymous: json['isAnonymous'] as bool? ?? false,
      stripeSessionId: json['stripeSessionId'] as String?,
      status: json['status'] as String? ?? 'PENDING',
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$DonationImplToJson(_$DonationImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'churchId': instance.churchId,
      'userId': instance.userId,
      'amount': instance.amount,
      'currency': instance.currency,
      'message': instance.message,
      'isAnonymous': instance.isAnonymous,
      'stripeSessionId': instance.stripeSessionId,
      'status': instance.status,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
