import 'package:freezed_annotation/freezed_annotation.dart';

part 'prayer_model.freezed.dart';
part 'prayer_model.g.dart';

@freezed
class Prayer with _$Prayer {
  const factory Prayer({
    required int id,
    required String title,
    required String content,
    required String category,
    @JsonKey(name: 'category_label') String? categoryLabel,
    @JsonKey(name: 'is_active') @Default(true) bool isActive,
    List<String>? tags,
  }) = _Prayer;

  factory Prayer.fromJson(Map<String, dynamic> json) => _$PrayerFromJson(json);
}
