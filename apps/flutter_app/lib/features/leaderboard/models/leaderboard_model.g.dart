// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leaderboard_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$LeaderboardEntryImpl _$$LeaderboardEntryImplFromJson(
  Map<String, dynamic> json,
) => _$LeaderboardEntryImpl(
  id: json['id'] as String,
  userId: json['userId'] as String,
  period: json['period'] as String,
  score: (json['score'] as num?)?.toInt() ?? 0,
  rank: (json['rank'] as num?)?.toInt(),
  user: json['User'] == null
      ? null
      : User.fromJson(json['User'] as Map<String, dynamic>),
);

Map<String, dynamic> _$$LeaderboardEntryImplToJson(
  _$LeaderboardEntryImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'period': instance.period,
  'score': instance.score,
  'rank': instance.rank,
  'User': instance.user,
};
