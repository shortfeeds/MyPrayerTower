import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/challenge_model.dart';

final challengesRepositoryProvider = Provider<ChallengesRepository>((ref) {
  return ChallengesRepository(ref.watch(supabaseProvider));
});

class ChallengesRepository {
  final SupabaseClient _supabase;

  ChallengesRepository(this._supabase);

  /// Get active global challenges
  Future<List<PrayerChallenge>> getActiveChallenges() async {
    final data = await _supabase
        .from('PrayerChallenge')
        .select()
        .eq('isActive', true)
        .order('startDate', ascending: false);

    return (data as List)
        .map((json) => PrayerChallenge.fromJson(json))
        .toList();
  }

  /// Get challenges user has joined
  Future<List<UserChallenge>> getUserChallenges(String userId) async {
    // We want to include the Challenge details (join)
    final data = await _supabase
        .from('UserChallenge')
        .select('*, challenge:PrayerChallenge(*)')
        .eq('userId', userId);

    return (data as List).map((json) => UserChallenge.fromJson(json)).toList();
  }

  /// Join a challenge
  Future<void> joinChallenge(String userId, String challengeId) async {
    await _supabase.from('UserChallenge').insert({
      'userId': userId,
      'challengeId': challengeId,
      'joinedAt': DateTime.now().toIso8601String(),
      'status': 'ACTIVE',
      'progress': 0,
    });
  }

  /// Check in progress
  Future<void> logProgress(String userChallengeId, int increment) async {
    // Note: RPC call preferred for atomic increment
    await _supabase.rpc(
      'increment_challenge_progress',
      params: {'user_challenge_id': userChallengeId, 'amount': increment},
    );
  }
}
