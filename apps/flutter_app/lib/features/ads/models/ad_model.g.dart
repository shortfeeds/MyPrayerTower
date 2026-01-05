// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ad_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AdModelImpl _$$AdModelImplFromJson(Map<String, dynamic> json) =>
    _$AdModelImpl(
      id: json['id'] as String,
      adSource: json['adSource'] as String,
      imageUrl: json['imageUrl'] as String?,
      linkUrl: json['linkUrl'] as String?,
      googleAdUnitId: json['googleAdUnitId'] as String?,
      altText: json['altText'] as String?,
      position: json['position'] as String?,
    );

Map<String, dynamic> _$$AdModelImplToJson(_$AdModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'adSource': instance.adSource,
      'imageUrl': instance.imageUrl,
      'linkUrl': instance.linkUrl,
      'googleAdUnitId': instance.googleAdUnitId,
      'altText': instance.altText,
      'position': instance.position,
    };
