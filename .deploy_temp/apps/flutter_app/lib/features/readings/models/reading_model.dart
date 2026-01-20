// Refresh IDE 2
import 'package:freezed_annotation/freezed_annotation.dart';

part 'reading_model.freezed.dart';
part 'reading_model.g.dart';

@freezed
class DailyReading with _$DailyReading {
  const factory DailyReading({
    required String id,
    required DateTime date,
    String? liturgicalSeason,
    String? liturgicalColor,
    String? feastName,
    String? firstReading,
    String? firstReadingRef,
    String? psalm,
    String? psalmRef,
    String? secondReading,
    String? secondReadingRef,
    String? gospel,
    String? gospelRef,
    String? reflection,
    DateTime? createdAt,
  }) = _DailyReading;

  factory DailyReading.fromJson(Map<String, dynamic> json) =>
      _$DailyReadingFromJson(json);
}

// Legacy alias for backward compatibility
typedef Reading = DailyReading;
