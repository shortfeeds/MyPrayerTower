import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/reading_model.dart';

final readingsRepositoryProvider = Provider<ReadingsRepository>((ref) {
  return ReadingsRepository();
});

class ReadingsRepository {
  ReadingsRepository();

  Future<Reading> getDailyReading({DateTime? date}) async {
    // try {
    //   final response = await _client.get('/readings/daily', queryParameters: {
    //     if (date != null) 'date': date.toIso8601String(),
    //   });
    //   return Reading.fromJson(response.data);
    // } catch (e) {
    // Mock data for now until API is ready
    return Future.delayed(
      const Duration(seconds: 1),
      () => Reading(
        id: '1',
        date: date ?? DateTime.now(),
        title: 'First Reading',
        reference: 'Genesis 1:1-5',
        text:
            'In the beginning God created the heavens and the earth. Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.\n\nAnd God said, "Let there be light," and there was light. God saw that the light was good, and he separated the light from the darkness. God called the light "day," and the darkness he called "night." And there was evening, and there was morning—the first day.',
        liturgicalColor: 'Green',
        imageUrl:
            'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?q=80&w=2070&auto=format&fit=crop',
      ),
    );
    // }
  }

  Future<List<Reading>> getReadingsForWeek() async {
    return Future.delayed(
      const Duration(seconds: 1),
      () => List.generate(
        7,
        (index) => Reading(
          id: 'day_\$index',
          date: DateTime.now().add(Duration(days: index)),
          title: 'Daily Reading',
          reference: 'Matthew 5:\${1 + index}-12',
          text:
              'Blessed are the poor in spirit, for theirs is the kingdom of heaven...',
          liturgicalColor: 'Green',
        ),
      ),
    );
  }
}
