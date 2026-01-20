import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/saint_model.dart';

final saintsRepositoryProvider = Provider<SaintsRepository>((ref) {
  return SaintsRepository(ref.watch(supabaseProvider));
});

class SaintsRepository {
  final SupabaseClient _supabase;

  SaintsRepository(this._supabase);

  Future<Saint> getSaintOfTheDay({DateTime? date}) async {
    final now = date ?? DateTime.now();
    final month = now.month;
    final day = now.day;

    try {
      // Query by today's feast day (month and day of month)
      final data = await _supabase
          .from('Saint')
          .select()
          .eq('feastMonth', month)
          .eq('feastDayOfMonth', day)
          .limit(1)
          .maybeSingle();

      if (data != null) {
        return Saint.fromJson(data);
      }

      // Fallback: Get any saint for this month
      final monthData = await _supabase
          .from('Saint')
          .select()
          .eq('feastMonth', month)
          .limit(1)
          .maybeSingle();

      if (monthData != null) {
        return Saint.fromJson(monthData);
      }

      // Last fallback: Mock data
      return _getMockSaint();
    } catch (e) {
      return _getMockSaint();
    }
  }

  /// Get all saints with optional pagination and month filter
  Future<List<Saint>> getAllSaints({
    int page = 1,
    int limit = 24,
    int? month,
  }) async {
    try {
      final from = (page - 1) * limit;
      final to = from + limit - 1;

      var query = _supabase.from('Saint').select();

      if (month != null) {
        query = query.eq('feastMonth', month);
      }

      final data = await query
          .order('feastMonth', ascending: true)
          .order('feastDayOfMonth', ascending: true)
          .range(from, to);

      return (data as List).map((json) => Saint.fromJson(json)).toList();
    } catch (e) {
      return _getMockSaints();
    }
  }

  Future<List<Saint>> searchSaints(String query) async {
    try {
      final data = await _supabase
          .from('Saint')
          .select()
          .ilike('name', '%$query%')
          .limit(20);

      return (data as List).map((json) => Saint.fromJson(json)).toList();
    } catch (e) {
      // Fallback to mock search
      final mocks = _getMockSaints();
      return mocks
          .where((s) => s.name.toLowerCase().contains(query.toLowerCase()))
          .toList();
    }
  }

  Saint _getMockSaint() {
    return _getMockSaints().first;
  }

  List<Saint> _getMockSaints() {
    return [
      const Saint(
        id: '1',
        name: 'St. Francis of Assisi',
        slug: 'st-francis-of-assisi',
        title: 'Patron of Animals',
        biography:
            'Saint Francis of Assisi was a Catholic friar who gave up a life of wealth to live in poverty. He founded the Franciscan Order and is known for his love of nature and animals.',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Saint_Francis_of_Assisi_by_Cigoli.jpg/800px-Saint_Francis_of_Assisi_by_Cigoli.jpg',
        patronOf: ['Animals', 'Environment', 'Merchants'],
        prayer: 'Lord, make me an instrument of your peace...',
        feastDay: 'October 4',
      ),
      const Saint(
        id: '2',
        name: 'St. Therese of Lisieux',
        slug: 'st-therese-lisieux',
        title: 'The Little Flower',
        biography:
            'St. Thérèse of Lisieux was a French Catholic Discalced Carmelite nun who is widely venerated in modern times.',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Th%C3%A9r%C3%A8se_de_Lisieux.jpg/800px-Th%C3%A9r%C3%A8se_de_Lisieux.jpg',
        patronOf: ['Missionaries', 'Florists', 'Pilots'],
        prayer:
            'My God, I choose all! I do not want to be a saint by halves...',
        feastDay: 'October 1',
      ),
      const Saint(
        id: '3',
        name: 'St. Anthony of Padua',
        slug: 'st-anthony-padua',
        title: 'Finder of Lost Things',
        biography:
            'Saint Anthony of Padua was a Portuguese Catholic priest and friar of the Franciscan Order.',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/4/4f/Saint_Anthony_of_Padua_-_Murillo.jpg',
        patronOf: ['Lost Things', 'Poor People', 'Travelers'],
        prayer: 'O Holy St. Anthony, gentlest of Saints, your love for God...',
        feastDay: 'June 13',
      ),
      const Saint(
        id: '4',
        name: 'St. Jude Thaddeus',
        slug: 'st-jude',
        title: 'Patron of Hopeless Causes',
        biography: 'Saint Jude was one of the Twelve Apostles of Jesus.',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/San_Judas_Tadeo_%28El_Greco%29.jpg/800px-San_Judas_Tadeo_%28El_Greco%29.jpg',
        patronOf: ['Desperate Situations', 'Forgotten Causes'],
        feastDay: 'October 28',
      ),
      const Saint(
        id: '5',
        name: 'St. Padre Pio',
        slug: 'st-padre-pio',
        title: 'The Stigmatist',
        biography:
            'Pio of Pietrelcina was an Italian Franciscan Capuchin, friar, priest, stigmatist, and mystic.',
        imageUrl:
            'https://upload.wikimedia.org/wikipedia/commons/6/60/Pio_of_Pietrelcina.jpg',
        patronOf: ['Civil Defense Volunteers', 'Adolescents'],
        prayer:
            'Stay with me, Lord, for it is necessary to have You present...',
        feastDay: 'September 23',
      ),
    ];
  }
}
