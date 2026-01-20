import 'package:freezed_annotation/freezed_annotation.dart';

part 'prayer_group_model.freezed.dart';
part 'prayer_group_model.g.dart';

@freezed
class PrayerGroup with _$PrayerGroup {
  const factory PrayerGroup({
    required String id,
    required String name,
    String? description,
    @Default(true) bool isPrivate,
    required String createdBy,
    required DateTime createdAt,
    required DateTime updatedAt,
    List<PrayerGroupMember>? members,
    List<GroupPrayer>? prayers,
    @JsonKey(name: '_count') GroupCounts? counts,
  }) = _PrayerGroup;

  factory PrayerGroup.fromJson(Map<String, dynamic> json) =>
      _$PrayerGroupFromJson(json);
}

@freezed
class GroupCounts with _$GroupCounts {
  const factory GroupCounts({
    @Default(0) int members,
    @Default(0) int prayers,
  }) = _GroupCounts;

  factory GroupCounts.fromJson(Map<String, dynamic> json) =>
      _$GroupCountsFromJson(json);
}

@freezed
class PrayerGroupMember with _$PrayerGroupMember {
  const factory PrayerGroupMember({
    required String id,
    required String userId,
    required String role, // ADMIN, MEMBER
    DateTime? joinedAt,
    GroupMemberUser? user,
  }) = _PrayerGroupMember;

  factory PrayerGroupMember.fromJson(Map<String, dynamic> json) =>
      _$PrayerGroupMemberFromJson(json);
}

@freezed
class GroupMemberUser with _$GroupMemberUser {
  const factory GroupMemberUser({
    required String id,
    String? firstName,
    String? lastName,
    String? avatarUrl,
  }) = _GroupMemberUser;

  factory GroupMemberUser.fromJson(Map<String, dynamic> json) =>
      _$GroupMemberUserFromJson(json);
}

@freezed
class GroupPrayer with _$GroupPrayer {
  const factory GroupPrayer({
    required String id,
    required String content,
    required String userId,
    required DateTime createdAt,
    GroupMemberUser? user,
  }) = _GroupPrayer;

  factory GroupPrayer.fromJson(Map<String, dynamic> json) =>
      _$GroupPrayerFromJson(json);
}
