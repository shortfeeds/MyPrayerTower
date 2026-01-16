// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'challenge_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PrayerChallengeImpl _$$PrayerChallengeImplFromJson(
  Map<String, dynamic> json,
) => _$PrayerChallengeImpl(
  id: json['id'] as String,
  title: json['title'] as String,
  description: json['description'] as String,
  type:
      $enumDecodeNullable(_$ChallengeTypeEnumMap, json['type']) ??
      ChallengeType.totalCount,
  targetCount: (json['targetCount'] as num).toInt(),
  durationDays: (json['durationDays'] as num).toInt(),
  startDate: json['startDate'] == null
      ? null
      : DateTime.parse(json['startDate'] as String),
  endDate: json['endDate'] == null
      ? null
      : DateTime.parse(json['endDate'] as String),
  rewardXp: (json['rewardXp'] as num).toInt(),
  rewardBadge: json['rewardBadge'] as String?,
  isActive: json['isActive'] as bool? ?? true,
);

Map<String, dynamic> _$$PrayerChallengeImplToJson(
  _$PrayerChallengeImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'description': instance.description,
  'type': _$ChallengeTypeEnumMap[instance.type]!,
  'targetCount': instance.targetCount,
  'durationDays': instance.durationDays,
  'startDate': instance.startDate?.toIso8601String(),
  'endDate': instance.endDate?.toIso8601String(),
  'rewardXp': instance.rewardXp,
  'rewardBadge': instance.rewardBadge,
  'isActive': instance.isActive,
};

const _$ChallengeTypeEnumMap = {
  ChallengeType.streak: 'STREAK',
  ChallengeType.totalCount: 'TOTAL_COUNT',
  ChallengeType.frequency: 'FREQUENCY',
  ChallengeType.specificPrayer: 'SPECIFIC_PRAYER',
};

_$UserChallengeImpl _$$UserChallengeImplFromJson(Map<String, dynamic> json) =>
    _$UserChallengeImpl(
      id: json['id'] as String,
      userId: json['userId'] as String,
      challengeId: json['challengeId'] as String,
      status:
          $enumDecodeNullable(_$UserChallengeStatusEnumMap, json['status']) ??
          UserChallengeStatus.active,
      progress: (json['progress'] as num?)?.toInt() ?? 0,
      joinedAt: DateTime.parse(json['joinedAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      challenge: json['challenge'] == null
          ? null
          : PrayerChallenge.fromJson(json['challenge'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$UserChallengeImplToJson(_$UserChallengeImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'challengeId': instance.challengeId,
      'status': _$UserChallengeStatusEnumMap[instance.status]!,
      'progress': instance.progress,
      'joinedAt': instance.joinedAt.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'challenge': instance.challenge?.toJson(),
    };

const _$UserChallengeStatusEnumMap = {
  UserChallengeStatus.active: 'ACTIVE',
  UserChallengeStatus.completed: 'COMPLETED',
  UserChallengeStatus.failed: 'FAILED',
  UserChallengeStatus.abandoned: 'ABANDONED',
};

_$ChallengeCheckInImpl _$$ChallengeCheckInImplFromJson(
  Map<String, dynamic> json,
) => _$ChallengeCheckInImpl(
  id: json['id'] as String,
  userChallengeId: json['userChallengeId'] as String,
  date: DateTime.parse(json['date'] as String),
  verified: json['verified'] as bool? ?? false,
  notes: json['notes'] as String?,
  data: json['data'] as Map<String, dynamic>?,
);

Map<String, dynamic> _$$ChallengeCheckInImplToJson(
  _$ChallengeCheckInImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'userChallengeId': instance.userChallengeId,
  'date': instance.date.toIso8601String(),
  'verified': instance.verified,
  'notes': instance.notes,
  'data': instance.data,
};
