import 'package:freezed_annotation/freezed_annotation.dart';

part 'prayer_request_model.freezed.dart';
part 'prayer_request_model.g.dart';

@freezed
class PrayerRequest with _$PrayerRequest {
  const factory PrayerRequest({
    required String id,
    required String content,
    String? userId,
    @JsonKey(name: 'prayerCount') @Default(0) int prayCount,
    required bool isAnonymous,
    String? category,
    DateTime? createdAt,
  }) = _PrayerRequest;

  factory PrayerRequest.fromJson(Map<String, dynamic> json) =>
      _$PrayerRequestFromJson(json);
}
