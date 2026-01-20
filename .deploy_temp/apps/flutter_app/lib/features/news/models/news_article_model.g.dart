// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'news_article_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$NewsArticleImpl _$$NewsArticleImplFromJson(Map<String, dynamic> json) =>
    _$NewsArticleImpl(
      id: json['id'] as String,
      externalId: json['externalId'] as String,
      source: json['source'] as String,
      title: json['title'] as String,
      summary: json['summary'] as String?,
      content: json['content'] as String?,
      imageUrl: json['imageUrl'] as String?,
      linkUrl: json['linkUrl'] as String,
      author: json['author'] as String?,
      category: json['category'] as String?,
      publishedAt: DateTime.parse(json['publishedAt'] as String),
      fetchedAt: DateTime.parse(json['fetchedAt'] as String),
    );

Map<String, dynamic> _$$NewsArticleImplToJson(_$NewsArticleImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'externalId': instance.externalId,
      'source': instance.source,
      'title': instance.title,
      'summary': instance.summary,
      'content': instance.content,
      'imageUrl': instance.imageUrl,
      'linkUrl': instance.linkUrl,
      'author': instance.author,
      'category': instance.category,
      'publishedAt': instance.publishedAt.toIso8601String(),
      'fetchedAt': instance.fetchedAt.toIso8601String(),
    };
