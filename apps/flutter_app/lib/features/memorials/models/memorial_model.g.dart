// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'memorial_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Memorial _$MemorialFromJson(Map<String, dynamic> json) => Memorial(
  id: json['id'] as String,
  slug: json['slug'] as String,
  firstName: json['first_name'] as String,
  lastName: json['last_name'] as String,
  birthDate: json['birth_date'] == null
      ? null
      : DateTime.parse(json['birth_date'] as String),
  deathDate: json['death_date'] == null
      ? null
      : DateTime.parse(json['death_date'] as String),
  biography: json['biography'] as String?,
  shortBio: json['short_bio'] as String?,
  photoUrl: json['photo_url'] as String?,
  videoUrl: json['video_url'] as String?,
  tier: json['tier'] as String,
  isVerified: json['is_verified'] as bool? ?? false,
  totalCandles: (json['total_candles'] as num?)?.toInt() ?? 0,
  totalMasses: (json['total_masses'] as num?)?.toInt() ?? 0,
  totalFlowers: (json['total_flowers'] as num?)?.toInt() ?? 0,
  totalPrayers: (json['total_prayers'] as num?)?.toInt() ?? 0,
  viewCount: (json['view_count'] as num?)?.toInt() ?? 0,
  photos:
      (json['photos'] as List<dynamic>?)
          ?.map((e) => MemorialPhoto.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [],
  offerings:
      (json['offerings'] as List<dynamic>?)
          ?.map((e) => MemorialOffering.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [],
  guestbook:
      (json['guestbook'] as List<dynamic>?)
          ?.map((e) => GuestbookEntry.fromJson(e as Map<String, dynamic>))
          .toList() ??
      [],
);

Map<String, dynamic> _$MemorialToJson(Memorial instance) => <String, dynamic>{
  'id': instance.id,
  'slug': instance.slug,
  'first_name': instance.firstName,
  'last_name': instance.lastName,
  'birth_date': instance.birthDate?.toIso8601String(),
  'death_date': instance.deathDate?.toIso8601String(),
  'biography': instance.biography,
  'short_bio': instance.shortBio,
  'photo_url': instance.photoUrl,
  'video_url': instance.videoUrl,
  'tier': instance.tier,
  'is_verified': instance.isVerified,
  'total_candles': instance.totalCandles,
  'total_masses': instance.totalMasses,
  'total_flowers': instance.totalFlowers,
  'total_prayers': instance.totalPrayers,
  'view_count': instance.viewCount,
  'photos': instance.photos,
  'offerings': instance.offerings,
  'guestbook': instance.guestbook,
};

MemorialPhoto _$MemorialPhotoFromJson(Map<String, dynamic> json) =>
    MemorialPhoto(
      id: json['id'] as String,
      url: json['url'] as String,
      caption: json['caption'] as String?,
    );

Map<String, dynamic> _$MemorialPhotoToJson(MemorialPhoto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'url': instance.url,
      'caption': instance.caption,
    };

MemorialOffering _$MemorialOfferingFromJson(Map<String, dynamic> json) =>
    MemorialOffering(
      id: json['id'] as String,
      type: json['type'] as String,
      amount: (json['amount'] as num).toDouble(),
      message: json['message'] as String?,
      isAnonymous: json['is_anonymous'] as bool? ?? false,
      guestName: json['guest_name'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      user: json['user'] == null
          ? null
          : MemorialUser.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$MemorialOfferingToJson(MemorialOffering instance) =>
    <String, dynamic>{
      'id': instance.id,
      'type': instance.type,
      'amount': instance.amount,
      'message': instance.message,
      'is_anonymous': instance.isAnonymous,
      'guest_name': instance.guestName,
      'created_at': instance.createdAt.toIso8601String(),
      'user': instance.user,
    };

GuestbookEntry _$GuestbookEntryFromJson(Map<String, dynamic> json) =>
    GuestbookEntry(
      id: json['id'] as String,
      message: json['message'] as String,
      guestName: json['guest_name'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      user: json['user'] == null
          ? null
          : MemorialUser.fromJson(json['user'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$GuestbookEntryToJson(GuestbookEntry instance) =>
    <String, dynamic>{
      'id': instance.id,
      'message': instance.message,
      'guest_name': instance.guestName,
      'created_at': instance.createdAt.toIso8601String(),
      'user': instance.user,
    };

MemorialUser _$MemorialUserFromJson(Map<String, dynamic> json) => MemorialUser(
  displayName: json['display_name'] as String?,
  avatarUrl: json['avatar_url'] as String?,
);

Map<String, dynamic> _$MemorialUserToJson(MemorialUser instance) =>
    <String, dynamic>{
      'display_name': instance.displayName,
      'avatar_url': instance.avatarUrl,
    };
