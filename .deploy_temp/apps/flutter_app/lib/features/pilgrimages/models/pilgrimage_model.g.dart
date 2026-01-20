// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'pilgrimage_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PilgrimageImpl _$$PilgrimageImplFromJson(Map<String, dynamic> json) =>
    _$PilgrimageImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      location: json['location'] as String,
      country: json['country'] as String,
      description: json['description'] as String,
      significance: json['significance'] as String,
      imageUrl: json['imageUrl'] as String,
      virtualTourUrl: json['virtualTourUrl'] as String?,
      viewCount: (json['viewCount'] as num?)?.toInt() ?? 0,
      createdAt: json['createdAt'] == null
          ? null
          : DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] == null
          ? null
          : DateTime.parse(json['updatedAt'] as String),
    );

Map<String, dynamic> _$$PilgrimageImplToJson(_$PilgrimageImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'location': instance.location,
      'country': instance.country,
      'description': instance.description,
      'significance': instance.significance,
      'imageUrl': instance.imageUrl,
      'virtualTourUrl': instance.virtualTourUrl,
      'viewCount': instance.viewCount,
      'createdAt': instance.createdAt?.toIso8601String(),
      'updatedAt': instance.updatedAt?.toIso8601String(),
    };
