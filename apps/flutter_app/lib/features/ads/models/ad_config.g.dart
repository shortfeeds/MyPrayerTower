// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ad_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$AdConfigImpl _$$AdConfigImplFromJson(Map<String, dynamic> json) =>
    _$AdConfigImpl(
      id: json['id'] as String,
      adSource:
          $enumDecodeNullable(_$AdSourceEnumMap, json['adSource']) ??
          AdSource.offline,
      imageUrl: json['imageUrl'] as String?,
      linkUrl: json['linkUrl'] as String?,
      googleAdUnitId: json['googleAdUnitId'] as String?,
      androidAdUnitId: json['androidAdUnitId'] as String?,
      iosAdUnitId: json['iosAdUnitId'] as String?,
      position: json['position'] as String?,
      priority: (json['priority'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$AdConfigImplToJson(_$AdConfigImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'adSource': _$AdSourceEnumMap[instance.adSource]!,
      'imageUrl': instance.imageUrl,
      'linkUrl': instance.linkUrl,
      'googleAdUnitId': instance.googleAdUnitId,
      'androidAdUnitId': instance.androidAdUnitId,
      'iosAdUnitId': instance.iosAdUnitId,
      'position': instance.position,
      'priority': instance.priority,
    };

const _$AdSourceEnumMap = {
  AdSource.offline: 'OFFLINE',
  AdSource.google: 'GOOGLE',
};
