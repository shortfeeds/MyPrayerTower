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
  imageUrl: json['primaryImageUrl'] as String?,
  website: json['website'] as String?,
  phone: json['phone'] as String?,
  type: json['type'] as String? ?? 'PARISH',
  isVerified: json['isVerified'] as bool? ?? false,
  latitude: (json['latitude'] as num?)?.toDouble(),
  longitude: (json['longitude'] as num?)?.toDouble(),
  massSchedule: json['massSchedule'] as Map<String, dynamic>?,
  confessionSchedule: json['confessionSchedule'] as Map<String, dynamic>?,
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
      'primaryImageUrl': instance.imageUrl,
      'website': instance.website,
      'phone': instance.phone,
      'type': instance.type,
      'isVerified': instance.isVerified,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'massSchedule': instance.massSchedule,
      'confessionSchedule': instance.confessionSchedule,
    };
