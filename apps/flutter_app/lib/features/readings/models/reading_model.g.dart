// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reading_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ReadingImpl _$$ReadingImplFromJson(Map<String, dynamic> json) =>
    _$ReadingImpl(
      id: json['id'] as String,
      date: DateTime.parse(json['date'] as String),
      title: json['title'] as String,
      reference: json['reference'] as String,
      text: json['text'] as String,
      imageUrl: json['imageUrl'] as String?,
      type: json['type'] as String? ?? 'Daily',
      liturgicalColor: json['liturgicalColor'] as String?,
    );

Map<String, dynamic> _$$ReadingImplToJson(_$ReadingImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'date': instance.date.toIso8601String(),
      'title': instance.title,
      'reference': instance.reference,
      'text': instance.text,
      'imageUrl': instance.imageUrl,
      'type': instance.type,
      'liturgicalColor': instance.liturgicalColor,
    };
