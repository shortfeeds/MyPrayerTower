import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
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
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Saint details coming soon')),
                );
              },
              borderRadius: BorderRadius.circular(16),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header with badge
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.gold500.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: AppTheme.gold500.withValues(alpha: 0.3),
                            ),
                          ),
                          child: const Icon(
                            LucideIcons.sparkles,
                            color: AppTheme.gold500,
                            size: 24,
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.gold500,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            'Saint of the Day',
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.sacredNavy900,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Saint name
                    Text(
                      saint.name,
                      style: GoogleFonts.merriweather(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (saint.title != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        saint.title!,
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppTheme.gold400,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                    const SizedBox(height: 12),
                    // Bio
                    Text(
                      saint.shortBio ?? '',
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: Colors.white70,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Read more button
                    Row(
                      children: [
                        Text(
                          'Learn More',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.gold400,
                          ),
                        ),
                        const SizedBox(width: 6),
                        const Icon(
                          LucideIcons.arrowRight,
                          size: 14,
                          color: AppTheme.gold400,
                        ),
                      ],
                    ),
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
