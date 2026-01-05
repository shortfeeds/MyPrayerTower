// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prayer_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PrayerRequestImpl _$$PrayerRequestImplFromJson(Map<String, dynamic> json) =>
    _$PrayerRequestImpl(
      id: json['id'] as String,
      content: json['content'] as String,
      userId: json['userId'] as String?,
      prayCount: (json['prayerCount'] as num?)?.toInt() ?? 0,
      isAnonymous: json['isAnonymous'] as bool,
      category: json['category'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$PrayerRequestImplToJson(_$PrayerRequestImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'userId': instance.userId,
      'prayerCount': instance.prayCount,
      'isAnonymous': instance.isAnonymous,
      'category': instance.category,
      'createdAt': instance.createdAt?.toIso8601String(),
    };
