import 'package:freezed_annotation/freezed_annotation.dart';

part 'reading_model.freezed.dart';
part 'reading_model.g.dart';

@freezed
class Reading with _$Reading {
  const factory Reading({
    required String id,
    required DateTime date,
    required String title,
    required String reference,
    required String text, // Markdown text
    String? imageUrl,
    @Default('Daily') String type, // Daily, Sunday, Feast
    String? liturgicalColor,
  }) = _Reading;

  factory Reading.fromJson(Map<String, dynamic> json) =>
      _$ReadingFromJson(json);
}
