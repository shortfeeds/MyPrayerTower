import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/memorial_model.dart';

final memorialRepositoryProvider = Provider<MemorialRepository>((ref) {
  return MemorialRepository();
});

class MemorialRepository {
  SupabaseClient get _client => Supabase.instance.client;

  // Sample memorial data for fallback
  static List<Memorial> _sampleMemorials() {
    return [
      Memorial(
        id: 's-1',
        slug: 'maria-santos',
        firstName: 'Maria',
        lastName: 'Santos',
        birthDate: DateTime(1945, 3, 15),
        deathDate: DateTime(2023, 8, 22),
        shortBio:
            'A loving mother and grandmother who touched many lives with her kindness.',
        tier: 'PREMIUM',
        isVerified: true,
        totalCandles: 156,
        totalMasses: 12,
        totalFlowers: 45,
        ownerId: 'sample-owner',
      ),
      Memorial(
        id: 's-2',
        slug: 'john-murphy',
        firstName: 'John',
        lastName: 'Murphy',
        birthDate: DateTime(1938, 7, 4),
        deathDate: DateTime(2024, 1, 10),
        shortBio: 'A devoted father, veteran, and man of deep faith.',
        tier: 'PREMIUM',
        isVerified: true,
        totalCandles: 234,
        totalMasses: 8,
        totalFlowers: 67,
        ownerId: 'sample-owner',
      ),
      Memorial(
        id: 's-3',
        slug: 'anna-kowalski',
        firstName: 'Anna',
        lastName: 'Kowalski',
        birthDate: DateTime(1952, 11, 30),
        deathDate: DateTime(2023, 5, 18),
        shortBio: 'A beautiful soul who dedicated her life to helping others.',
        tier: 'BASIC',
        isVerified: false,
        totalCandles: 89,
        totalMasses: 5,
        totalFlowers: 23,
        ownerId: 'sample-owner',
      ),
      Memorial(
        id: 's-4',
        slug: 'michael-chen',
        firstName: 'Michael',
        lastName: 'Chen',
        birthDate: DateTime(1960, 2, 28),
        deathDate: DateTime(2024, 6, 5),
        shortBio: 'A brilliant mind and compassionate heart.',
        tier: 'BASIC',
        isVerified: false,
        totalCandles: 45,
        totalMasses: 3,
        totalFlowers: 12,
        ownerId: 'sample-owner',
      ),
      Memorial(
        id: 's-5',
        slug: 'patricia-oconnor',
        firstName: 'Patricia',
        lastName: "O'Connor",
        birthDate: DateTime(1942, 9, 12),
        deathDate: DateTime(2023, 12, 25),
        shortBio: 'A woman of grace whose faith inspired all who knew her.',
        tier: 'PREMIUM',
        isVerified: true,
        totalCandles: 312,
        totalMasses: 15,
        totalFlowers: 78,
        ownerId: 'sample-owner',
      ),
      Memorial(
        id: 's-6',
        slug: 'james-wilson',
        firstName: 'James',
        lastName: 'Wilson',
        birthDate: DateTime(1955, 4, 7),
        deathDate: DateTime(2024, 2, 14),
        shortBio: 'A beloved husband, father, and community servant.',
        tier: 'BASIC',
        isVerified: false,
        totalCandles: 67,
        totalMasses: 4,
        totalFlowers: 19,
        ownerId: 'sample-owner',
      ),
    ];
  }

  /// Fetch all memorials with optional pagination
  Future<List<Memorial>> getMemorials({int limit = 20, int offset = 0}) async {
    try {
      final response = await _client
          .from('Memorial')
          .select('''
            *,
            photos:MemorialPhoto(*),
            offerings:MemorialOffering(*),
            guestbook:MemorialGuestbook(*)
          ''')
          .order('is_verified', ascending: false) // Verified/Premium first
          .order('created_at', ascending: false)
          .range(offset, offset + limit - 1);

      final results = (response as List)
          .map((e) => Memorial.fromJson(e))
          .toList();

      // If Supabase returns empty, use sample data
      if (results.isEmpty && offset == 0) {
        return _sampleMemorials();
      }
      return results;
    } catch (e) {
      debugPrint('Error fetching memorials: $e');
      // Return sample data on error for first page
      if (offset == 0) {
        return _sampleMemorials();
      }
      return [];
    }
  }

  /// Get a single memorial by ID or Slug
  Future<Memorial?> getMemorialById(String id) async {
    try {
      final response = await _client
          .from('Memorial')
          .select('''
            *,
            photos:MemorialPhoto(*),
            offerings:MemorialOffering(
              *,
              user:profiles(display_name, avatar_url)
            ),
            guestbook:MemorialGuestbook(
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
        .from('Memorial')
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
    await _client.from('MemorialGuestbook').insert({
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
    await _client.from('MemorialOffering').insert({
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
    await _client.from('Memorial').update({'tier': tier}).eq('id', memorialId);
  }
}
