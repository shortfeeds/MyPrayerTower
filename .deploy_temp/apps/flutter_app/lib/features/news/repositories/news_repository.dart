import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/news_article_model.dart';

final newsRepositoryProvider = Provider<NewsRepository>((ref) {
  return NewsRepository(ref.watch(supabaseProvider));
});

class NewsRepository {
  final SupabaseClient _supabase;

  NewsRepository(this._supabase);

  /// Fetch latest news
  Future<List<NewsArticle>> getLatestNews({
    int limit = 20,
    int offset = 0,
  }) async {
    try {
      final data = await _supabase
          .from('NewsArticle')
          .select()
          .order('publishedAt', ascending: false)
          .range(offset, offset + limit - 1);

      return (data as List).map((json) => NewsArticle.fromJson(json)).toList();
    } catch (e) {
      // Return empty list if table missing or error
      return [];
    }
  }

  /// Get articles by source
  Future<List<NewsArticle>> getNewsBySource(String source) async {
    final data = await _supabase
        .from('NewsArticle')
        .select()
        .eq('source', source)
        .order('publishedAt', ascending: false)
        .limit(20);

    return (data as List).map((json) => NewsArticle.fromJson(json)).toList();
  }
}
