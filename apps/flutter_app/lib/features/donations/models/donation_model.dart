import 'package:freezed_annotation/freezed_annotation.dart';

part 'donation_model.freezed.dart';
part 'donation_model.g.dart';

/// Donation tier configuration
@freezed
class DonationTier with _$DonationTier {
  const factory DonationTier({
    required String id,
    required String label,
    required String icon,
    required int amount, // in cents
    String? description,
    @Default(false) bool isPopular,
  }) = _DonationTier;

  factory DonationTier.fromJson(Map<String, dynamic> json) =>
      _$DonationTierFromJson(json);
}

/// Subscription plan for recurring donations
@freezed
class SubscriptionPlan with _$SubscriptionPlan {
  const factory SubscriptionPlan({
    required String id,
    required String name,
    required String icon,
    required int price, // in cents per month
    required List<String> perks,
    @Default(false) bool isPopular,
  }) = _SubscriptionPlan;

  factory SubscriptionPlan.fromJson(Map<String, dynamic> json) =>
      _$SubscriptionPlanFromJson(json);
}

/// Donation request payload
@freezed
class DonationRequest with _$DonationRequest {
  const factory DonationRequest({
    required int amount,
    required String email,
    required String name,
    String? phone,
    @Default(false) bool isAnonymous,
    String? message,
    String? inMemoryOf,
    String? inHonorOf,
    @Default(false) bool coversFee,
    @Default('usd') String currency,
  }) = _DonationRequest;

  factory DonationRequest.fromJson(Map<String, dynamic> json) =>
      _$DonationRequestFromJson(json);
}
