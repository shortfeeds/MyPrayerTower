// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserImpl _$$UserImplFromJson(Map<String, dynamic> json) => _$UserImpl(
  id: json['id'] as String,
  email: json['email'] as String,
  name: json['name'] as String?,
  avatarUrl: json['avatarUrl'] as String?,
  subscriptionStatus: json['subscriptionStatus'] as String? ?? 'FREE',
  isEmailVerified: json['isEmailVerified'] as bool? ?? false,
  streakCount: (json['streakCount'] as num?)?.toInt() ?? 0,
  longestStreak: (json['longestStreak'] as num?)?.toInt() ?? 0,
  lastStreakUpdate: json['lastStreakUpdate'] == null
      ? null
      : DateTime.parse(json['lastStreakUpdate'] as String),
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
);

Map<String, dynamic> _$$UserImplToJson(_$UserImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
      'avatarUrl': instance.avatarUrl,
      'subscriptionStatus': instance.subscriptionStatus,
      'isEmailVerified': instance.isEmailVerified,
      'streakCount': instance.streakCount,
      'longestStreak': instance.longestStreak,
      'lastStreakUpdate': instance.lastStreakUpdate?.toIso8601String(),
      'createdAt': instance.createdAt?.toIso8601String(),
    };
