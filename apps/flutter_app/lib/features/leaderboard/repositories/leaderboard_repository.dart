import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/leaderboard_model.dart';

final leaderboardRepositoryProvider = Provider<LeaderboardRepository>((ref) {
  return LeaderboardRepository(ref.watch(supabaseProvider));
});

class LeaderboardRepository {
  final SupabaseClient _supabase;

  LeaderboardRepository(this._supabase);

  /// Get leaderboard for a specific period (e.g. 'weekly_2026_01')
  Future<List<LeaderboardEntry>> getLeaderboard(
    String period, {
    int limit = 20,
  }) async {
    final data = await _supabase
        .from('Leaderboard')
        .select('*, User(*)') // Select Relation 'User'
        .eq('period', period)
        .order('score', ascending: false)
        .limit(limit);

    return (data as List)
        .map((json) => LeaderboardEntry.fromJson(json))
        .toList();
  }

  /// Get simplified global top
  Future<List<LeaderboardEntry>> getGlobalTop({int limit = 10}) async {
    // Assuming period 'all_time' or filtering differently.
    // For now just return latest period if standard.
    // Or just sort by score.
    // Without period, we might get duplicates per user.
    // Skipping for now unless 'all_time' partition exists.
    return [];
  }
}
