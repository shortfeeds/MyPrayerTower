// Refresh IDE 7
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class User with _$User {
  const User._();

  const factory User({
    required String id,
    required String email,
    @Default(false) bool emailVerified,
    String? phone,
    @Default(false) bool phoneVerified,
    String? firstName,
    String? lastName,
    String? displayName,
    String? avatarUrl,
    String? bio,
    @Default('en') String language,
    @Default('UTC') String timezone,
    @Default(true) bool notificationsEnabled,
    @Default('FREE') String subscriptionTier, // FREE, PLUS, PREMIUM, LIFETIME
    DateTime? subscriptionEnds,
    String? subscriptionSource,
    String? stripeCustomerId,
    String? homeChurchId,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? lastLoginAt,
    DateTime? lastConfessionAt,
    DateTime? lastStreakUpdate,
    @Default(0) int longestStreak,
    @Default(0) int streakCount,
    @Default(0) int currentStreak,
    @Default(0) int totalPrayers,
    @Default(0) int totalPrayedFor,
    @Default(1) int level,
    @Default(0) int xp,
    DateTime? lastPrayerDate,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  /// Helper to get display name
  String get name =>
      displayName ?? '${firstName ?? ''} ${lastName ?? ''}'.trim();

  /// Check if user has premium access
  bool get isPremium =>
      subscriptionTier == 'PREMIUM' || subscriptionTier == 'LIFETIME';

  /// Check if user has plus or higher access
  bool get isPlusOrHigher => subscriptionTier != 'FREE';
}
