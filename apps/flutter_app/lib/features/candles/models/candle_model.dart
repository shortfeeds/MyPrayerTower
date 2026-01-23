import 'package:freezed_annotation/freezed_annotation.dart';

part 'candle_model.freezed.dart';
part 'candle_model.g.dart';

@freezed
class Candle with _$Candle {
  const Candle._();

  const factory Candle({
    required String id,
    required String intention,
    @Default(false) bool isAnonymous,
    String? name,
    required String duration, // ONE_DAY, THREE_DAYS, SEVEN_DAYS, THIRTY_DAYS
    required DateTime litAt,
    required DateTime expiresAt,
    @Default(true) bool isActive,
    // Helper fields for UI (calculated or fallback)
    @Default(0) int prayerCount,
  }) = _Candle;

  factory Candle.fromJson(Map<String, dynamic> json) => _$CandleFromJson(json);

  // Helpers to match Web App logic
  String get tier {
    switch (duration) {
      case 'THIRTY_DAYS':
        return 'divine';
      case 'FOURTEEN_DAYS':
        return 'marian';
      case 'SEVEN_DAYS':
        return 'altar';
      case 'THREE_DAYS':
        return 'devotion';
      default:
        return 'free';
    }
  }

  String get tierLabel {
    switch (tier) {
      case 'divine':
      case 'marian':
      case 'altar':
        return 'Premium';
      case 'devotion':
        return 'Standard';
      default:
        return 'Free';
    }
  }

  String get color {
    switch (duration) {
      case 'THIRTY_DAYS':
        return 'gold';
      case 'SEVEN_DAYS':
        return 'blue';
      case 'THREE_DAYS':
        return 'red';
      default:
        return 'white';
    }
  }

  String get displayName => isAnonymous ? 'Anonymous' : (name ?? 'Anonymous');

  int get remainingHours {
    final diff = expiresAt.difference(DateTime.now());
    return diff.inHours > 0 ? diff.inHours : 0;
  }
}
