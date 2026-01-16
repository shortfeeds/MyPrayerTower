// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserImpl _$$UserImplFromJson(Map<String, dynamic> json) => _$UserImpl(
  id: json['id'] as String,
  email: json['email'] as String,
  emailVerified: json['emailVerified'] as bool? ?? false,
  phone: json['phone'] as String?,
  phoneVerified: json['phoneVerified'] as bool? ?? false,
  firstName: json['firstName'] as String?,
  lastName: json['lastName'] as String?,
  displayName: json['displayName'] as String?,
  avatarUrl: json['avatarUrl'] as String?,
  bio: json['bio'] as String?,
  language: json['language'] as String? ?? 'en',
  timezone: json['timezone'] as String? ?? 'UTC',
  notificationsEnabled: json['notificationsEnabled'] as bool? ?? true,
  subscriptionTier: json['subscriptionTier'] as String? ?? 'FREE',
  subscriptionEnds: json['subscriptionEnds'] == null
      ? null
      : DateTime.parse(json['subscriptionEnds'] as String),
  subscriptionSource: json['subscriptionSource'] as String?,
  stripeCustomerId: json['stripeCustomerId'] as String?,
  homeChurchId: json['homeChurchId'] as String?,
  createdAt: json['createdAt'] == null
      ? null
      : DateTime.parse(json['createdAt'] as String),
  updatedAt: json['updatedAt'] == null
      ? null
      : DateTime.parse(json['updatedAt'] as String),
  lastLoginAt: json['lastLoginAt'] == null
      ? null
      : DateTime.parse(json['lastLoginAt'] as String),
  lastConfessionAt: json['lastConfessionAt'] == null
      ? null
      : DateTime.parse(json['lastConfessionAt'] as String),
  lastStreakUpdate: json['lastStreakUpdate'] == null
      ? null
      : DateTime.parse(json['lastStreakUpdate'] as String),
  longestStreak: (json['longestStreak'] as num?)?.toInt() ?? 0,
  streakCount: (json['streakCount'] as num?)?.toInt() ?? 0,
  currentStreak: (json['currentStreak'] as num?)?.toInt() ?? 0,
  totalPrayers: (json['totalPrayers'] as num?)?.toInt() ?? 0,
  totalPrayedFor: (json['totalPrayedFor'] as num?)?.toInt() ?? 0,
  level: (json['level'] as num?)?.toInt() ?? 1,
  xp: (json['xp'] as num?)?.toInt() ?? 0,
  lastPrayerDate: json['lastPrayerDate'] == null
      ? null
      : DateTime.parse(json['lastPrayerDate'] as String),
);

Map<String, dynamic> _$$UserImplToJson(_$UserImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'emailVerified': instance.emailVerified,
      'phone': instance.phone,
      'phoneVerified': instance.phoneVerified,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'displayName': instance.displayName,
      'avatarUrl': instance.avatarUrl,
      'bio': instance.bio,
      'language': instance.language,
      'timezone': instance.timezone,
      'notificationsEnabled': instance.notificationsEnabled,
      'subscriptionTier': instance.subscriptionTier,
      'subscriptionEnds': instance.subscriptionEnds?.toIso8601String(),
      'subscriptionSource': instance.subscriptionSource,
      'stripeCustomerId': instance.stripeCustomerId,
      'homeChurchId': instance.homeChurchId,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
      'lastLoginAt': instance.lastLoginAt?.toIso8601String(),
      'lastConfessionAt': instance.lastConfessionAt?.toIso8601String(),
      'lastStreakUpdate': instance.lastStreakUpdate?.toIso8601String(),
      'longestStreak': instance.longestStreak,
      'streakCount': instance.streakCount,
      'currentStreak': instance.currentStreak,
      'totalPrayers': instance.totalPrayers,
      'totalPrayedFor': instance.totalPrayedFor,
      'level': instance.level,
      'xp': instance.xp,
      'lastPrayerDate': instance.lastPrayerDate?.toIso8601String(),
    };
