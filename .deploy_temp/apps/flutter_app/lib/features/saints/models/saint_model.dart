// Refresh IDE 2
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
    String? bornDate,
    String? diedDate,
    String? canonizedDate,
    String? externalId,
    DateTime? lastSyncedAt,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Saint;

  factory Saint.fromJson(Map<String, dynamic> json) => _$SaintFromJson(json);
}
