// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'candle_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CandleImpl _$$CandleImplFromJson(Map<String, dynamic> json) => _$CandleImpl(
  id: json['id'] as String,
  intention: json['intention'] as String,
  isAnonymous: json['isAnonymous'] as bool? ?? false,
  name: json['name'] as String?,
  duration: json['duration'] as String,
  litAt: DateTime.parse(json['litAt'] as String),
  expiresAt: DateTime.parse(json['expiresAt'] as String),
  isActive: json['isActive'] as bool? ?? true,
  prayerCount: (json['prayerCount'] as num?)?.toInt() ?? 0,
);

Map<String, dynamic> _$$CandleImplToJson(_$CandleImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'intention': instance.intention,
      'isAnonymous': instance.isAnonymous,
      'name': instance.name,
      'duration': instance.duration,
      'litAt': instance.litAt.toIso8601String(),
      'expiresAt': instance.expiresAt.toIso8601String(),
      'isActive': instance.isActive,
      'prayerCount': instance.prayerCount,
    };
