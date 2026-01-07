// Refresh IDE
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String email,
    String? name,
    String? avatarUrl,
    @Default('FREE') String subscriptionStatus, // FREE, PLUS, PREMIUM, LIFETIME
    @Default(false) bool isEmailVerified,
    @Default(0) int streakCount,
    @Default(0) int longestStreak,
    DateTime? lastStreakUpdate,
    DateTime? createdAt,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
