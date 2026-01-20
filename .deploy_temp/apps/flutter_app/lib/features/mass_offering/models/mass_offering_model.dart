import 'package:freezed_annotation/freezed_annotation.dart';

part 'mass_offering_model.freezed.dart';
part 'mass_offering_model.g.dart';

enum MassOfferingType {
  @JsonValue('REGULAR')
  regular,
  @JsonValue('EXPEDITED')
  expedited,
  @JsonValue('NOVENA')
  novena,
  @JsonValue('GREGORIAN')
  gregorian,
  @JsonValue('PERPETUAL')
  perpetual,
  @JsonValue('MONTHLY_CLUB')
  monthlyClub,
}

enum IntentionCategory {
  // For the Living
  @JsonValue('THANKSGIVING')
  thanksgiving,
  @JsonValue('GOOD_HEALTH')
  goodHealth,
  @JsonValue('HEALING')
  healing,
  @JsonValue('BIRTHDAY_BLESSING')
  birthdayBlessing,
  @JsonValue('WEDDING_ANNIVERSARY')
  weddingAnniversary,
  @JsonValue('SAFE_TRAVEL')
  safeTravel,
  @JsonValue('EXAM_SUCCESS')
  examSuccess,
  @JsonValue('CAREER_SUCCESS')
  careerSuccess,
  @JsonValue('FAMILY_PEACE')
  familyPeace,
  @JsonValue('FAMILY_UNITY')
  familyUnity,
  @JsonValue('PROTECTION')
  protection,
  @JsonValue('CONVERSION')
  conversion,
  @JsonValue('SPECIAL_GRACE')
  specialGrace,
  @JsonValue('VOCATIONS')
  vocations,

  // For the Deceased
  @JsonValue('REPOSE_OF_SOUL')
  reposeOfSoul,
  @JsonValue('ALL_SOULS')
  allSouls,
  @JsonValue('DEATH_ANNIVERSARY')
  deathAnniversary,
  @JsonValue('RECENTLY_DECEASED')
  recentlyDeceased,
  @JsonValue('FORGOTTEN_SOULS')
  forgottenSouls,
  @JsonValue('PURGATORY')
  purgatory,

  // Special Occasions
  @JsonValue('FEAST_DAY')
  feastDay,
  @JsonValue('ALL_SAINTS')
  allSaints,
  @JsonValue('CHRISTMAS')
  christmas,
  @JsonValue('EASTER')
  easter,
  @JsonValue('MOTHERS_DAY')
  mothersDay,
  @JsonValue('FATHERS_DAY')
  fathersDay,

  // General
  @JsonValue('SPECIAL_INTENTION')
  specialIntention,
  @JsonValue('OTHER')
  other,
}

enum MassOfferingStatus {
  @JsonValue('PENDING')
  pendingPayment,
  @JsonValue('PAID')
  paid,
  @JsonValue('ASSIGNED')
  assigned,
  @JsonValue('SCHEDULED')
  scheduled,
  @JsonValue('OFFERED')
  offered,
  @JsonValue('COMPLETED')
  completed,
  @JsonValue('CANCELLED')
  cancelled,
  @JsonValue('REFUNDED')
  refunded,
}

@freezed
class MassOffering with _$MassOffering {
  // ignore: invalid_annotation_target
  @JsonSerializable()
  const factory MassOffering({
    required String id,
    required String orderNumber,

    @Default(MassOfferingType.regular) MassOfferingType offeringType,
    required int amount,
    @Default('usd') String currency,

    // Intention Details
    required String intentionFor,
    @Default([]) List<String> additionalNames,
    @Default(false) bool isForLiving,
    @Default([]) List<IntentionCategory> categories,
    String? specialIntention,

    // Tribute/Memorial
    String? offeredBy,
    String? inMemoryOf,
    String? inHonorOf,
    String? tributeMessage,

    // Purchaser Info
    String? userId,
    required String email,
    required String name,
    String? phone,

    // Gift Option
    @Default(false) bool isGift,
    String? recipientEmail,
    String? recipientName,
    String? giftMessage,
    DateTime? sendDate,

    // Status & Payment
    @Default(MassOfferingStatus.pendingPayment) MassOfferingStatus status,
    String? stripePaymentId,
    String? stripeSessionId,
    DateTime? paidAt,

    // Fulfillment
    String? partnerId,
    DateTime? celebrationDate,
    String? celebrant,
    String? massTime,

    // Digital Deliverables
    String? certificateUrl,
    DateTime? cardGeneratedAt,
    @Default(false) bool confirmationSent,
    @Default(false) bool celebrationNotificationSent,

    // Upsells
    @Default(false) bool includesPrayerCandle,
    @Default(false) bool includesPrintedCard,
    @Default(false) bool includesFramedCertificate,

    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _MassOffering;

  factory MassOffering.fromJson(Map<String, dynamic> json) =>
      _$MassOfferingFromJson(json);
}
