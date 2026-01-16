// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'church_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ChurchImpl _$$ChurchImplFromJson(Map<String, dynamic> json) => _$ChurchImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  address: json['address'] as String?,
  city: json['city'] as String,
  state: json['state'] as String?,
  country: json['country'] as String?,
  countryCode: json['countryCode'] as String?,
  postalCode: json['postalCode'] as String?,
  primaryImageUrl: json['primaryImageUrl'] as String?,
  website: json['website'] as String?,
  phone: json['phone'] as String?,
  email: json['email'] as String?,
  type: json['type'] as String? ?? 'PARISH',
  denomination: json['denomination'] as String?,
  dioceseId: json['dioceseId'] as String?,
  isVerified: json['isVerified'] as bool? ?? false,
  verifiedAt: json['verifiedAt'] == null
      ? null
      : DateTime.parse(json['verifiedAt'] as String),
  claimedBy: json['claimedBy'] as String?,
  description: json['description'] as String?,
  shortDescription: json['shortDescription'] as String?,
  history: json['history'] as String?,
  virtualTourUrl: json['virtualTourUrl'] as String?,
  calendarUrl: json['calendarUrl'] as String?,
  externalId: json['externalId'] as String?,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  massSchedule: json['massSchedule'] as Map<String, dynamic>?,
  confessionSchedule: json['confessionSchedule'] as Map<String, dynamic>?,
  adorationSchedule: json['adorationSchedule'] as Map<String, dynamic>?,
  lastSyncedAt: json['lastSyncedAt'] == null
      ? null
      : DateTime.parse(json['lastSyncedAt'] as String),
  viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
  followerCount: (json['followerCount'] as num?)?.toInt() ?? 0,
  stripeAccountId: json['stripeAccountId'] as String?,
  totalDonations: (json['totalDonations'] as num?)?.toInt() ?? 0,
  donationCount: (json['donationCount'] as num?)?.toInt() ?? 0,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
);

Map<String, dynamic> _$$ChurchImplToJson(_$ChurchImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'address': instance.address,
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
      'countryCode': instance.countryCode,
      'postalCode': instance.postalCode,
      'primaryImageUrl': instance.primaryImageUrl,
      'website': instance.website,
      'phone': instance.phone,
      'email': instance.email,
      'type': instance.type,
      'denomination': instance.denomination,
      'dioceseId': instance.dioceseId,
      'isVerified': instance.isVerified,
      'verifiedAt': instance.verifiedAt?.toIso8601String(),
      'claimedBy': instance.claimedBy,
      'description': instance.description,
      'shortDescription': instance.shortDescription,
      'history': instance.history,
      'virtualTourUrl': instance.virtualTourUrl,
      'calendarUrl': instance.calendarUrl,
      'externalId': instance.externalId,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'massSchedule': instance.massSchedule,
      'confessionSchedule': instance.confessionSchedule,
      'adorationSchedule': instance.adorationSchedule,
      'lastSyncedAt': instance.lastSyncedAt?.toIso8601String(),
      'viewCount': instance.viewCount,
      'followerCount': instance.followerCount,
      'stripeAccountId': instance.stripeAccountId,
      'totalDonations': instance.totalDonations,
      'donationCount': instance.donationCount,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
