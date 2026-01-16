// Refresh IDE 3
import 'package:freezed_annotation/freezed_annotation.dart';

part 'prayer_model.freezed.dart';
part 'prayer_model.g.dart';

/// Helper to parse BigInt/int/String id from Supabase
int _parseId(dynamic value) {
  if (value is int) return value;
  if (value is String) return int.tryParse(value) ?? 0;
  return 0;
}

@freezed
class Prayer with _$Prayer {
  const factory Prayer({
    @JsonKey(fromJson: _parseId) required int id,
    required String title,
    String? slug,
    required String content,
    required String category,
    @JsonKey(name: 'category_label') String? categoryLabel,
    @Default([]) List<String> tags,
    @JsonKey(name: 'is_active') @Default(true) bool? isActive,
    @JsonKey(name: 'created_at') DateTime? createdAt,
  }) = _Prayer;

  factory Prayer.fromJson(Map<String, dynamic> json) => _$PrayerFromJson(json);
}
