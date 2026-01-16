// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prayer_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PrayerImpl _$$PrayerImplFromJson(Map<String, dynamic> json) => _$PrayerImpl(
  id: _parseId(json['id']),
  title: json['title'] as String,
  slug: json['slug'] as String?,
  content: json['content'] as String,
  category: json['category'] as String,
  categoryLabel: json['category_label'] as String?,
  tags:
      (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      const [],
  isActive: json['is_active'] as bool? ?? true,
  createdAt: json['created_at'] == null
      ? null
      : DateTime.parse(json['created_at'] as String),
);

Map<String, dynamic> _$$PrayerImplToJson(_$PrayerImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'slug': instance.slug,
      'content': instance.content,
      'category': instance.category,
      'category_label': instance.categoryLabel,
      'tags': instance.tags,
      'is_active': instance.isActive,
      'created_at': instance.createdAt?.toIso8601String(),
    };
