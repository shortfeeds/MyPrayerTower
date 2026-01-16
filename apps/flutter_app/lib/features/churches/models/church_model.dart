// Refresh IDE 2
import 'package:freezed_annotation/freezed_annotation.dart';

part 'church_model.freezed.dart';
part 'church_model.g.dart';

@freezed
class Church with _$Church {
  const factory Church({
    required String id,
    required String name,
    required String slug,
    String? address,
    required String city,
    String? state,
    String? country,
    String? countryCode,
    String? postalCode,
    String? primaryImageUrl,
    String? website,
    String? phone,
    String? email,
    @Default('PARISH') String type,
    String? denomination,
    String? dioceseId,
    @Default(false) bool isVerified,
    DateTime? verifiedAt,
    String? claimedBy,
    String? description,
    String? shortDescription,
    String? history,
    String? virtualTourUrl,
    String? calendarUrl,
    String? externalId,
    double? latitude,
    double? longitude,
    Map<String, dynamic>? massSchedule,
    Map<String, dynamic>? confessionSchedule,
    Map<String, dynamic>? adorationSchedule,
    DateTime? lastSyncedAt,
    @Default(0) int viewCount,
    @Default(0) int followerCount,
    @JsonKey(name: 'stripeAccountId') String? stripeAccountId,
    @JsonKey(name: 'totalDonations') @Default(0) int totalDonations,
    @JsonKey(name: 'donationCount') @Default(0) int donationCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Church;

  factory Church.fromJson(Map<String, dynamic> json) => _$ChurchFromJson(json);
}
