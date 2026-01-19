import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/reading_model.dart';
import '../../home_widget/services/home_widget_service.dart';

final readingsRepositoryProvider = Provider<ReadingsRepository>((ref) {
  return ReadingsRepository();
});

class ReadingsRepository {
  ReadingsRepository();

  Future<DailyReading> getDailyReading({DateTime? date}) async {
    // Mock data for now until API is ready
    return Future.delayed(const Duration(seconds: 1), () async {
      final reading = DailyReading(
        id: '1',
        date: date ?? DateTime.now(),
        liturgicalSeason: 'Ordinary Time',
        liturgicalColor: 'Green',
        feastName: null,
        firstReading:
            'In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.\n\nAnd God said, "Let there be light," and there was light. God saw that the light was good, and he separated the light from the darkness. God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.',
        firstReadingRef: 'Genesis 1:1-5',
        psalm: 'The Lord is my shepherd, I lack nothing.',
        psalmRef: 'Psalm 23:1',
        gospel:
            'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
        gospelRef: 'Matthew 5:1-12',
        reflection:
            'Today we reflect on the beginning of creation and God\'s eternal plan.',
      );

      _updateWidget(reading);
      return reading;
    });
  }

  Future<List<DailyReading>> getReadingsForWeek() async {
    return Future.delayed(
      const Duration(seconds: 1),
      () => List.generate(
        7,
        (index) => DailyReading(
          id: 'day_$index',
          date: DateTime.now().add(Duration(days: index)),
          liturgicalSeason: 'Ordinary Time',
          liturgicalColor: 'Green',
          firstReading:
              'Blessed are the poor in spirit, for theirs is the kingdom of heaven...',
          firstReadingRef: 'Matthew 5:${1 + index}-12',
          gospel: 'The Gospel reading for day ${index + 1}',
          gospelRef: 'Matthew ${5 + index}:1-12',
        ),
      ),
    );
  }

  void _updateWidget(DailyReading reading) {
    HomeWidgetService.updateWidget(
      title: 'Verse of the Day',
      content:
          reading.gospel ?? reading.firstReading ?? 'Read today\'s gospel.',
      subtext: reading.gospelRef ?? reading.firstReadingRef,
    );
  }
}
