// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prayer_group_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PrayerGroupImpl _$$PrayerGroupImplFromJson(Map<String, dynamic> json) =>
    _$PrayerGroupImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String?,
      isPrivate: json['isPrivate'] as bool? ?? true,
      createdBy: json['createdBy'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      members: (json['members'] as List<dynamic>?)
          ?.map((e) => PrayerGroupMember.fromJson(e as Map<String, dynamic>))
          .toList(),
      prayers: (json['prayers'] as List<dynamic>?)
          ?.map((e) => GroupPrayer.fromJson(e as Map<String, dynamic>))
          .toList(),
      counts: json['_count'] == null
          ? null
          : GroupCounts.fromJson(json['_count'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$PrayerGroupImplToJson(_$PrayerGroupImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'description': instance.description,
      'isPrivate': instance.isPrivate,
      'createdBy': instance.createdBy,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'members': instance.members,
      'prayers': instance.prayers,
      '_count': instance.counts,
    };

_$GroupCountsImpl _$$GroupCountsImplFromJson(Map<String, dynamic> json) =>
    _$GroupCountsImpl(
      members: (json['members'] as num?)?.toInt() ?? 0,
      prayers: (json['prayers'] as num?)?.toInt() ?? 0,
    );

Map<String, dynamic> _$$GroupCountsImplToJson(_$GroupCountsImpl instance) =>
    <String, dynamic>{'members': instance.members, 'prayers': instance.prayers};

_$PrayerGroupMemberImpl _$$PrayerGroupMemberImplFromJson(
  Map<String, dynamic> json,
) => _$PrayerGroupMemberImpl(
  id: json['id'] as String,
  userId: json['userId'] as String,
  role: json['role'] as String,
  joinedAt: json['joinedAt'] == null
      ? null
      : DateTime.parse(json['joinedAt'] as String),
  user: json['user'] == null
      ? null
      : GroupMemberUser.fromJson(json['user'] as Map<String, dynamic>),
);

Map<String, dynamic> _$$PrayerGroupMemberImplToJson(
  _$PrayerGroupMemberImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'role': instance.role,
  'joinedAt': instance.joinedAt?.toIso8601String(),
  'user': instance.user,
};

_$GroupMemberUserImpl _$$GroupMemberUserImplFromJson(
  Map<String, dynamic> json,
) => _$GroupMemberUserImpl(
  id: json['id'] as String,
  firstName: json['firstName'] as String?,
  lastName: json['lastName'] as String?,
  avatarUrl: json['avatarUrl'] as String?,
);

Map<String, dynamic> _$$GroupMemberUserImplToJson(
  _$GroupMemberUserImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'firstName': instance.firstName,
  'lastName': instance.lastName,
  'avatarUrl': instance.avatarUrl,
};

_$GroupPrayerImpl _$$GroupPrayerImplFromJson(Map<String, dynamic> json) =>
    _$GroupPrayerImpl(
      id: json['id'] as String,
      content: json['content'] as String,
      userId: json['userId'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      user: json['user'] == null
          ? null
          : GroupMemberUser.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$GroupPrayerImplToJson(_$GroupPrayerImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'userId': instance.userId,
      'createdAt': instance.createdAt.toIso8601String(),
      'user': instance.user,
    };
