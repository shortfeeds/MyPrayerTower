import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/memorial_model.dart';

final memorialRepositoryProvider = Provider<MemorialRepository>((ref) {
  return MemorialRepository();
});

class MemorialRepository {
  final SupabaseClient _client = Supabase.instance.client;

  /// Fetch all memorials with optional pagination
  Future<List<Memorial>> getMemorials({int limit = 20, int offset = 0}) async {
    final response = await _client
        .from('memorials')
        .select('''
          *,
          photos:memorial_photos(*),
          offerings:memorial_offerings(*),
          guestbook:memorial_guestbook(*)
        ''')
        .order('is_verified', ascending: false) // Verified/Premium first
        .order('created_at', ascending: false)
        .range(offset, offset + limit - 1);

    return (response as List).map((e) => Memorial.fromJson(e)).toList();
  }

  /// Get a single memorial by ID or Slug
  Future<Memorial?> getMemorialById(String id) async {
    try {
      final response = await _client
          .from('memorials')
          .select('''
            *,
            photos:memorial_photos(*),
            offerings:memorial_offerings(
              *,
              user:profiles(display_name, avatar_url)
            ),
            guestbook:memorial_guestbook(
              *,
              user:profiles(display_name, avatar_url)
            )
          ''')
          .eq('id', id)
          .single();

      return Memorial.fromJson(response);
    } catch (e) {
      return null;
    }
  }

  /// Create a new memorial
  Future<Memorial> createMemorial(Map<String, dynamic> data) async {
    final response = await _client
        .from('memorials')
        .insert(data)
        .select()
        .single();

    return Memorial.fromJson(response);
  }

  /// Add a guestbook entry
  Future<void> addGuestbookEntry({
    required String memorialId,
    required String message,
  }) async {
    final user = _client.auth.currentUser;
    await _client.from('memorial_guestbook').insert({
      'memorial_id': memorialId,
      'message': message,
      'user_id': user?.id,
    });
  }

  /// Add an offering (Candle, Flower, etc.)
  Future<void> addOffering({
    required String memorialId,
    required String type,
    required double amount,
    String? message,
    bool isAnonymous = false,
  }) async {
    final user = _client.auth.currentUser;
    await _client.from('memorial_offerings').insert({
      'memorial_id': memorialId,
      'type': type,
      'amount': amount,
      'message': message,
      'is_anonymous': isAnonymous,
      'user_id': user?.id,
    });

    // Also increment counters on the main memorial table (optional, usually handled by triggers)
    // database trigger usually handles `total_candles`, `total_flowers` etc.
  }

  /// Increment view count
  Future<void> incrementViewCount(String memorialId) async {
    await _client.rpc(
      'increment_memorial_view_count',
      params: {'row_id': memorialId},
    );
  }

  /// Update memorial tier
  Future<void> updateTier(String memorialId, String tier) async {
    await _client.from('memorials').update({'tier': tier}).eq('id', memorialId);
  }
}
