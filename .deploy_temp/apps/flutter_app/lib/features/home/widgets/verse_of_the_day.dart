import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import '../../../core/theme/app_theme.dart';

/// Daily verses - rotates based on day of year
const List<Map<String, String>> _dailyVerses = [
  {
    'verse': 'I can do all things through Christ who strengthens me.',
    'ref': 'Philippians 4:13',
  },
  {'verse': 'The Lord is my shepherd; I shall not want.', 'ref': 'Psalm 23:1'},
  {
    'verse': 'For God so loved the world that He gave His only begotten Son.',
    'ref': 'John 3:16',
  },
  {
    'verse':
        'Trust in the Lord with all your heart, and lean not on your own understanding.',
    'ref': 'Proverbs 3:5',
  },
  {
    'verse': 'The Lord is my light and my salvation; whom shall I fear?',
    'ref': 'Psalm 27:1',
  },
  {
    'verse':
        'Be strong and courageous. Do not be afraid; do not be discouraged.',
    'ref': 'Joshua 1:9',
  },
  {
    'verse':
        'Come to me, all you who are weary and burdened, and I will give you rest.',
    'ref': 'Matthew 11:28',
  },
  {
    'verse': 'For I know the plans I have for you, declares the Lord.',
    'ref': 'Jeremiah 29:11',
  },
  {
    'verse':
        'The name of the Lord is a fortified tower; the righteous run to it and are safe.',
    'ref': 'Proverbs 18:10',
  },
  {
    'verse': 'Cast all your anxiety on Him because He cares for you.',
    'ref': '1 Peter 5:7',
  },
  {
    'verse': 'But those who hope in the Lord will renew their strength.',
    'ref': 'Isaiah 40:31',
  },
  {
    'verse':
        'And we know that in all things God works for the good of those who love Him.',
    'ref': 'Romans 8:28',
  },
  {
    'verse': 'Peace I leave with you; my peace I give you.',
    'ref': 'John 14:27',
  },
  {
    'verse':
        'The Lord bless you and keep you; the Lord make His face shine on you.',
    'ref': 'Numbers 6:24-25',
  },
  {
    'verse':
        'Delight yourself in the Lord, and He will give you the desires of your heart.',
    'ref': 'Psalm 37:4',
  },
  {
    'verse': 'God is our refuge and strength, an ever-present help in trouble.',
    'ref': 'Psalm 46:1',
  },
  {'verse': 'Be still and know that I am God.', 'ref': 'Psalm 46:10'},
  {
    'verse': 'Your word is a lamp for my feet, a light on my path.',
    'ref': 'Psalm 119:105',
  },
  {
    'verse':
        'The steadfast love of the Lord never ceases; His mercies never come to an end.',
    'ref': 'Lamentations 3:22',
  },
  {
    'verse': 'Jesus said to him, "I am the way, the truth, and the life."',
    'ref': 'John 14:6',
  },
  {
    'verse':
        'Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.',
    'ref': 'Philippians 4:6',
  },
  {
    'verse':
        'Create in me a pure heart, O God, and renew a steadfast spirit within me.',
    'ref': 'Psalm 51:10',
  },
  {
    'verse': 'He heals the brokenhearted and binds up their wounds.',
    'ref': 'Psalm 147:3',
  },
  {
    'verse':
        'Love is patient, love is kind. It does not envy, it does not boast.',
    'ref': '1 Corinthians 13:4',
  },
  {
    'verse':
        'Give thanks to the Lord, for He is good; His love endures forever.',
    'ref': 'Psalm 107:1',
  },
  {
    'verse':
        'Rejoice always, pray continually, give thanks in all circumstances.',
    'ref': '1 Thessalonians 5:16-18',
  },
  {
    'verse': 'Have I not commanded you? Be strong and courageous.',
    'ref': 'Joshua 1:9',
  },
  {'verse': 'The joy of the Lord is your strength.', 'ref': 'Nehemiah 8:10'},
  {
    'verse':
        'May the God of hope fill you with all joy and peace as you trust in Him.',
    'ref': 'Romans 15:13',
  },
  {
    'verse': 'Draw near to God, and He will draw near to you.',
    'ref': 'James 4:8',
  },
  {'verse': 'Every good and perfect gift is from above.', 'ref': 'James 1:17'},
];

class VerseOfTheDayCard extends ConsumerWidget {
  const VerseOfTheDayCard({super.key});

  /// Get verse based on day of year for daily rotation
  Map<String, String> _getTodaysVerse() {
    final now = DateTime.now();
    final startOfYear = DateTime(now.year, 1, 1);
    final dayOfYear = now.difference(startOfYear).inDays;
    final verseIndex = dayOfYear % _dailyVerses.length;
    return _dailyVerses[verseIndex];
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todaysVerse = _getTodaysVerse();
    final verse = todaysVerse['verse']!;
    final reference = todaysVerse['ref']!;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      height: 180,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 15,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Rich Gradient Background (no image)
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0xFF1E1B4B), // Deep indigo
                    Color(0xFF312E81), // Rich purple
                    Color(0xFF1E293B), // Slate
                  ],
                  stops: [0.0, 0.5, 1.0],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),

            // Gradient Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Colors.black.withValues(alpha: 0.8),
                    Colors.black.withValues(alpha: 0.5),
                  ],
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                ),
              ),
            ),

            // Quote decoration
            Positioned(
              right: 16,
              top: 16,
              child: Icon(
                LucideIcons.quote,
                size: 40,
                color: AppTheme.gold500.withValues(alpha: 0.3),
              ),
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 5,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.gold500,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '✨ VERSE OF THE DAY',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(
                          LucideIcons.share2,
                          size: 18,
                          color: Colors.white70,
                        ),
                        onPressed: () {
                          Share.share(
                            '"$verse" - $reference\n\nShared from MyPrayerTower App',
                          );
                        },
                        padding: EdgeInsets.zero,
                        constraints: const BoxConstraints(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '"$verse"',
                    style: GoogleFonts.merriweather(
                      fontSize: 15,
                      height: 1.5,
                      color: Colors.white,
                      fontStyle: FontStyle.italic,
                    ),
                    maxLines: 3,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    reference,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.gold400,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
