import 'package:freezed_annotation/freezed_annotation.dart';

part 'prayer_partner_model.freezed.dart';
part 'prayer_partner_model.g.dart';

enum PrayerPartnerStatus {
  @JsonValue('PENDING')
  pending,
  @JsonValue('ACCEPTED')
  accepted,
  @JsonValue('REJECTED')
  rejected,
  @JsonValue('BLOCKED')
  blocked,
}

@freezed
class PrayerPartnerUser with _$PrayerPartnerUser {
  const factory PrayerPartnerUser({
    required String id,
    String? firstName,
    String? lastName,
    String? avatarUrl,
    required String email,
  }) = _PrayerPartnerUser;

  factory PrayerPartnerUser.fromJson(Map<String, dynamic> json) =>
      _$PrayerPartnerUserFromJson(json);
}

@freezed
class PrayerPartner with _$PrayerPartner {
  const factory PrayerPartner({
    required String id,
    required PrayerPartnerUser partner,
    required PrayerPartnerStatus status,
    required DateTime since,
  }) = _PrayerPartner;

  factory PrayerPartner.fromJson(Map<String, dynamic> json) =>
      _$PrayerPartnerFromJson(json);
}

@freezed
class PartnerRequest with _$PartnerRequest {
  const factory PartnerRequest({
    required String id,
    required PrayerPartnerUser requester,
    required PrayerPartnerStatus status,
    required DateTime createdAt,
  }) = _PartnerRequest;

  factory PartnerRequest.fromJson(Map<String, dynamic> json) =>
      _$PartnerRequestFromJson(json);
}
