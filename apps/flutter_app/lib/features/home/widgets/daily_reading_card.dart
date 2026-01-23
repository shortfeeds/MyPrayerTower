import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/animations/premium_animations.dart';
import '../../../core/theme/app_theme.dart';
import '../../readings/providers/readings_provider.dart';

class DailyReadingCard extends ConsumerWidget {
  const DailyReadingCard({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final readingAsync = ref.watch(dailyReadingProvider);

    return readingAsync.when(
      data: (reading) => FadeInSlideUp(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 260),
          child: Container(
            decoration: AppTheme.sacredCardDecoration,
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => context.push('/readings/daily'),
                borderRadius: BorderRadius.circular(16),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppTheme.sacredNavy800,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(
                              LucideIcons.bookOpen,
                              color: AppTheme.gold500,
                              size: 18,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            'Daily Reading',
                            style: GoogleFonts.merriweather(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const Spacer(),
                          const Icon(
                            LucideIcons.arrowRight,
                            color: AppTheme.textMuted,
                            size: 18,
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        reading.firstReadingRef ?? 'Daily Reading',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppTheme.gold400,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Flexible(
                        child: Text(
                          reading.firstReading ?? '',
                          overflow: TextOverflow.ellipsis,
                          maxLines: 5,
                          style: GoogleFonts.merriweather(
                            fontSize: 14,
                            color: AppTheme.textSecondary,
                            height: 1.5,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          if (reading.liturgicalColor != null) ...[
                            Container(
                              width: 8,
                              height: 8,
                              decoration: BoxDecoration(
                                color: _getLiturgicalColor(
                                  reading.liturgicalColor!,
                                ),
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              reading.liturgicalColor!,
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: AppTheme.textMuted,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ],
                  ),
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

  Color _getLiturgicalColor(String colorName) {
    switch (colorName.toLowerCase()) {
      case 'green':
        return Colors.green;
      case 'white':
        return Colors.white;
      case 'red':
        return Colors.red;
      case 'purple':
      case 'violet':
        return Colors.purple;
      case 'rose':
      case 'pink':
        return Colors.pink;
      default:
        return AppTheme.gold500;
    }
  }
}
