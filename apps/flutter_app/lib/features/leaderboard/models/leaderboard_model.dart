import 'package:freezed_annotation/freezed_annotation.dart';
import '../../auth/models/user_model.dart';

part 'leaderboard_model.freezed.dart';
part 'leaderboard_model.g.dart';

@freezed
class LeaderboardEntry with _$LeaderboardEntry {
  const factory LeaderboardEntry({
    required String id,
    required String userId,
    required String period,
    @Default(0) int score,
    int? rank,

    // Relation: Field name in Prisma is 'User'
    @JsonKey(name: 'User') User? user,
  }) = _LeaderboardEntry;

  factory LeaderboardEntry.fromJson(Map<String, dynamic> json) =>
      _$LeaderboardEntryFromJson(json);
}
