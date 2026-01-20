import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/animations/premium_animations.dart';
import '../../../core/theme/app_theme.dart';

// Minimal generic Saint model for UI display
class Saint {
  final String id;
  final String name;
  final String? title;
  final String? imageUrl;
  final String? shortBio;

  const Saint({
    required this.id,
    required this.name,
    this.title,
    this.imageUrl,
    this.shortBio,
  });
}

// Mock provider since feature was removed
final saintOfTheDayProvider = FutureProvider<Saint>((ref) async {
  // Return a static saint for now to keep UI valid
  return const Saint(
    id: 'st-michael',
    name: 'St. Michael the Archangel',
    title: 'Defender in Battle',
    imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Guido_Reni_-_Saint_Michael_the_Archangel_-_Google_Art_Project.jpg/400px-Guido_Reni_-_Saint_Michael_the_Archangel_-_Google_Art_Project.jpg',
    shortBio:
        'Defend us in battle, be our protection against the wickedness and snares of the devil.',
  );
});

class SaintOfDayCard extends ConsumerWidget {
  const SaintOfDayCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final saintAsync = ref.watch(saintOfTheDayProvider);

    return saintAsync.when(
      data: (saint) => FadeInSlideUp(
        delay: const Duration(milliseconds: 100),
        child: Container(
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [
                Color(0xFF1E1B4B), // Deep indigo
                Color(0xFF312E81), // Rich purple
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.2)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.3),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () {
                context.push('/saints/st-michael');
              },
              borderRadius: BorderRadius.circular(16),
              child: Padding(
                padding: const EdgeInsets.all(16), // Reduced from 20
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header with badge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10), // Reduced
                          decoration: BoxDecoration(
                            color: AppTheme.gold500.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(
                              color: AppTheme.gold500.withValues(alpha: 0.3),
                            ),
                          ),
                          child: const Icon(
                            LucideIcons.sparkles,
                            color: AppTheme.gold500,
                            size: 20, // Reduced from 24
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.gold500,
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Text(
                            'Saint of the Day',
                            style: GoogleFonts.inter(
                              fontSize: 10, // Reduced from 11
                              fontWeight: FontWeight.bold,
                              color: AppTheme.sacredNavy900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12), // Reduced from 16
                    // Saint name
                    Text(
                      saint.name,
                      style: GoogleFonts.merriweather(
                        fontSize: 17, // Reduced from 20
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      maxLines: 1, // Changed from 2
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (saint.title != null) ...const [
                      SizedBox(height: 2), // Reduced from 4
                    ],
                    if (saint.title != null)
                      Text(
                        saint.title!,
                        style: GoogleFonts.inter(
                          fontSize: 12, // Reduced from 13
                          color: AppTheme.gold400,
                          fontWeight: FontWeight.w500,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    const SizedBox(height: 8), // Reduced from 12
                    // Bio
                    Flexible(
                      child: Text(
                        saint.shortBio ?? '',
                        maxLines: 2, // Reduced from 3
                        overflow: TextOverflow.ellipsis,
                        style: GoogleFonts.inter(
                          fontSize: 12, // Reduced from 13
                          color: Colors.white70,
                          height: 1.4, // Reduced from 1.5
                        ),
                      ),
                    ),
                    // Removed "Learn More" row to save space - card is tappable
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
      loading: () => PremiumShimmer(
        child: Container(
          height: 260,
          decoration: BoxDecoration(
            color: AppTheme.sacredNavy900,
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      error: (err, stack) => const SizedBox.shrink(),
    );
  }
}
