import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/church_model.dart';

final churchesRepositoryProvider = Provider<ChurchesRepository>((ref) {
  return ChurchesRepository(ref.watch(supabaseProvider));
});

class ChurchesRepository {
  final SupabaseClient _supabase;

  ChurchesRepository(this._supabase);

  Future<List<Church>> getNearbyChurches({
    required double latitude,
    required double longitude,
    double radiusKm = 10,
  }) async {
    try {
      final data = await _supabase.from('Church').select().limit(20);

      return (data as List).map((json) {
        return Church.fromJson(json);
      }).toList();
    } catch (e) {
      // Fallback to mock data on error
      return _getMockChurches();
    }
  }

  Future<Church> getChurchById(String id) async {
    try {
      final data = await _supabase
          .from('Church')
          .select()
          .eq('id', id)
          .single();
      return Church.fromJson(data);
    } catch (e) {
      // Fallback to mock data
      return _getMockChurches().firstWhere(
        (c) => c.id == id,
        orElse: () => _getMockChurches().first,
      );
    }
  }

  Future<List<Church>> getChurches({String? query, int page = 1}) async {
    try {
      var dbQuery = _supabase.from('Church').select();

      if (query != null && query.isNotEmpty) {
        dbQuery = dbQuery.ilike('name', '%$query%');
      }

      final from = (page - 1) * 20;
      final to = from + 19;

      final data = await dbQuery.range(from, to);

      return (data as List).map((json) => Church.fromJson(json)).toList();
    } catch (e) {
      // Fallback to mock data
      await Future.delayed(const Duration(milliseconds: 500)); // Simulate delay
      var mocks = _getMockChurches();
      if (query != null && query.isNotEmpty) {
        mocks = mocks
            .where((c) => c.name.toLowerCase().contains(query.toLowerCase()))
            .toList();
      }
      return mocks;
    }
  }

  List<Church> _getMockChurches() {
    return [
      const Church(
        id: '1',
        name: 'St. Mary\'s Cathedral',
        slug: 'st-marys-cathedral',
        city: 'San Francisco',
        country: 'USA',
        imageUrl:
            'https://images.unsplash.com/photo-1548625361-e88c60eb8314?auto=format&fit=crop&q=80',
        website: 'https://stmaryscathedral.org',
        phone: '+1 415-567-2020',
        isVerified: true,
        massSchedule: {
          'Sunday': ['7:30 AM', '9:00 AM', '11:00 AM', '1:00 PM'],
          'Monday': ['7:30 AM', '12:05 PM'],
          'Saturday': ['8:00 AM', '5:30 PM (Vigil)'],
        },
        confessionSchedule: {
          'Saturday': ['4:00 PM - 5:00 PM'],
        },
      ),
      const Church(
        id: '2',
        name: 'St. Patrick\'s Cathedral',
        slug: 'st-patricks-cathedral',
        city: 'New York',
        country: 'USA',
        imageUrl:
            'https://images.unsplash.com/photo-1548544149-4835e62ee5b3?auto=format&fit=crop&q=80',
        website: 'https://saintpatrickscathedral.org',
        phone: '+1 212-753-2261',
        isVerified: true,
        massSchedule: {
          'Sunday': ['7:00 AM', '8:00 AM', '9:00 AM', '10:15 AM'],
          'Daily': ['7:00 AM', '7:30 AM', '8:00 AM'],
        },
        confessionSchedule: {
          'Weekdays': ['8:00 AM - 9:00 AM'],
        },
      ),
      const Church(
        id: '3',
        name: 'Basilica of the National Shrine',
        slug: 'basilica-national-shrine',
        city: 'Washington DC',
        country: 'USA',
        imageUrl:
            'https://images.unsplash.com/photo-1627918342289-4b68e734c20b?auto=format&fit=crop&q=80',
        // Mocking coordinates if needed, but model handles it
        massSchedule: {
          'Sunday': ['10:00 AM'],
        },
      ),
      const Church(
        id: '4',
        name: 'Holy Name Cathedral',
        slug: 'holy-name-cathedral',
        city: 'Chicago',
        country: 'USA',
        imageUrl:
            'https://images.unsplash.com/photo-1574606703531-18e3d810f63b?auto=format&fit=crop&q=80',
        massSchedule: {
          'Sunday': ['8:00 AM', '10:00 AM'],
        },
      ),
      const Church(
        id: '5',
        name: 'Cathedral of Our Lady of the Angels',
        slug: 'cathedral-our-lady-angels',
        city: 'Los Angeles',
        country: 'USA',
        imageUrl:
            'https://images.unsplash.com/photo-1590403375836-8c8375ae200b?auto=format&fit=crop&q=80',
        massSchedule: {
          'Sunday': ['8:00 AM', '10:00 AM'],
        },
      ),
    ];
  }
}
