// Refresh IDE 1
import 'package:freezed_annotation/freezed_annotation.dart';

part 'challenge_model.freezed.dart';
part 'challenge_model.g.dart';

enum ChallengeType {
  @JsonValue('STREAK')
  streak,
  @JsonValue('TOTAL_COUNT')
  totalCount,
  @JsonValue('FREQUENCY')
  frequency,
  @JsonValue('SPECIFIC_PRAYER')
  specificPrayer,
}

enum UserChallengeStatus {
  @JsonValue('ACTIVE')
  active,
  @JsonValue('COMPLETED')
  completed,
  @JsonValue('FAILED')
  failed,
  @JsonValue('ABANDONED')
  abandoned,
}

@freezed
class PrayerChallenge with _$PrayerChallenge {
  const factory PrayerChallenge({
    required String id,
    required String title,
    required String description,
    @Default(ChallengeType.totalCount) ChallengeType type,
    required int targetCount,
    required int durationDays,
    DateTime? startDate,
    DateTime? endDate,
    required int rewardXp,
    String? rewardBadge,
    @Default(true) bool isActive,
  }) = _PrayerChallenge;

  factory PrayerChallenge.fromJson(Map<String, dynamic> json) =>
      _$PrayerChallengeFromJson(json);
}

@freezed
class UserChallenge with _$UserChallenge {
  // ignore: invalid_annotation_target
  @JsonSerializable(explicitToJson: true)
  const factory UserChallenge({
    required String id,
    required String userId,
    required String challengeId,
    @Default(UserChallengeStatus.active) UserChallengeStatus status,
    @Default(0) int progress,
    required DateTime joinedAt,
    DateTime? completedAt,

    // Relations
    PrayerChallenge? challenge,
  }) = _UserChallenge;

  factory UserChallenge.fromJson(Map<String, dynamic> json) =>
      _$UserChallengeFromJson(json);
}

@freezed
class ChallengeCheckIn with _$ChallengeCheckIn {
  const factory ChallengeCheckIn({
    required String id,
    required String userChallengeId,
    required DateTime date,
    @Default(false) bool verified,
    String? notes,
    Map<String, dynamic>? data,
  }) = _ChallengeCheckIn;

  factory ChallengeCheckIn.fromJson(Map<String, dynamic> json) =>
      _$ChallengeCheckInFromJson(json);
}
