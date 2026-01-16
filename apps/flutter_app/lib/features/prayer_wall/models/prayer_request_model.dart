import 'package:freezed_annotation/freezed_annotation.dart';

part 'prayer_request_model.freezed.dart';
part 'prayer_request_model.g.dart';

@freezed
class PrayerUser with _$PrayerUser {
  const factory PrayerUser({
    String? firstName,
    String? lastName,
    String? avatarUrl,
  }) = _PrayerUser;

  factory PrayerUser.fromJson(Map<String, dynamic> json) =>
      _$PrayerUserFromJson(json);
}

@freezed
class PrayerRequest with _$PrayerRequest {
  const factory PrayerRequest({
    required String id,
    required String content,
    String? userId,
    @JsonKey(name: 'prayerCount') @Default(0) int prayerCount,
    @JsonKey(name: 'isAnonymous') @Default(false) bool isAnonymous,
    String? category,
    String? country,
    @Default('PUBLIC') String visibility,
    @JsonKey(name: 'isAnswered') @Default(false) bool isAnswered,
    @Default('PENDING') String status,
    @JsonKey(name: 'User') PrayerUser? user,
    DateTime? createdAt,
  }) = _PrayerRequest;

  factory PrayerRequest.fromJson(Map<String, dynamic> json) =>
      _$PrayerRequestFromJson(json);
}
