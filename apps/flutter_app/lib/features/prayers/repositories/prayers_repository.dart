import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/prayer_model.dart';

final prayersRepositoryProvider = Provider<PrayersRepository>((ref) {
  return PrayersRepository(ref.watch(supabaseProvider));
});

class PrayersRepository {
  final SupabaseClient _supabase;

  PrayersRepository(this._supabase);

  Future<List<Prayer>> getPrayers({String? category, int page = 1}) async {
    try {
      var query = _supabase.from('Prayer').select();

      if (category != null && category != 'ALL') {
        query = query.ilike('category', category);
      }

      // Pagination: 20 items per page
      final from = (page - 1) * 20;
      final to = from + 19;

      final data = await query.range(from, to);

      return (data as List).map((json) => Prayer.fromJson(json)).toList();
    } catch (e) {
      // Fallback to mock data on error
      return _getMockPrayers(category);
    }
  }

  List<Prayer> _getMockPrayers(String? category) {
    final allPrayers = [
      const Prayer(
        id: 1,
        title: 'The Lord\'s Prayer',
        content: 'Our Father, who art in heaven...',
        category: 'Common Prayers',
        tags: ['Basic', 'Daily'],
      ),
      const Prayer(
        id: 2,
        title: 'Hail Mary',
        content: 'Hail Mary, full of grace...',
        category: 'Marian',
        tags: ['Rosary', 'Mary'],
      ),
      const Prayer(
        id: 3,
        title: 'Glory Be',
        content: 'Glory be to the Father, and to the Son...',
        category: 'Common Prayers',
        tags: ['Basic', 'Doxology'],
      ),
      const Prayer(
        id: 4,
        title: 'Act of Contrition',
        content: 'O my God, I am heartily sorry...',
        category: 'Confession',
        tags: ['Forigveness', 'Sacrament'],
      ),
      const Prayer(
        id: 5,
        title: 'Angel of God',
        content: 'Angel of God, my guardian dear...',
        category: 'Daily',
        tags: ['Guardian Angel', 'Morning', 'Evening'],
      ),
      const Prayer(
        id: 6,
        title: 'Come Holy Spirit',
        content: 'Come Holy Spirit, fill the hearts of your faithful...',
        category: 'Holy Spirit',
        tags: ['Pentecost', 'GUIDANCE'],
      ),
      const Prayer(
        id: 7,
        title: 'St. Michael Prayer',
        content: 'St. Michael the Archangel, defend us in battle...',
        category: 'Saints',
        tags: ['Protection', 'Archangel'],
      ),
      const Prayer(
        id: 8,
        title: 'Memorare',
        content: 'Remember, O most gracious Virgin Mary...',
        category: 'Marian',
        tags: ['Petition', 'Mary'],
      ),
    ];

    if (category != null && category != 'ALL') {
      return allPrayers
          .where((p) => p.category.toUpperCase() == category.toUpperCase())
          .toList();
    }
    return allPrayers;
  }
}
