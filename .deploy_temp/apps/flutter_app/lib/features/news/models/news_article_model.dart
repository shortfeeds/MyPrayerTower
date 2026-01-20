import 'package:freezed_annotation/freezed_annotation.dart';

part 'news_article_model.freezed.dart';
part 'news_article_model.g.dart';

@freezed
class NewsArticle with _$NewsArticle {
  const factory NewsArticle({
    required String id,
    required String externalId,
    required String source,
    required String title,
    String? summary,
    String? content,
    String? imageUrl,
    required String linkUrl,
    String? author,
    String? category,
    required DateTime publishedAt,
    required DateTime fetchedAt,
  }) = _NewsArticle;

  factory NewsArticle.fromJson(Map<String, dynamic> json) =>
      _$NewsArticleFromJson(json);
}
