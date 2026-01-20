import 'package:json_annotation/json_annotation.dart';

part 'memorial_model.g.dart';

@JsonSerializable()
class Memorial {
  final String id;
  final String slug;

  @JsonKey(name: 'first_name')
  final String firstName;

  @JsonKey(name: 'last_name')
  final String lastName;

  @JsonKey(name: 'birth_date')
  final DateTime? birthDate;

  @JsonKey(name: 'death_date')
  final DateTime? deathDate;

  final String? biography;

  @JsonKey(name: 'short_bio')
  final String? shortBio;

  @JsonKey(name: 'photo_url')
  final String? photoUrl;

  @JsonKey(name: 'video_url')
  final String? videoUrl;

  @JsonKey(name: 'music_url')
  final String? musicUrl;

  @JsonKey(name: 'is_public', defaultValue: true)
  final bool isPublic;

  @JsonKey(name: 'payment_id')
  final String? paymentId;

  @JsonKey(name: 'paid_at')
  final DateTime? paidAt;

  @JsonKey(name: 'owner_id')
  final String ownerId;

  final String tier; // 'BASIC' or 'PREMIUM'

  // ... (keeping existing fields) ...

  @JsonKey(name: 'is_verified')
  final bool isVerified;

  @JsonKey(name: 'total_candles', defaultValue: 0)
  final int totalCandles;

  @JsonKey(name: 'total_masses', defaultValue: 0)
  final int totalMasses;

  @JsonKey(name: 'total_flowers', defaultValue: 0)
  final int totalFlowers;

  @JsonKey(name: 'total_prayers', defaultValue: 0)
  final int totalPrayers;

  @JsonKey(name: 'view_count', defaultValue: 0)
  final int viewCount;

  // Relations
  @JsonKey(defaultValue: [])
  final List<MemorialPhoto> photos;

  @JsonKey(defaultValue: [])
  final List<MemorialOffering> offerings;

  @JsonKey(defaultValue: [])
  final List<GuestbookEntry> guestbook;

  const Memorial({
    required this.id,
    required this.slug,
    required this.firstName,
    required this.lastName,
    this.birthDate,
    this.deathDate,
    this.biography,
    this.shortBio,
    this.photoUrl,
    this.videoUrl,
    this.musicUrl,
    this.tier = 'BASIC',
    this.isPublic = true,
    this.paymentId,
    this.paidAt,
    required this.ownerId,
    this.isVerified = false,
    this.totalCandles = 0,
    this.totalMasses = 0,
    this.totalFlowers = 0,
    this.totalPrayers = 0,
    this.viewCount = 0,
    this.photos = const [],
    this.offerings = const [],
    this.guestbook = const [],
  });

  factory Memorial.fromJson(Map<String, dynamic> json) =>
      _$MemorialFromJson(json);
  Map<String, dynamic> toJson() => _$MemorialToJson(this);

  String get fullName => '$firstName $lastName';
}

@JsonSerializable()
class MemorialPhoto {
  final String id;
  final String url;
  final String? caption;

  const MemorialPhoto({required this.id, required this.url, this.caption});

  factory MemorialPhoto.fromJson(Map<String, dynamic> json) =>
      _$MemorialPhotoFromJson(json);
  Map<String, dynamic> toJson() => _$MemorialPhotoToJson(this);
}

@JsonSerializable()
class MemorialOffering {
  final String id;
  final String type; // CANDLE_SMALL, FLOWERS, MASS, etc.
  final double
  amount; // In cents or dollars depending on usage, usually stored as currency

  final String? message;

  @JsonKey(name: 'is_anonymous')
  final bool isAnonymous;

  @JsonKey(name: 'guest_name')
  final String? guestName;

  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  final MemorialUser? user; // Simple user profile info

  const MemorialOffering({
    required this.id,
    required this.type,
    required this.amount,
    this.message,
    this.isAnonymous = false,
    this.guestName,
    required this.createdAt,
    this.user,
  });

  factory MemorialOffering.fromJson(Map<String, dynamic> json) =>
      _$MemorialOfferingFromJson(json);
  Map<String, dynamic> toJson() => _$MemorialOfferingToJson(this);
}

@JsonSerializable()
class GuestbookEntry {
  final String id;
  final String message;

  @JsonKey(name: 'guest_name')
  final String? guestName;

  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  final MemorialUser? user;

  const GuestbookEntry({
    required this.id,
    required this.message,
    this.guestName,
    required this.createdAt,
    this.user,
  });

  factory GuestbookEntry.fromJson(Map<String, dynamic> json) =>
      _$GuestbookEntryFromJson(json);
  Map<String, dynamic> toJson() => _$GuestbookEntryToJson(this);
}

@JsonSerializable()
class MemorialUser {
  @JsonKey(name: 'display_name')
  final String? displayName;

  @JsonKey(name: 'avatar_url')
  final String? avatarUrl;

  const MemorialUser({this.displayName, this.avatarUrl});

  factory MemorialUser.fromJson(Map<String, dynamic> json) =>
      _$MemorialUserFromJson(json);
  Map<String, dynamic> toJson() => _$MemorialUserToJson(this);
}
