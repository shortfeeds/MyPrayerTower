// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prayer_request_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PrayerUserImpl _$$PrayerUserImplFromJson(Map<String, dynamic> json) =>
    _$PrayerUserImpl(
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
    );

Map<String, dynamic> _$$PrayerUserImplToJson(_$PrayerUserImpl instance) =>
    <String, dynamic>{
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'avatarUrl': instance.avatarUrl,
    };

_$PrayerRequestImpl _$$PrayerRequestImplFromJson(Map<String, dynamic> json) =>
    _$PrayerRequestImpl(
      id: json['id'] as String,
      content: json['content'] as String,
      userId: json['userId'] as String?,
      prayerCount: (json['prayerCount'] as num?)?.toInt() ?? 0,
      isAnonymous: json['isAnonymous'] as bool? ?? false,
      category: json['category'] as String?,
      country: json['country'] as String?,
      visibility: json['visibility'] as String? ?? 'PUBLIC',
      isAnswered: json['isAnswered'] as bool? ?? false,
      status: json['status'] as String? ?? 'PENDING',
      user: json['User'] == null
          ? null
          : PrayerUser.fromJson(json['User'] as Map<String, dynamic>),
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$PrayerRequestImplToJson(_$PrayerRequestImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'userId': instance.userId,
      'prayerCount': instance.prayerCount,
      'isAnonymous': instance.isAnonymous,
      'category': instance.category,
      'country': instance.country,
      'visibility': instance.visibility,
      'isAnswered': instance.isAnswered,
      'status': instance.status,
      'User': instance.user,
      'createdAt': instance.createdAt?.toIso8601String(),
    };
