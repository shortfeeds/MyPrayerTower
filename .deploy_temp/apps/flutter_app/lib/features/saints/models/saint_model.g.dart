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
  biography: json['biography'] as String?,
  shortBio: json['shortBio'] as String?,
  imageUrl: json['imageUrl'] as String?,
  patronOf: (json['patronOf'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  prayer: json['prayer'] as String?,
  bornDate: json['bornDate'] as String?,
  diedDate: json['diedDate'] as String?,
  canonizedDate: json['canonizedDate'] as String?,
  externalId: json['externalId'] as String?,
  lastSyncedAt: json['lastSyncedAt'] == null
      ? null
      : DateTime.parse(json['lastSyncedAt'] as String),
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
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
      'biography': instance.biography,
      'shortBio': instance.shortBio,
      'imageUrl': instance.imageUrl,
      'patronOf': instance.patronOf,
      'prayer': instance.prayer,
      'bornDate': instance.bornDate,
      'diedDate': instance.diedDate,
      'canonizedDate': instance.canonizedDate,
      'externalId': instance.externalId,
      'lastSyncedAt': instance.lastSyncedAt?.toIso8601String(),
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
