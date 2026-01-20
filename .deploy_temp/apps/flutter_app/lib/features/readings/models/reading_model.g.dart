// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reading_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DailyReadingImpl _$$DailyReadingImplFromJson(Map<String, dynamic> json) =>
    _$DailyReadingImpl(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      liturgicalSeason: json['liturgicalSeason'] as String?,
      liturgicalColor: json['liturgicalColor'] as String?,
      feastName: json['feastName'] as String?,
      firstReading: json['firstReading'] as String?,
      firstReadingRef: json['firstReadingRef'] as String?,
      psalm: json['psalm'] as String?,
      psalmRef: json['psalmRef'] as String?,
      secondReading: json['secondReading'] as String?,
      secondReadingRef: json['secondReadingRef'] as String?,
      gospel: json['gospel'] as String?,
      gospelRef: json['gospelRef'] as String?,
      reflection: json['reflection'] as String?,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$DailyReadingImplToJson(_$DailyReadingImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
      'liturgicalSeason': instance.liturgicalSeason,
      'liturgicalColor': instance.liturgicalColor,
      'feastName': instance.feastName,
      'firstReading': instance.firstReading,
      'firstReadingRef': instance.firstReadingRef,
      'psalm': instance.psalm,
      'psalmRef': instance.psalmRef,
      'secondReading': instance.secondReading,
      'secondReadingRef': instance.secondReadingRef,
      'gospel': instance.gospel,
      'gospelRef': instance.gospelRef,
      'reflection': instance.reflection,
      'createdAt': instance.createdAt?.toIso8601String(),
    };
