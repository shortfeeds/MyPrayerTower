// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'saint_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$SaintImpl _$$SaintImplFromJson(Map<String, dynamic> json) => _$SaintImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  slug: json['slug'] as String,
  title: json['title'] as String?,
  feastDay: json['feastDay'] as String?,
  feastMonth: (json['feastMonth'] as num?)?.toInt(),
  feastDayOfMonth: (json['feastDayOfMonth'] as num?)?.toInt(),
  bio: json['biography'] as String?,
  shortDescription: json['shortBio'] as String?,
  imageUrl: json['imageUrl'] as String?,
  patronage: (json['patronOf'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  prayer: json['prayer'] as String?,
);

Map<String, dynamic> _$$SaintImplToJson(_$SaintImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'slug': instance.slug,
      'title': instance.title,
      'feastDay': instance.feastDay,
      'feastMonth': instance.feastMonth,
      'feastDayOfMonth': instance.feastDayOfMonth,
      'biography': instance.bio,
      'shortBio': instance.shortDescription,
      'imageUrl': instance.imageUrl,
      'patronOf': instance.patronage,
      'prayer': instance.prayer,
    };
