// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prayer_partner_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PrayerPartnerUserImpl _$$PrayerPartnerUserImplFromJson(
  Map<String, dynamic> json,
) => _$PrayerPartnerUserImpl(
  id: json['id'] as String,
  firstName: json['firstName'] as String?,
  lastName: json['lastName'] as String?,
  avatarUrl: json['avatarUrl'] as String?,
  email: json['email'] as String,
);

Map<String, dynamic> _$$PrayerPartnerUserImplToJson(
  _$PrayerPartnerUserImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'firstName': instance.firstName,
  'lastName': instance.lastName,
  'avatarUrl': instance.avatarUrl,
  'email': instance.email,
};

_$PrayerPartnerImpl _$$PrayerPartnerImplFromJson(Map<String, dynamic> json) =>
    _$PrayerPartnerImpl(
      id: json['id'] as String,
      partner: PrayerPartnerUser.fromJson(
        json['partner'] as Map<String, dynamic>,
      ),
      status: $enumDecode(_$PrayerPartnerStatusEnumMap, json['status']),
      since: DateTime.parse(json['since'] as String),
    );

Map<String, dynamic> _$$PrayerPartnerImplToJson(_$PrayerPartnerImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'partner': instance.partner,
      'status': _$PrayerPartnerStatusEnumMap[instance.status]!,
      'since': instance.since.toIso8601String(),
    };

const _$PrayerPartnerStatusEnumMap = {
  PrayerPartnerStatus.pending: 'PENDING',
  PrayerPartnerStatus.accepted: 'ACCEPTED',
  PrayerPartnerStatus.rejected: 'REJECTED',
  PrayerPartnerStatus.blocked: 'BLOCKED',
};

_$PartnerRequestImpl _$$PartnerRequestImplFromJson(Map<String, dynamic> json) =>
    _$PartnerRequestImpl(
      id: json['id'] as String,
      requester: PrayerPartnerUser.fromJson(
        json['requester'] as Map<String, dynamic>,
      ),
      status: $enumDecode(_$PrayerPartnerStatusEnumMap, json['status']),
      createdAt: DateTime.parse(json['createdAt'] as String),
    );

Map<String, dynamic> _$$PartnerRequestImplToJson(
  _$PartnerRequestImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'requester': instance.requester,
  'status': _$PrayerPartnerStatusEnumMap[instance.status]!,
  'createdAt': instance.createdAt.toIso8601String(),
};
