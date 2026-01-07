// Refresh IDE
import 'package:freezed_annotation/freezed_annotation.dart';

part 'saint_model.freezed.dart';
part 'saint_model.g.dart';

@freezed
class Saint with _$Saint {
  const factory Saint({
    required String id,
    required String name,
    required String slug,
    String? title,
    String? feastDay,
    int? feastMonth,
    int? feastDayOfMonth,
    String? biography,
    String? shortBio,
    String? imageUrl,
    List<String>? patronOf,
    String? prayer,
  }) = _Saint;

  factory Saint.fromJson(Map<String, dynamic> json) => _$SaintFromJson(json);
}
